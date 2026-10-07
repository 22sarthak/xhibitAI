import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Enquiry(Base):
    """A lead from the contact form."""

    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, index=True)

    name: Mapped[str] = mapped_column(String(80))
    phone: Mapped[str] = mapped_column(String(15), index=True)  # 10-digit Indian mobile
    business_name: Mapped[str | None] = mapped_column(String(80))
    business_type: Mapped[str | None] = mapped_column(String(30), index=True)
    message: Mapped[str | None] = mapped_column(Text)
    preferred_contact: Mapped[str] = mapped_column(String(10), default="whatsapp")

    source_page: Mapped[str | None] = mapped_column(String(80))
    utm_source: Mapped[str | None] = mapped_column(String(80))
    utm_medium: Mapped[str | None] = mapped_column(String(80))
    utm_campaign: Mapped[str | None] = mapped_column(String(80))

    # Your pipeline: new → contacted → won / lost
    status: Mapped[str] = mapped_column(String(20), default="new", index=True)
    notes: Mapped[str | None] = mapped_column(Text)

    ip_hash: Mapped[str | None] = mapped_column(String(64))
    user_agent: Mapped[str | None] = mapped_column(String(300))


class Event(Base):
    """Anonymous interaction counts: WhatsApp/call taps, demo views, etc."""

    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, index=True)
    type: Mapped[str] = mapped_column(String(40), index=True)
    path: Mapped[str | None] = mapped_column(String(120))
    data: Mapped[dict | None] = mapped_column(JSON)
    utm_source: Mapped[str | None] = mapped_column(String(80))
    utm_medium: Mapped[str | None] = mapped_column(String(80))
    utm_campaign: Mapped[str | None] = mapped_column(String(80))
