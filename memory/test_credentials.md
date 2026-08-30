# Kemudi — Test Credentials

## Seeded Therapist Accounts (role: therapist)
All use password: `therapist123`

| Email | Name |
|---|---|
| aisha@kemudi.my | Dr. Aisha Rahman |
| mei@kemudi.my | Mei Ling Tan |
| farid@kemudi.my | Farid Iskandar |
| priya@kemudi.my | Priya Nair |
| hafiz@kemudi.my | Hafiz Zulkifli |
| sarah@kemudi.my | Sarah Lim |

## Seeded Client Account (role: client)
- Email: `client@kemudi.my`
- Password: `client123`

## Auth Endpoints (JWT Bearer)
- POST `/api/auth/register` — body: `{email, password, name, role: "client"|"therapist"}`
- POST `/api/auth/login` — body: `{email, password}` → returns `{token, user}`
- GET `/api/auth/me` — header: `Authorization: Bearer <token>`

## Stripe Test Card
- `4242 4242 4242 4242`, any future expiry, any CVC
