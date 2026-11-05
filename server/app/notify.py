"""Instant alerts for new enquiries — reply fast, win more work."""

import logging
from typing import Any

import httpx

from .config import get_settings

log = logging.getLogger("xhibit.notify")

PROJECT_LABELS = {"website": "Website", "landing": "Landing page", "webapp": "Web app / dashboard", "store": "Online store", "ai": "AI assistant / automation", "unsure": "Not sure yet"}
BUDGET_LABELS = {"under_25k": "Under ₹25,000", "25k_75k": "₹25,000 – ₹75,000", "75k_2l": "₹75,000 – ₹2 lakh", "above_2l": "Above ₹2 lakh", "unsure": "Not sure yet"}


def format_enquiry(e: dict[str, Any]) -> str:
    lines = [
        f"New enquiry: {e['name']}",
        f"Phone: +91 {e['phone']} (prefers {e['preferred_contact']})",
    ]
    if e.get("business_name") or e.get("business_type"):
        lines.append(f"Business: {e.get('business_name') or '-'} ({e.get('business_type') or 'type not given'})")
    if e.get("project_type"):
        lines.append(f"Wants: {PROJECT_LABELS.get(e['project_type'], e['project_type'])}")
    if e.get("budget"):
        lines.append(f"Budget: {BUDGET_LABELS.get(e['budget'], e['budget'])}")
    if e.get("city"):
        lines.append(f"City: {e['city']}")
    if e.get("message"):
        lines.append(f"Message: {e['message']}")
    if e.get("source_page"):
        lines.append(f"From: {e['source_page']}")
    lines.append(f"WhatsApp them: https://wa.me/91{e['phone']}")
    return "\n".join(lines)


def notify_enquiry(e: dict[str, Any]) -> None:
    """Runs after the response is sent. Never raises."""
    s = get_settings()
    text = format_enquiry(e)
    if s.telegram_bot_token and s.telegram_chat_id:
        try:
            httpx.post(
                f"https://api.telegram.org/bot{s.telegram_bot_token}/sendMessage",
                json={"chat_id": s.telegram_chat_id, "text": text, "disable_web_page_preview": True},
                timeout=8,
            ).raise_for_status()
        except Exception:  # noqa: BLE001 — alerts must never break enquiries
            log.exception("Telegram alert failed")
    if s.notify_webhook_url:
        try:
            httpx.post(s.notify_webhook_url, json={"text": text, "enquiry": e}, timeout=8).raise_for_status()
        except Exception:  # noqa: BLE001
            log.exception("Webhook alert failed")
