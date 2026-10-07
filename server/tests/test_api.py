import os
import tempfile

# A throwaway database + admin token for the tests (set before the app imports settings).
_tmp = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp}/test.db"
os.environ["ADMIN_TOKEN"] = "test-admin-token"
os.environ["ENQUIRIES_PER_10_MIN"] = "3"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from app.schemas import normalise_phone  # noqa: E402

ADMIN = {"Authorization": "Bearer test-admin-token"}
client = TestClient(app)
client.__enter__()  # run the lifespan (creates tables)


def enquiry(**over):
    body = {"name": "Rakesh Kumar", "phone": "+91 98765-43210", "business_name": "Kesar Kitchen", "business_type": "restaurants", "preferred_contact": "whatsapp", "source_page": "home"}
    body.update(over)
    return body


def test_health():
    assert client.get("/api/health").json() == {"ok": True}


def test_phone_normalisation():
    assert normalise_phone("+91 98765 43210") == "9876543210"
    assert normalise_phone("098765-43210") == "9876543210"
    assert normalise_phone("919876543210") == "9876543210"
    for bad in ["12345", "5876543210", "98765432101", ""]:
        try:
            normalise_phone(bad)
        except ValueError:
            continue
        raise AssertionError(f"{bad!r} should be rejected")


def test_create_and_list_enquiry():
    r = client.post("/api/enquiries", json=enquiry(), headers={"X-Forwarded-For": "10.0.0.1"})
    assert r.status_code == 201, r.text
    new_id = r.json()["id"]

    rows = client.get("/api/admin/enquiries", headers=ADMIN).json()
    row = next(x for x in rows if x["id"] == new_id)
    assert row["phone"] == "9876543210"
    assert row["status"] == "new"
    assert row["business_type"] == "restaurants"


def test_invalid_phone_is_rejected():
    r = client.post("/api/enquiries", json=enquiry(phone="12345"), headers={"X-Forwarded-For": "10.0.0.2"})
    assert r.status_code == 422
    assert r.json()["detail"][0]["loc"][-1] == "phone"


def test_unknown_business_type_becomes_other():
    r = client.post("/api/enquiries", json=enquiry(business_type="spaceship"), headers={"X-Forwarded-For": "10.0.0.3"})
    assert r.status_code == 201
    rows = client.get("/api/admin/enquiries", headers=ADMIN).json()
    assert next(x for x in rows if x["id"] == r.json()["id"])["business_type"] == "other"


def test_honeypot_is_silently_dropped():
    before = len(client.get("/api/admin/enquiries", headers=ADMIN).json())
    r = client.post("/api/enquiries", json=enquiry(company_website="http://spam.example"), headers={"X-Forwarded-For": "10.0.0.4"})
    assert r.status_code == 201
    assert len(client.get("/api/admin/enquiries", headers=ADMIN).json()) == before


def test_rate_limit():
    codes = [client.post("/api/enquiries", json=enquiry(), headers={"X-Forwarded-For": "10.9.9.9"}).status_code for _ in range(4)]
    assert codes == [201, 201, 201, 429]


def test_events_accept_text_plain_beacons():
    r = client.post(
        "/api/events",
        content='{"type":"whatsapp_click","path":"/for/clinics","data":{"location":"fab","industry":"clinics"}}',
        headers={"Content-Type": "text/plain"},
    )
    assert r.status_code == 204
    client.post("/api/events", json={"type": "demo_view", "path": "/for/clinics", "data": {"industry": "clinics"}})
    s = client.get("/api/admin/stats", headers=ADMIN).json()
    assert s["events"]["whatsapp_click"] >= 1
    assert s["demo_views_by_industry"]["clinics"] >= 1


def test_bad_event_rejected():
    assert client.post("/api/events", content="not json").status_code == 422
    assert client.post("/api/events", json={"type": "DROP TABLE"}).status_code == 422


def test_admin_requires_token():
    assert client.get("/api/admin/enquiries").status_code == 401
    assert client.get("/api/admin/enquiries", headers={"Authorization": "Bearer wrong"}).status_code == 401


def test_update_status_and_export_csv():
    new_id = client.post("/api/enquiries", json=enquiry(name="Priya Singh"), headers={"X-Forwarded-For": "10.0.0.5"}).json()["id"]
    r = client.patch(f"/api/admin/enquiries/{new_id}", json={"status": "contacted", "notes": "Called, visiting Friday"}, headers=ADMIN)
    assert r.status_code == 200 and r.json()["status"] == "contacted"
    csv_text = client.get("/api/admin/enquiries.csv", headers=ADMIN).text
    assert "Priya Singh" in csv_text and "contacted" in csv_text
