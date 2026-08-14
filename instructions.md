# instructions.md
## Build Instructions for AI Coding Agents — Jersey E-Commerce Platform (Bangladesh)

This file is written to be read by an AI coding agent (e.g., Claude Code) as the source of truth for building this project. Reference `jersey-ecommerce-prd.md` for full product context — this file focuses on **how to build it, step by step**.

---

## 0. Before Starting — Agent Checklist

- [ ] Read `jersey-ecommerce-prd.md` fully before writing any code.
- [ ] Confirm you have API credentials for: SSLCommerz (sandbox), a courier provider (Pathao/RedX/Steadfast sandbox), an SMS gateway, and Cloudinary/S3. If missing, stop and ask the user rather than stubbing with fake keys silently.
- [ ] Work in phases (see Section 3). Do not skip ahead to a later phase until the current phase's acceptance criteria are met.
- [ ] Never commit real API keys, secrets, or `.env` files to version control. Use `.env.example` with placeholder values.
- [ ] After each phase, run and show working output (e.g., a passing test, a working local dev server screenshot/description, or a curl request/response) before moving on.

---

## 1. Project Structure

Set up as a monorepo with two main apps:

```
jersey-shop/
├── backend/                  # Saleor (Django/GraphQL) — commerce engine
│   ├── saleor/                # Saleor core (if self-hosted from source) or config if using saleor-platform
│   ├── apps/
│   │   ├── payments_sslcommerz/   # Custom payment gateway plugin
│   │   ├── delivery_courier/      # Courier API integration app
│   │   └── sms_notifications/     # SMS gateway integration app
│   ├── .env.example
│   └── docker-compose.yml
├── storefront/                # Next.js frontend
│   ├── app/                   # App router
│   │   ├── (shop)/products/
│   │   ├── (shop)/cart/
│   │   ├── (shop)/checkout/
│   │   ├── (shop)/customizer/     # Jersey name/number builder
│   │   └── (admin)/               # If any admin-facing custom UI beyond Saleor Dashboard
│   ├── components/
│   ├── lib/
│   │   ├── graphql/            # Saleor GraphQL queries/mutations
│   │   ├── sslcommerz/
│   │   └── courier/
│   ├── locales/                # bn.json, en.json (i18n)
│   ├── .env.example
│   └── next.config.js
├── docs/
│   ├── jersey-ecommerce-prd.md
│   └── instructions.md         # this file
└── README.md
```

---

## 2. Tech Stack Reference (must match PRD)

| Layer | Choice |
|---|---|
| Backend | Saleor (Python/Django, GraphQL) |
| Frontend | Next.js (React, App Router) |
| Database | PostgreSQL |
| Payments | SSLCommerz (bKash/Nagad/Rocket/card) + Cash on Delivery |
| SMS | Local SMS gateway (e.g., BulkSMSBD or equivalent — confirm provider with user) |
| Delivery | Pathao Courier / RedX / Steadfast (confirm which one with user before building) |
| Search | Meilisearch |
| Cache/Queue | Redis |
| Image storage | Cloudinary or S3 |
| Customizer canvas | Fabric.js or Konva.js |

Do not substitute technologies from this list without checking with the user first — these were chosen deliberately for the Bangladesh market (see PRD Section 5.3).

---

## 3. Build Phases

Work through these phases **in order**. Each phase has a clear "done" condition — do not proceed to the next phase until it's met.

### Phase 1 — Backend Foundation
**Goal:** Saleor running locally with PostgreSQL and Redis, admin dashboard accessible.

1. Set up `docker-compose.yml` with services: `backend` (Saleor), `db` (Postgres), `redis`.
2. Run Saleor migrations and create a superuser.
3. Verify GraphQL Playground is reachable at `/graphql/`.
4. Verify Saleor Dashboard loads and superuser can log in.

**Done when:** Agent can create a test product via the Dashboard and query it back via GraphQL.

### Phase 2 — Product Catalog & Variants
**Goal:** Jersey products with size/color variants match real business needs.

1. Define product type "Jersey" with attributes: size (S/M/L/XL/XXL), color, team/league, customizable (boolean).
2. Seed 3–5 sample jersey products with variants and images (placeholder images are fine at this stage).
3. Build the storefront product listing page (`/products`) and product detail page (`/products/[slug]`) pulling from Saleor's GraphQL API.

**Done when:** A user can browse products, filter by size, and view a product detail page in the local dev environment.

### Phase 3 — Customizer (Name/Number Builder)
**Goal:** Customer can personalize a jersey before adding to cart.

