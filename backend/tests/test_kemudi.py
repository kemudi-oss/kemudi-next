"""Kemudi backend API tests - covers therapists directory, auth, portal, referrals, quiz, and payments."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fallback to reading frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def therapist_token(s):
    r = s.post(f"{API}/auth/login", json={"email": "aisha@kemudi.my", "password": "therapist123"})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def therapist_headers(therapist_token):
    return {"Authorization": f"Bearer {therapist_token}", "Content-Type": "application/json"}


# ---------- Health ----------
def test_health(s):
    r = s.get(f"{API}/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


# ---------- Therapists directory ----------
def test_list_therapists_seeded(s):
    r = s.get(f"{API}/therapists")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    assert all(t.get("published") for t in data)


def test_filter_specialty(s):
    r = s.get(f"{API}/therapists", params={"specialty": "Anxiety"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    assert all("Anxiety" in t["specialties"] for t in data)


def test_filter_language_mode_price_location_q(s):
    r = s.get(f"{API}/therapists", params={"language": "Mandarin", "mode": "online", "max_price": 250, "location": "Petaling", "q": "Mei"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    for t in data:
        assert "Mandarin" in t["languages"]
        assert "online" in t["modes"]
        assert t["price_myr"] <= 250


def test_get_therapist_by_id(s):
    lst = s.get(f"{API}/therapists").json()
    tid = lst[0]["id"]
    r = s.get(f"{API}/therapists/{tid}")
    assert r.status_code == 200
    assert r.json()["id"] == tid


def test_compare_therapists(s):
    lst = s.get(f"{API}/therapists").json()
    ids = [t["id"] for t in lst[:3]]
    r = s.post(f"{API}/therapists/compare", json={"ids": ids})
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 3
    assert set(t["id"] for t in data) == set(ids)


def test_quiz_match_ranks_by_concern(s):
    r = s.post(f"{API}/quiz/match", json={
        "concerns": ["Anxiety", "Burnout"], "language": "English", "mode": "online", "max_price": 300
    })
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    # Aisha should rank high since she matches anxiety+burnout
    assert data[0]["name"] in ("Dr. Aisha Rahman",) or "Anxiety" in data[0]["specialties"]


# ---------- Auth ----------
def test_register_client_and_therapist(s):
    email_c = f"TEST_client_{uuid.uuid4().hex[:6]}@ex.com"
    r = s.post(f"{API}/auth/register", json={"email": email_c, "password": "pass1234", "name": "Test C", "role": "client"})
    assert r.status_code == 200, r.text
    assert "token" in r.json() and r.json()["user"]["role"] == "client"

    email_t = f"TEST_ther_{uuid.uuid4().hex[:6]}@ex.com"
    r2 = s.post(f"{API}/auth/register", json={"email": email_t, "password": "pass1234", "name": "Test T", "role": "therapist"})
    assert r2.status_code == 200, r2.text
    tok = r2.json()["token"]
    # verify therapist profile was created (via /portal/profile)
    r3 = s.get(f"{API}/portal/profile", headers={"Authorization": f"Bearer {tok}"})
    assert r3.status_code == 200
    assert r3.json()["user_id"]


def test_login_seeded_therapist(s):
    r = s.post(f"{API}/auth/login", json={"email": "aisha@kemudi.my", "password": "therapist123"})
    assert r.status_code == 200
    assert r.json()["user"]["role"] == "therapist"


def test_auth_me(s, therapist_headers):
    r = s.get(f"{API}/auth/me", headers=therapist_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "aisha@kemudi.my"


def test_auth_me_unauth(s):
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


# ---------- Public referral ----------
def test_create_referral_public(s):
    lst = s.get(f"{API}/therapists").json()
    tid = lst[0]["id"]
    r = s.post(f"{API}/referrals", json={
        "therapist_id": tid, "client_name": "TEST Referral",
        "client_email": "test_ref@ex.com", "concern": "Anxiety and burnout",
        "preferred_language": "English", "preferred_mode": "online",
    })
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "new" and data["therapist_id"] == tid


# ---------- Portal (uses seeded aisha) ----------
def test_portal_profile_requires_auth(s):
    assert s.get(f"{API}/portal/profile").status_code == 401


def test_portal_profile_get_and_update(s, therapist_headers):
    r = s.get(f"{API}/portal/profile", headers=therapist_headers)
    assert r.status_code == 200
    orig_title = r.json()["title"]
    r2 = s.put(f"{API}/portal/profile", headers=therapist_headers, json={"title": "Clinical Psychologist (Test)"})
    assert r2.status_code == 200
    assert r2.json()["title"] == "Clinical Psychologist (Test)"
    # restore
    s.put(f"{API}/portal/profile", headers=therapist_headers, json={"title": orig_title})


def test_client_cap_free_tier(s, therapist_headers):
    # Ensure clean slate: delete all existing clients for aisha
    existing = s.get(f"{API}/portal/clients", headers=therapist_headers).json()
    for c in existing:
        s.delete(f"{API}/portal/clients/{c['id']}", headers=therapist_headers)

    # Create 5 active clients
    ids = []
    for i in range(5):
        r = s.post(f"{API}/portal/clients", headers=therapist_headers,
                   json={"name": f"TEST Client {i}", "status": "active"})
        assert r.status_code == 200, r.text
        ids.append(r.json()["id"])

    # 6th should 402
    r6 = s.post(f"{API}/portal/clients", headers=therapist_headers,
                json={"name": "TEST Client 6", "status": "active"})
    assert r6.status_code == 402

    # Archive one -> then add active succeeds
    ar = s.patch(f"{API}/portal/clients/{ids[0]}", headers=therapist_headers, json={"status": "archived"})
    assert ar.status_code == 200 and ar.json()["status"] == "archived"

    r7 = s.post(f"{API}/portal/clients", headers=therapist_headers,
                json={"name": "TEST Client 7", "status": "active"})
    assert r7.status_code == 200
    ids.append(r7.json()["id"])

    # Toggling archived back to active should now hit cap (5 active already)
    ra = s.patch(f"{API}/portal/clients/{ids[0]}", headers=therapist_headers, json={"status": "active"})
    assert ra.status_code == 402

    # Delete one client
    dr = s.delete(f"{API}/portal/clients/{ids[1]}", headers=therapist_headers)
    assert dr.status_code == 200

    # Cleanup remaining
    remaining = s.get(f"{API}/portal/clients", headers=therapist_headers).json()
    for c in remaining:
        s.delete(f"{API}/portal/clients/{c['id']}", headers=therapist_headers)


def test_portal_referrals_and_status_update(s, therapist_headers):
    # get aisha's therapist id
    prof = s.get(f"{API}/portal/profile", headers=therapist_headers).json()
    tid = prof["id"]
    # create referral publicly
    cr = s.post(f"{API}/referrals", json={
        "therapist_id": tid, "client_name": "TEST Ref2",
        "client_email": "ref2@ex.com", "concern": "help",
    })
    assert cr.status_code == 200
    ref_id = cr.json()["id"]

    lst = s.get(f"{API}/portal/referrals", headers=therapist_headers)
    assert lst.status_code == 200
    assert any(r["id"] == ref_id for r in lst.json())

    up = s.patch(f"{API}/portal/referrals/{ref_id}", headers=therapist_headers, json={"status": "accepted"})
    assert up.status_code == 200 and up.json()["status"] == "accepted"

    up2 = s.patch(f"{API}/portal/referrals/{ref_id}", headers=therapist_headers, json={"status": "bogus"})
    assert up2.status_code == 400


def test_portal_summary(s, therapist_headers):
    r = s.get(f"{API}/portal/summary", headers=therapist_headers)
    assert r.status_code == 200
    data = r.json()
    assert data["tier"] == "free"
    assert data["active_cap"] == 5
    assert "active_clients" in data and "total_clients" in data and "new_referrals" in data


# ---------- Payments ----------
def test_checkout_requires_auth(s):
    r = s.post(f"{API}/payments/checkout", json={"lookup_key": "kemudi_pro_monthly", "origin_url": BASE_URL})
    assert r.status_code == 401


def test_checkout_creates_session_and_transaction(s, therapist_headers):
    r = s.post(f"{API}/payments/checkout", headers=therapist_headers,
               json={"lookup_key": "kemudi_pro_monthly", "origin_url": BASE_URL})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["checkout_url"].startswith("https://")
    assert data["session_id"]

    # status endpoint
    st = s.get(f"{API}/payments/status/{data['session_id']}")
    assert st.status_code == 200
    body = st.json()
    assert body["session_id"] == data["session_id"]
    assert body["payment_status"] in ("pending", "paid", "unpaid")
