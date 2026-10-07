import re
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

BUSINESS_TYPES = {"restaurants", "clinics", "schools", "salons", "gyms", "hotels", "retail", "business", "other"}
Status = Literal["new", "contacted", "won", "lost"]


def normalise_phone(raw: str) -> str:
    """'+91 98765-43210' / '098765 43210' → '9876543210'. Raises for non-Indian mobiles."""
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    if len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    if not re.fullmatch(r"[6-9]\d{9}", digits):
        raise ValueError("Enter a valid 10-digit Indian mobile number")
    return digits


def _clean(v: Any) -> Any:
    if isinstance(v, str):
        v = re.sub(r"\s+", " ", v).strip()
        return v or None
    return v


class EnquiryIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str
    business_name: str | None = Field(default=None, max_length=80)
    business_type: str | None = None
    message: str | None = Field(default=None, max_length=1000)
    preferred_contact: Literal["whatsapp", "call"] = "whatsapp"
    source_page: str | None = Field(default=None, max_length=80)
    utm_source: str | None = Field(default=None, max_length=80)
    utm_medium: str | None = Field(default=None, max_length=80)
    utm_campaign: str | None = Field(default=None, max_length=80)
    # Honeypot: hidden from people; bots fill it in.
    company_website: str | None = None

    @field_validator("name", "business_name", "source_page", "utm_source", "utm_medium", "utm_campaign", mode="before")
    @classmethod
    def _strip(cls, v: Any) -> Any:
        return _clean(v)

    @field_validator("message", mode="before")
    @classmethod
    def _strip_message(cls, v: Any) -> Any:
        return (v.strip() or None) if isinstance(v, str) else v

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return normalise_phone(v)

    @field_validator("business_type", mode="before")
    @classmethod
    def _type(cls, v: Any) -> Any:
        v = _clean(v)
        if v is None:
            return None
        return v if v in BUSINESS_TYPES else "other"


class EnquiryCreated(BaseModel):
    id: str


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    name: str
    phone: str
    business_name: str | None
    business_type: str | None
    message: str | None
    preferred_contact: str
    source_page: str | None
    utm_source: str | None
    utm_medium: str | None
    utm_campaign: str | None
    status: str
    notes: str | None


class EnquiryUpdate(BaseModel):
    status: Status | None = None
    notes: str | None = Field(default=None, max_length=2000)


class EventIn(BaseModel):
    type: str = Field(min_length=2, max_length=40, pattern=r"^[a-z0-9_]+$")
    path: str | None = Field(default=None, max_length=120)
    data: dict[str, Any] | None = None
    utm_source: str | None = Field(default=None, max_length=80)
    utm_medium: str | None = Field(default=None, max_length=80)
    utm_campaign: str | None = Field(default=None, max_length=80)

    @field_validator("data")
    @classmethod
    def _small(cls, v: dict[str, Any] | None) -> dict[str, Any] | None:
        if v is None:
            return None
        # Keep only short scalar values — this is for counting, not for personal data.
        return {str(k)[:40]: (val[:80] if isinstance(val, str) else val) for k, val in list(v.items())[:10] if isinstance(val, (str, int, float, bool))}