1. Build a canvas-based customizer component (Fabric.js/Konva.js) on the product detail page: input fields for name + number, live preview overlaid on jersey image.
2. Store customization data as line-item metadata when added to Saleor's checkout/cart (Saleor supports custom metadata on checkout lines — use this, don't create a parallel data store).
3. Ensure the customization shows correctly in cart, checkout summary, and the final order in the Dashboard.

**Done when:** Admin can open an order in the Dashboard and see the exact name/number/size the customer chose.

### Phase 4 — Cart & Checkout
**Goal:** Full purchase flow works end-to-end in sandbox mode.

1. Build cart page: line items, quantities, remove/edit customization.
2. Build checkout: shipping address form (include district/upazila fields relevant to Bangladesh addressing), delivery charge calculation (inside Dhaka vs. outside Dhaka — pull from a config table, not hardcoded).
3. Integrate SSLCommerz sandbox for card/bKash/Nagad/Rocket payment.
4. Implement Cash on Delivery as a payment method option — on selection, mark order as `payment_status: pending_cod` and skip the gateway redirect.
5. Trigger order confirmation via SMS gateway (sandbox/test mode) and email on successful checkout.

**Done when:** A test order can be completed via both (a) SSLCommerz sandbox and (b) COD, and both create a correct order in Saleor with correct payment status.

### Phase 5 — Delivery/Courier Integration
**Goal:** Admin can dispatch orders through a courier API from the order screen.

1. Build the courier integration app: on order fulfillment, call the courier API (Pathao/RedX/Steadfast — confirm which with user) to create a delivery booking.
2. Store the returned tracking ID on the order.
3. Expose tracking ID/status to the customer on their order history page.

**Done when:** A test order can be booked with the courier sandbox API and the tracking ID appears on both the Dashboard and customer-facing order page.

### Phase 6 — Bulk/Team Orders
**Goal:** Team managers can order multiple customized jerseys in one checkout.

1. Build a "Team Order" flow: form or CSV upload for roster (name, number, size per player).
2. Generate one line item per player, each with its own customization metadata, under a single order.
3. Apply bulk pricing rule (e.g., discount at 10+ units) — implement as a Saleor promotion/voucher rule, not hardcoded frontend logic.

**Done when:** A 10+ player roster can be submitted in one checkout and produces correctly itemized, individually-customized line items with the bulk discount applied.

### Phase 7 — Admin, Search, Polish
1. Wire up Meilisearch indexing for product search (sync on product create/update).
2. Add Bangla/English toggle (i18n) across storefront.
3. Set up Sentry for error monitoring on both frontend and backend.
4. QA pass: test all flows on mobile viewport (majority of Bangladeshi traffic is mobile).

**Done when:** Full flow (browse → customize → bulk or single order → pay via COD or SSLCommerz → courier booking → tracking) works on a mobile viewport in both languages.

### Phase 8 — Deployment
1. Deploy backend to Railway/Render (or specified Singapore-region VPS).
2. Deploy frontend to Vercel.
3. Set production environment variables (real API keys) — **only after user confirms they've provided production credentials, never invent or reuse sandbox keys in production config.**
4. Verify a real low-value end-to-end test transaction before declaring launch-ready.

**Done when:** User has manually confirmed a real test order on the production URL.

---

## 4. Coding Conventions

- **Backend:** Follow Django/Saleor app conventions — new integrations (payments, courier, SMS) go in their own Django app under `backend/apps/`, not patched into Saleor core.
- **Frontend:** TypeScript throughout. GraphQL queries co-located with the components that use them under `lib/graphql/`.
- **Secrets:** All API keys/secrets via environment variables, never hardcoded. Provide `.env.example` files with placeholder names only.
- **Commits:** Small, scoped commits per feature/phase step — not one giant commit per phase.
- **Tests:** Each payment and courier integration needs at least one automated test hitting the sandbox/mock API, since these are the highest-risk-of-silent-failure integrations (money and shipping).

---

## 5. Things the Agent Should NOT Do

- Do not swap in Stripe, Shopify, or any component not listed in Section 2 without explicit user confirmation — this stack was deliberately chosen for the Bangladesh market.
- Do not fabricate courier/SMS/payment API responses to "make progress look complete" — use official sandbox/test modes, and clearly flag if sandbox credentials are missing.
- Do not hardcode delivery charges, discount thresholds, or VAT logic directly in frontend code — these change often and should live in backend config/admin-editable fields.
- Do not skip the mobile-viewport QA pass — most target customers are on mobile.
- Do not deploy to production with sandbox API keys.

---

## 6. Reference Documents

- `jersey-ecommerce-prd.md` — full product requirements, feature list, and rationale for tech choices.
- Saleor docs: https://docs.saleor.io
- SSLCommerz integration docs: https://developer.sslcommerz.com
- Next.js docs: https://nextjs.org/docs
