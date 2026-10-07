"""
Xhibit AI API

  POST  /api/enquiries                 contact-form leads (validated, rate-limited, honeypot)
  POST  /api/events                    anonymous interaction counts (WhatsApp taps, demo views)
  GET   /api/health

  Admin (send header  Authorization: Bearer <ADMIN_TOKEN>):
  GET   /api/admin/enquiries           list, filter by ?status=new
  PATCH /api/admin/enquiries/{id}      update status / notes
  GET   /api/admin/enquiries.csv       export for Excel / Google Sheets
  GET   /api/admin/stats               leads by industry + which demos people open

Interactive docs: /api/docs
"""

import csv
import hashlib
import hmac
import io
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Query, Request, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import get_settings
from .db import Base, SessionLocal, engine, get_db
from .models import Enquiry, Event
from .notify import notify_enquiry
from .ratelimit import RateLimiter
from .schemas import EnquiryCreated, EnquiryIn, EnquiryOut, EnquiryUpdate, EventIn

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Creates tables on first run. For later schema changes, add Alembic migrations.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(
    title="Xhibit AI API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

enquiry_limiter = RateLimiter(settings.enquiries_per_10_min, 600)
event_limiter = RateLimiter(settings.events_per_10_min, 600)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{settings.ip_hash_salt}:{ip}".encode()).hexdigest()


def require_admin(authorization: Annotated[str, Header()] = "") -> None:
    expected = f"Bearer {settings.admin_token}"
    if not settings.admin_token or not hmac.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Admin token required")


DB = Annotated[Session, Depends(get_db)]


@app.get("/api/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/api/enquiries", status_code=201, response_model=EnquiryCreated)
def create_enquiry(payload: EnquiryIn, request: Request, background: BackgroundTasks, db: DB) -> EnquiryCreated:
    # Bots fill the hidden field — pretend all is well, store nothing.
    if payload.company_website:
        return EnquiryCreated(id=str(uuid.uuid4()))

    ip = client_ip(request)
    if not enquiry_limiter.allow(hash_ip(ip)):
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again in a few minutes.")

    data = payload.model_dump(exclude={"company_website"})
    enquiry = Enquiry(**data, ip_hash=hash_ip(ip), user_agent=(request.headers.get("user-agent") or "")[:300])
    db.add(enquiry)
    db.commit()

    background.add_task(notify_enquiry, {**data, "id": enquiry.id})
    return EnquiryCreated(id=enquiry.id)


@app.post("/api/events", status_code=204)
async def create_event(request: Request) -> Response:
    """Accepts JSON sent as text/plain too (navigator.sendBeacon)."""
    raw = await request.body()
    if len(raw) > 4096:
        raise HTTPException(status_code=413, detail="Too large")
    try:
        event = EventIn.model_validate_json(raw)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Invalid event") from exc
    if not event_limiter.allow(hash_ip(client_ip(request))):
        return Response(status_code=204)  # silently drop floods

    def save() -> None:
        with SessionLocal() as db:
            db.add(Event(**event.model_dump()))
            db.commit()

    await run_in_threadpool(save)
    return Response(status_code=204)


# ── Admin ──────────────────────────────────────────────────────────────────


@app.get("/api/admin/enquiries", response_model=list[EnquiryOut], dependencies=[Depends(require_admin)])
def list_enquiries(
    db: DB,
    status: str | None = None,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[Enquiry]:
    q = select(Enquiry).order_by(Enquiry.created_at.desc()).limit(limit).offset(offset)
    if status:
        q = q.where(Enquiry.status == status)
    return list(db.scalars(q))


@app.patch("/api/admin/enquiries/{enquiry_id}", response_model=EnquiryOut, dependencies=[Depends(require_admin)])
def update_enquiry(enquiry_id: str, payload: EnquiryUpdate, db: DB) -> Enquiry:
    enquiry = db.get(Enquiry, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(enquiry, field, value)
    db.commit()
    return enquiry


@app.get("/api/admin/enquiries.csv", dependencies=[Depends(require_admin)])
def export_enquiries(db: DB) -> StreamingResponse:
    cols = ["created_at", "name", "phone", "business_name", "business_type", "message", "preferred_contact", "status", "notes", "source_page", "utm_source", "utm_medium", "utm_campaign", "id"]
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(cols)
    for e in db.scalars(select(Enquiry).order_by(Enquiry.created_at.desc())):
        writer.writerow([getattr(e, c) for c in cols])
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="xhibit-enquiries-{stamp}.csv"'},
    )


@app.get("/api/admin/stats", dependencies=[Depends(require_admin)])
def stats(db: DB, days: Annotated[int, Query(ge=1, le=365)] = 30) -> dict:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    by_status = dict(db.execute(select(Enquiry.status, func.count()).group_by(Enquiry.status)).all())
    by_type = dict(
        db.execute(select(Enquiry.business_type, func.count()).where(Enquiry.created_at >= since).group_by(Enquiry.business_type)).all()
    )
    events = dict(db.execute(select(Event.type, func.count()).where(Event.created_at >= since).group_by(Event.type)).all())
    demo_views: dict[str, int] = {}
    for (data,) in db.execute(select(Event.data).where(Event.type == "demo_view", Event.created_at >= since)):
        industry = (data or {}).get("industry", "unknown")
        demo_views[industry] = demo_views.get(industry, 0) + 1
    return {
        "days": days,
        "enquiries_by_status": by_status,
        "enquiries_by_industry": {k or "not given": v for k, v in by_type.items()},
        "events": events,
        "demo_views_by_industry": dict(sorted(demo_views.items(), key=lambda kv: -kv[1])),
    }
