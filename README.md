# SlotSwapper
Overview & Design Choices

SlotSwapper is a P2P time-slot swapping app. Users create calendar slots, mark some as SWAPPABLE, browse others’ swappable slots, and propose a swap. The responder can Accept/Reject; on accept, slot owners are exchanged and both slots return to BUSY.

Key design choices

MERN-style split: React (Vite) frontend + Express/Mongoose backend + MongoDB Atlas.

Auth with JWT: HTTP Authorization: Bearer <token> for all protected endpoints.

Status machine for slots: BUSY → SWAPPABLE → SWAP_PENDING → {BUSY | SWAPPABLE} ensures no double-booking while a swap is pending.

Swap atomicity (local-friendly): In production you’d use MongoDB transactions; for local/Render, we avoid transactions (since single-node or shared clusters often lack replica set) and perform validated, ordered updates instead. This is documented in code & README.

Real-time UX: Socket.IO for instant notifications (swap_request_received, swap_request_accepted, swap_request_rejected) instead of polling.

Frontend state: Minimal, clean architecture using Context for auth, fetcher.js wrapper, and optimistic UI where it’s safe.

Local Setup (Step-by-step)
1) Prerequisites

Node.js 20+ (or 22.12+ recommended)

npm

MongoDB Atlas connection string (or local MongoDB if you prefer)

2) Backend
cd backend
npm install
# Create .env (see below)
npm run dev


backend/.env

PORT=4000
MONGO_URI=mongodb+srv://Pushkar11111:Pushkar0011@cluster0.ae4bpzf.mongodb.net/?appName=Cluster0
JWT_SECRET=<any-strong-secret>


When it’s working you’ll see “Server running…” + “MongoDB Connected”.

3) Frontend
cd frontend
npm install
# Create .env (see below)
npm run dev


frontend/.env

VITE_API_BASE=(https://slotswapper-1-sjrw.onrender.com)
FRONT END URL:https://slotswapper-m3sk.onrender.com

Open the Vite dev URL (usually http://localhost:5173
).

4) Test Flow

Sign up two users (A & B).

Each creates at least one slot and marks it SWAPPABLE.

User A → Marketplace → request swap with one of B’s swappable slots (choose one of A’s swappable slots to offer).

User B → Requests → Accept/Reject.

On Accept, owners exchange and both slots become BUSY. Both users see live toasts via Socket.IO.

API Endpoints (Quick Reference)

All GET/POST bodies shown are JSON. Authenticated routes require Authorization: Bearer <JWT>.
Base URL locally: http://localhost:4000

Auth
Method	Endpoint	Body	Notes
POST	/api/auth/register	{ "name": "A", "email": "a@x.com", "password":"***" }	Returns { user, token }
POST	/api/auth/login	{ "email":"a@x.com","password":"***" }	Returns { user, token }
Slots (own calendar)
Method	Endpoint	Body	Notes
GET	/api/slots/me	—	List my slots
POST	/api/slots	{ "title":"Team Meeting","startTime": ISOString, "endTime": ISOString, "Description": "…" }	Creates slot, default status: BUSY
PUT	/api/slots/:id	e.g. { "status":"SWAPPABLE" }	Update status/title/times
DELETE	/api/slots/:id	—	Remove my slot
Marketplace
Method	Endpoint	Body	Notes
GET	/api/swappable-slots	—	All others’ SWAPPABLE slots, owner populated (name, email)
Swap flow
Method	Endpoint	Body	Notes
POST	/api/swap-request	{ "mySlotId":"...", "theirSlotId":"..." }	Validates both are SWAPPABLE, creates SwapRequest(PENDING), sets both slots SWAP_PENDING
POST	/api/swap-response/:requestId	`{ "accept": true	false }`
GET	/api/requests/incoming	—	PENDING requests to me
GET	/api/requests/outgoing	—	My requests (any status)

Example cURL (swap-request):

curl -X POST http://localhost:4000/api/swap-request \
 -H "Authorization: Bearer <JWT>" \
 -H "Content-Type: application/json" \
 -d '{"mySlotId":"64f...","theirSlotId":"64g..."}'

Assumptions & Challenges

Two-user interaction: Marketplace intentionally excludes your own swappable slots; you must test with two accounts.

No overlapping validation: For brevity, this version doesn’t enforce cross-user time overlap rules beyond swap status — adding scheduling constraints is straightforward if needed.

Transactions: On local/Render (non-replica) transactions can fail. We designed the swap flow to be safe without Mongo transactions. In production with a replica set, you can wrap accept/reject in a transaction block.

Real-time notifications: We map userId → socketId and emit events to the target user. If a user reconnects, the map updates. For multi-instance scaling, a Socket.IO adapter (e.g., Redis) would be added.

Security: Basic JWT auth + route guards. Rate limiting / password reset / email verification are out-of-scope for this challenge but are natural next steps.
