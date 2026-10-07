from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All settings come from environment variables (or server/.env)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Postgres in production, e.g. postgresql://user:pass@host:5432/xhibit
    # Falls back to a local SQLite file so you can try the API without Postgres.
    database_url: str = "sqlite:///./xhibit.db"

    # Comma-separated list of sites allowed to call the API from a browser.
    allowed_origins: str = "http://localhost:5173,http://localhost:4173"

    # Protects /api/admin/*. Use a long random string. Empty = admin disabled.
    admin_token: str = ""

    # Used to hash visitor IPs so we can rate-limit without storing raw IPs.
    ip_hash_salt: str = "change-me"

    # Optional instant alerts for new enquiries.
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    notify_webhook_url: str = ""  # Slack / Discord / Make / Zapier incoming webhook

    enquiries_per_10_min: int = 5
    events_per_10_min: int = 240

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
