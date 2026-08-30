from dotenv import load_dotenv
load_dotenv()

import os
import re
import uuid
import bcrypt
import jwt
import stripe
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal
from fastapi import FastAPI, HTTPException, Request, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, field_validator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kemudi")

# ---------------- Config ----------------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY") or "sk_test_emergent"
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

# Malaysia is not in SMP list → tax_mode = "calc_only" (Stripe Tax)
TAX_MODE = "calc_only"

# ---------------- DB ----------------
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ---------------- App ----------------
app = FastAPI(title="Kemudi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

# ---------------- Auth Helpers ----------------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())

def create_token(user_id: str, role: str, minutes: int = 60 * 24 * 7) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = auth[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(401, "User not found")
    user.pop("password_hash", None)
    user.pop("_id", None)
    return user

async def require_therapist(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "therapist":
        raise HTTPException(403, "Therapist access required")
    return user

# ---------------- Models ----------------
class RegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str
    role: Literal["client", "therapist"] = "client"

class LoginBody(BaseModel):
    email: EmailStr
    password: str

class TherapistProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    specialties: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    modalities: Optional[List[str]] = None  # e.g. CBT, ACT
    price_myr: Optional[int] = None
    location: Optional[str] = None
    modes: Optional[List[str]] = None  # ['online','in-person']
    photo_url: Optional[str] = None
    credentials: Optional[str] = None
    years_experience: Optional[int] = None

class ClientCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    status: Literal["active", "archived"] = "active"

    @field_validator("email", mode="before")
    @classmethod
    def blank_email_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

class ReferralCreate(BaseModel):
    therapist_id: str
    client_name: str
    client_email: EmailStr
    concern: str
    preferred_language: Optional[str] = None
    preferred_mode: Optional[str] = None

class CheckoutBody(BaseModel):
    lookup_key: str
    origin_url: str

class QuizAnswers(BaseModel):
    concerns: List[str] = []
    language: Optional[str] = None
    mode: Optional[str] = None
    max_price: Optional[int] = None

# ---------------- Startup: seed data & indexes ----------------
SEED_THERAPISTS = [
    {
        "email": "aisha@kemudi.my", "password": "therapist123", "name": "Dr. Aisha Rahman",
        "title": "Clinical Psychologist", "bio": "I work with adults navigating anxiety, burnout, and identity. My approach blends CBT with a grounded, culturally-aware lens for Malaysian clients.",
        "specialties": ["Anxiety", "Burnout", "Identity"], "languages": ["English", "Bahasa Malaysia"],
        "modalities": ["CBT", "ACT"], "price_myr": 280, "location": "Kuala Lumpur",
        "modes": ["online", "in-person"], "years_experience": 9,
        "photo_url": "https://images.unsplash.com/photo-1758600587815-b654d1405e83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxhc2lhbiUyMHRoZXJhcGlzdCUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODgwOTIwOTh8MA&ixlib=rb-4.1.0&q=85",
        "credentials": "PhD Clinical Psychology, MSCP",
    },
    {
        "email": "mei@kemudi.my", "password": "therapist123", "name": "Mei Ling Tan",
        "title": "Licensed Counsellor", "bio": "A warm, direct counsellor who works with young adults on relationships, family expectations, and life transitions. Sessions in English and Mandarin.",
        "specialties": ["Relationships", "Family", "Life Transitions"], "languages": ["English", "Mandarin"],
        "modalities": ["Person-Centered", "Systemic"], "price_myr": 220, "location": "Petaling Jaya",
        "modes": ["online"], "years_experience": 6,
        "photo_url": "https://images.unsplash.com/photo-1749700332031-cf99864959ea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRoZXJhcGlzdCUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODgwOTIwOTh8MA&ixlib=rb-4.1.0&q=85",
        "credentials": "MA Counselling, LC (KKM)",
    },
    {
        "email": "farid@kemudi.my", "password": "therapist123", "name": "Farid Iskandar",
        "title": "Psychotherapist", "bio": "I specialise in depression, grief, and men's mental health. I believe therapy should feel like a real conversation, not a script.",
        "specialties": ["Depression", "Grief", "Men's Mental Health"], "languages": ["English", "Bahasa Malaysia"],
        "modalities": ["Psychodynamic", "EFT"], "price_myr": 250, "location": "Kuala Lumpur",
        "modes": ["online", "in-person"], "years_experience": 12,
        "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?crop=entropy&cs=srgb&fm=jpg&q=85",
        "credentials": "MA Psychotherapy",
    },
    {
        "email": "priya@kemudi.my", "password": "therapist123", "name": "Priya Nair",
        "title": "Trauma Therapist", "bio": "Trauma-informed care for adults recovering from complex trauma, PTSD and childhood wounds. EMDR-trained.",
        "specialties": ["Trauma", "PTSD", "Complex Trauma"], "languages": ["English", "Tamil"],
        "modalities": ["EMDR", "Somatic"], "price_myr": 320, "location": "Penang",
        "modes": ["online"], "years_experience": 10,
        "photo_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85",
        "credentials": "MSc Clinical Psychology, EMDR Certified",
    },
    {
        "email": "hafiz@kemudi.my", "password": "therapist123", "name": "Hafiz Zulkifli",
        "title": "Counselling Psychologist", "bio": "Working with couples and individuals on communication, intimacy, and Muslim-inclusive counselling.",
        "specialties": ["Couples", "Communication", "Faith-based"], "languages": ["English", "Bahasa Malaysia"],
        "modalities": ["Gottman", "CBT"], "price_myr": 240, "location": "Shah Alam",
        "modes": ["online", "in-person"], "years_experience": 7,
        "photo_url": "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?crop=entropy&cs=srgb&fm=jpg&q=85",
        "credentials": "MA Counselling Psychology",
    },
    {
        "email": "sarah@kemudi.my", "password": "therapist123", "name": "Sarah Lim",
        "title": "Child & Adolescent Therapist", "bio": "Play and talk therapy for children and teens. I help families create safer, more connected homes.",
        "specialties": ["Children", "Teens", "Family"], "languages": ["English", "Mandarin"],
        "modalities": ["Play Therapy", "Family Systems"], "price_myr": 260, "location": "Kuala Lumpur",
        "modes": ["in-person"], "years_experience": 8,
        "photo_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&q=85",
        "credentials": "MA Child Psychology",
    },
]

async def seed():
    await db.users.create_index("email", unique=True)
    await db.therapists.create_index("user_id", unique=True)

    for t in SEED_THERAPISTS:
        existing = await db.users.find_one({"email": t["email"]})
        if existing:
            continue
        uid = str(uuid.uuid4())
        await db.users.insert_one({
            "id": uid,
            "email": t["email"],
            "name": t["name"],
            "role": "therapist",
            "password_hash": hash_password(t["password"]),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        await db.therapists.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": uid,
            "name": t["name"],
            "title": t["title"],
            "bio": t["bio"],
            "specialties": t["specialties"],
            "languages": t["languages"],
            "modalities": t["modalities"],
            "price_myr": t["price_myr"],
            "location": t["location"],
            "modes": t["modes"],
            "photo_url": t["photo_url"],
            "credentials": t["credentials"],
            "years_experience": t["years_experience"],
            "subscription_tier": "free",  # free | pro
            "subscription_status": "inactive",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Seed a demo client account
    if not await db.users.find_one({"email": "client@kemudi.my"}):
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": "client@kemudi.my",
            "name": "Demo Client",
            "role": "client",
            "password_hash": hash_password("client123"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Setup Stripe product/price idempotently
    try:
        products = stripe.Product.list(active=True, limit=100).auto_paging_iter()
        product = None
        for p in products:
            if p.get("metadata", {}).get("emergent_product_id") == "kemudi_pro":
                product = p
                break
        if not product:
            product = stripe.Product.create(
                name="Kemudi Pro — Therapist Practice Management",
                tax_code="txcd_10103001",
                metadata={"managed_by": "emergent", "emergent_product_id": "kemudi_pro"},
            )
        existing = stripe.Price.list(lookup_keys=["kemudi_pro_monthly"], active=True, limit=1).data
        if existing and (existing[0].unit_amount != 9900 or existing[0].currency != "myr"):
            stripe.Price.modify(existing[0].id, active=False)
            existing = []
        if not existing:
            stripe.Price.create(
                product=product.id,
                unit_amount=9900,  # RM99.00
                currency="myr",
                recurring={"interval": "month"},
                lookup_key="kemudi_pro_monthly",
                transfer_lookup_key=True,
            )
        logger.info("Stripe catalog ready")
    except Exception as e:
        logger.warning(f"Stripe catalog setup skipped: {e}")

@app.on_event("startup")
async def on_startup():
    await seed()

# ---------------- Auth Endpoints ----------------
@api.post("/auth/register")
async def register(body: RegisterBody):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid,
        "email": email,
        "name": body.name,
        "role": body.role,
        "password_hash": hash_password(body.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    if body.role == "therapist":
        await db.therapists.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": uid,
            "name": body.name,
            "title": "Therapist",
            "bio": "",
            "specialties": [],
            "languages": [],
            "modalities": [],
            "price_myr": 200,
            "location": "Malaysia",
            "modes": ["online"],
            "photo_url": "",
            "credentials": "",
            "years_experience": 0,
            "subscription_tier": "free",
            "subscription_status": "inactive",
            "published": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    token = create_token(uid, body.role)
    return {"token": token, "user": {"id": uid, "email": email, "name": body.name, "role": body.role}}

@api.post("/auth/login")
async def login(body: LoginBody):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(user["id"], user["role"])
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------------- Public directory ----------------
@api.get("/therapists")
async def list_therapists(
    q: Optional[str] = None,
    specialty: Optional[str] = None,
    language: Optional[str] = None,
    mode: Optional[str] = None,
    max_price: Optional[int] = None,
    location: Optional[str] = None,
):
    filter_q = {"published": True}
    if specialty:
        filter_q["specialties"] = {"$regex": f"^{re.escape(specialty)}$", "$options": "i"}
    if language:
        filter_q["languages"] = {"$regex": f"^{re.escape(language)}$", "$options": "i"}
    if mode:
        filter_q["modes"] = mode
    if max_price is not None:
        filter_q["price_myr"] = {"$lte": max_price}
    if location:
        filter_q["location"] = {"$regex": re.escape(location), "$options": "i"}
    if q:
        filter_q["$or"] = [
            {"name": {"$regex": re.escape(q), "$options": "i"}},
            {"bio": {"$regex": re.escape(q), "$options": "i"}},
            {"specialties": {"$regex": re.escape(q), "$options": "i"}},
        ]
    cursor = db.therapists.find(filter_q, {"_id": 0}).sort("name", 1)
    return [t async for t in cursor]

@api.get("/therapists/{therapist_id}")
async def get_therapist(therapist_id: str):
    t = await db.therapists.find_one({"id": therapist_id, "published": True}, {"_id": 0})
    if not t:
        raise HTTPException(404, "Therapist not found")
    return t

@api.post("/therapists/compare")
async def compare_therapists(body: dict):
    ids = body.get("ids", [])[:3]
    cursor = db.therapists.find({"id": {"$in": ids}, "published": True}, {"_id": 0})
    return [t async for t in cursor]

@api.post("/quiz/match")
async def quiz_match(answers: QuizAnswers):
    filter_q = {"published": True}
    if answers.language:
        filter_q["languages"] = answers.language
    if answers.mode:
        filter_q["modes"] = answers.mode
    if answers.max_price is not None:
        filter_q["price_myr"] = {"$lte": answers.max_price}
    cursor = db.therapists.find(filter_q, {"_id": 0})
    all_matches = [t async for t in cursor]
    concerns = [c.lower() for c in (answers.concerns or [])]
    def score(t):
        s = 0
        for spec in t.get("specialties", []):
            if spec.lower() in concerns or any(c in spec.lower() for c in concerns):
                s += 3
        return s
    all_matches.sort(key=score, reverse=True)
    return all_matches[:5]

# ---------------- Therapist portal ----------------
@api.get("/portal/profile")
async def portal_profile(user: dict = Depends(require_therapist)):
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    if not t:
        raise HTTPException(404, "Profile not found")
    return t

@api.put("/portal/profile")
async def update_profile(body: TherapistProfileUpdate, user: dict = Depends(require_therapist)):
    update = {k: v for k, v in body.dict().items() if v is not None}
    if update:
        await db.therapists.update_one({"user_id": user["id"]}, {"$set": update})
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    return t

@api.get("/portal/clients")
async def list_clients(user: dict = Depends(require_therapist)):
    cursor = db.clients.find({"therapist_user_id": user["id"]}, {"_id": 0}).sort("created_at", -1)
    return [c async for c in cursor]

@api.post("/portal/clients")
async def create_client(body: ClientCreate, user: dict = Depends(require_therapist)):
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    active_count = await db.clients.count_documents({"therapist_user_id": user["id"], "status": "active"})
    if t.get("subscription_tier") != "pro" and body.status == "active" and active_count >= 5:
        raise HTTPException(402, "Free tier limited to 5 active clients. Upgrade to Kemudi Pro for unlimited.")
    doc = {
        "id": str(uuid.uuid4()),
        "therapist_user_id": user["id"],
        "name": body.name,
        "email": body.email,
        "phone": body.phone,
        "notes": body.notes,
        "status": body.status,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.clients.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.patch("/portal/clients/{client_id}")
async def update_client(client_id: str, body: dict, user: dict = Depends(require_therapist)):
    allowed = {k: body[k] for k in ["name", "email", "phone", "notes", "status"] if k in body}
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    if allowed.get("status") == "active" and t.get("subscription_tier") != "pro":
        active_count = await db.clients.count_documents({"therapist_user_id": user["id"], "status": "active"})
        current = await db.clients.find_one({"id": client_id})
        if current and current.get("status") != "active" and active_count >= 5:
            raise HTTPException(402, "Free tier limited to 5 active clients.")
    await db.clients.update_one({"id": client_id, "therapist_user_id": user["id"]}, {"$set": allowed})
    return await db.clients.find_one({"id": client_id}, {"_id": 0})

@api.delete("/portal/clients/{client_id}")
async def delete_client(client_id: str, user: dict = Depends(require_therapist)):
    await db.clients.delete_one({"id": client_id, "therapist_user_id": user["id"]})
    return {"ok": True}

@api.get("/portal/referrals")
async def list_referrals(user: dict = Depends(require_therapist)):
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    cursor = db.referrals.find({"therapist_id": t["id"]}, {"_id": 0}).sort("created_at", -1)
    return [r async for r in cursor]

@api.patch("/portal/referrals/{referral_id}")
async def update_referral(referral_id: str, body: dict, user: dict = Depends(require_therapist)):
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    status = body.get("status")
    if status not in {"new", "accepted", "declined", "converted"}:
        raise HTTPException(400, "Invalid status")
    await db.referrals.update_one({"id": referral_id, "therapist_id": t["id"]}, {"$set": {"status": status}})
    return await db.referrals.find_one({"id": referral_id}, {"_id": 0})

@api.get("/portal/summary")
async def portal_summary(user: dict = Depends(require_therapist)):
    t = await db.therapists.find_one({"user_id": user["id"]}, {"_id": 0})
    active = await db.clients.count_documents({"therapist_user_id": user["id"], "status": "active"})
    total = await db.clients.count_documents({"therapist_user_id": user["id"]})
    new_referrals = await db.referrals.count_documents({"therapist_id": t["id"], "status": "new"})
    tier = t.get("subscription_tier", "free")
    return {
        "tier": tier,
        "subscription_status": t.get("subscription_status", "inactive"),
        "active_clients": active,
        "total_clients": total,
        "new_referrals": new_referrals,
        "active_cap": None if tier == "pro" else 5,
    }

# ---------------- Referrals (public → therapist) ----------------
@api.post("/referrals")
async def create_referral(body: ReferralCreate):
    t = await db.therapists.find_one({"id": body.therapist_id, "published": True})
    if not t:
        raise HTTPException(404, "Therapist not found")
    doc = {
        "id": str(uuid.uuid4()),
        "therapist_id": body.therapist_id,
        "therapist_name": t["name"],
        "client_name": body.client_name,
        "client_email": body.client_email,
        "concern": body.concern,
        "preferred_language": body.preferred_language,
        "preferred_mode": body.preferred_mode,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.referrals.insert_one(doc)
    doc.pop("_id", None)
    return doc

# ---------------- Stripe: Checkout / Status / Webhook ----------------
@api.post("/payments/checkout")
async def checkout(body: CheckoutBody, user: dict = Depends(require_therapist)):
    prices = stripe.Price.list(lookup_keys=[body.lookup_key], active=True, limit=1).data
    if not prices:
        raise HTTPException(500, f"Price not found: {body.lookup_key}")
    price = prices[0]
    kwargs = dict(
        line_items=[{"price": price.id, "quantity": 1}],
        mode="subscription" if price.recurring else "payment",
        success_url=f"{body.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{body.origin_url}/payment/cancel",
        metadata={"user_id": user["id"], "lookup_key": body.lookup_key},
        customer_email=user["email"],
    )
    if TAX_MODE == "full":
        session = stripe.checkout.Session.create(**kwargs, managed_payments={"enabled": True})
    elif TAX_MODE == "calc_only":
        try:
            session = stripe.checkout.Session.create(
                **kwargs, automatic_tax={"enabled": True}, billing_address_collection="required",
            )
        except stripe.error.InvalidRequestError:
            session = stripe.checkout.Session.create(**kwargs)
    else:
        session = stripe.checkout.Session.create(**kwargs)

    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.id,
        "user_id": user["id"],
        "lookup_key": body.lookup_key,
        "amount": (price.unit_amount or 0),
        "currency": price.currency,
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"checkout_url": session.url, "session_id": session.id}

@api.get("/payments/status/{session_id}")
async def payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id})
    if not record:
        raise HTTPException(404, "Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {
                        "status": "completed",
                        "payment_status": "paid",
                        "stripe_subscription_id": s.subscription,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    }},
                )
                # Upgrade the therapist to Pro
                await db.therapists.update_one(
                    {"user_id": record["user_id"]},
                    {"$set": {"subscription_tier": "pro", "subscription_status": "active",
                              "stripe_subscription_id": s.subscription}},
                )
                record = await db.payment_transactions.find_one({"session_id": session_id})
        except stripe.error.StripeError:
            pass
    return {
        "session_id": record["session_id"],
        "status": record["status"],
        "payment_status": record["payment_status"],
    }

@api.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")
    obj = event["data"]["object"]
    t = event["type"]
    if t == "checkout.session.completed":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"], "payment_status": {"$ne": "paid"}},
            {"$set": {
                "status": "completed",
                "payment_status": obj.get("payment_status", "paid"),
                "stripe_subscription_id": obj.get("subscription"),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        record = await db.payment_transactions.find_one({"session_id": obj["id"]})
        if record:
            await db.therapists.update_one(
                {"user_id": record["user_id"]},
                {"$set": {"subscription_tier": "pro", "subscription_status": "active"}},
            )
    return {"status": "ok"}

# ---------------- Health ----------------
@api.get("/health")
async def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

app.include_router(api)
