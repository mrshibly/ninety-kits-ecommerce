# Product Requirements Document (PRD)
## Jersey Business E-Commerce Platform

**Version:** 1.0
**Date:** August 14, 2026
**Status:** Draft

---

## 1. Executive Summary

This document outlines the requirements, scope, and recommended technology stack for building an e-commerce platform for a sports jersey business **targeting customers in Bangladesh**. The platform will support browsing, customization (names/numbers), size/variant selection, cart, checkout, order management, local payment methods, local courier fulfillment, and admin/inventory tools.

**Recommended stack:** Saleor (Python/Django, headless) + Next.js storefront + PostgreSQL + **SSLCommerz (bKash, Nagad, Rocket, cards) + Cash on Delivery** — chosen for Python-based backend ownership, low recurring cost, and support for the payment and delivery methods Bangladeshi customers actually use.

> **Key difference from a global-market build:** Stripe is not usable for BDT settlement to a Bangladeshi bank account, and card penetration is low. This PRD replaces Stripe with a local payment aggregator and makes **Cash on Delivery (COD)** a first-class payment method, since COD remains the dominant payment mode for e-commerce in Bangladesh.

---

## 2. Goals & Objectives

| Goal | Success Metric |
|---|---|
| Launch a functional online store | Live site accepting orders within target timeline |
| Support jersey customization (name/number/size) | Customer can personalize a jersey before checkout |
| Handle team/bulk orders | Cart supports multi-item, multi-size bulk orders |
| Reliable payments | <1% failed transaction rate |
| Scalable catalog | Supports 100s–1000s of SKUs without redesign |
| Fast page loads | <2.5s LCP on product pages |

### Out of Scope (v1)
- Mobile native apps (responsive web only)
- Multi-currency / multi-language (planned for v2)
- Marketplace/multi-vendor support

---

## 3. Target Users

- **Customers:** Individuals buying a single jersey (fans), and team managers/coaches placing bulk orders with rosters.
- **Store Admin:** Manages products, inventory, pricing, orders, discounts.
- **Fulfillment staff:** Views/processes orders, updates shipping status.

---

## 4. Core Features (User Stories)

### 4.1 Storefront
- As a customer, I can browse jerseys by team/league/category.
- As a customer, I can filter by size, price, color.
- As a customer, I can view a product detail page with size chart, images, and description.
- As a customer, I can search for a product by keyword.

### 4.2 Customization
- As a customer, I can add a custom name and number to a jersey before adding to cart.
- As a customer, I can preview the customization on the jersey (visual mockup).
- As a customer, I can select size and quantity per customization.

### 4.3 Bulk/Team Orders
- As a team manager, I can upload or manually enter a roster (name, number, size per player) in one order.
- As a team manager, I can apply a bulk discount automatically at a quantity threshold.

### 4.4 Cart & Checkout
- As a customer, I can add multiple customized items to a single cart.
- As a customer, I can check out as a guest or registered user.
- As a customer, I can pay via **bKash, Nagad, Rocket, or card** (through a local aggregator), or choose **Cash on Delivery (COD)**.
- As a customer, I can select my district/area, and the platform shows applicable delivery charge and estimated delivery time before I confirm the order.
- As a customer, I receive an order confirmation via **SMS and email** (SMS is critical in the Bangladesh market, since not all customers check email regularly).
- As an admin, I can verify a COD order by phone/SMS before it's dispatched, to reduce fake/failed COD orders (a common issue in the Bangladesh market).

### 4.5 Account & Orders
- As a customer, I can create an account and view order history.
- As a customer, I can track shipment status.

### 4.6 Delivery & Fulfillment
- As an admin, I can book a delivery through a courier partner (e.g., **Pathao Courier, RedX, Steadfast, or Sundarban**) directly from the order screen.
- As a customer, I can track my delivery status using the courier's tracking ID.
- As an admin, I can set different delivery charges for **inside Dhaka**, **outside Dhaka**, and (optionally) **international** orders.

### 4.7 Admin
- As an admin, I can add/edit products, variants (size/color), and pricing.
- As an admin, I can manage inventory levels per SKU.
- As an admin, I can view and update order status (processing, shipped, delivered).
- As an admin, I can create discount codes and bulk-pricing rules.

---

## 5. Recommended Tech Stack

### 5.1 Overview Table

| Layer | Technology | Why |
|---|---|---|
| Backend / Commerce Engine | **Saleor** (Python/Django, GraphQL API) | Open-source, Python-native, built-in product variants, inventory, orders, payments |
| Frontend / Storefront | **Next.js (React)** | Fast, SEO-friendly, official Saleor storefront starters available |
| Database | **PostgreSQL** | Saleor's native DB, robust for relational commerce data |
| Payments | **SSLCommerz** (aggregates bKash, Nagad, Rocket, Visa/Mastercard) + **Cash on Delivery** | Standard in Bangladesh; direct bKash/Nagad merchant APIs are an alternative but SSLCommerz is faster to integrate and covers all major methods in one integration |
| SMS Notifications | **local SMS gateway** (e.g., BulkSMSBD, Alpha SMS, or similar Bangladeshi provider) | Order confirmations, COD verification, delivery updates — SMS reaches customers more reliably than email in this market |
| Currency | **BDT (৳)** as base currency | Primary transaction currency for local customers |
| Language | **Bangla + English** (i18n via Next.js) | Broaden accessibility beyond English-only customers |
| Customization Tool (name/number builder) | **Fabric.js** or **Konva.js** (canvas library in Next.js) | Enables live jersey preview/customizer in-browser |
| Image Hosting/CDN | **Cloudinary** or **AWS S3 + CloudFront** | Fast image delivery; CDN edge coverage should be checked for South Asia latency |
| Search | **Meilisearch** (self-hosted, supports Bangla text reasonably well) | Fast filtered/faceted search across catalog, cost-effective to self-host |
| Caching/Queue | **Redis** | Session caching, background job queue (e.g., order emails/SMS) |
| Courier/Delivery Integration | **Pathao Courier API**, **RedX API**, or **Steadfast API** | Local last-mile delivery with tracking; pick one primary + one backup |
| Backend Hosting | **Railway** or **Render** (or a Singapore-region VPS for lower latency to Bangladesh, e.g. DigitalOcean Singapore) | Simple deploy for Django/Saleor + Postgres + Redis |
| Frontend Hosting | **Vercel** | Native Next.js hosting, global CDN with decent South/Southeast Asia coverage |
| Email | **Resend** or **SendGrid** | Secondary notification channel (SMS is primary) |
| Monitoring/Errors | **Sentry** | Error tracking across frontend + backend |

### 5.2 Architecture Diagram (Conceptual)

```
Customer Browser (Bangladesh)
      │
      ▼
Next.js Storefront (Vercel) — Bangla/English
      │  GraphQL queries
      ▼
Saleor Backend (Django/GraphQL API) — hosted on Railway/Render or Singapore VPS
      │
      ├── PostgreSQL (products, orders, customers)
      ├── Redis (cache, background jobs)
      ├── SSLCommerz (bKash / Nagad / Rocket / card payments)
      ├── Cash on Delivery flow (order flagged, confirmed via SMS)
      ├── SMS Gateway (order + delivery notifications)
      ├── Courier API (Pathao / RedX / Steadfast — booking + tracking)
      ├── Cloudinary/S3 (product images)
      └── Meilisearch (search index)
```

### 5.3 Why This Stack Over Alternatives

- **vs. Shopify:** Shopify Payments does not support Bangladeshi merchant bank settlement, so you'd need a third-party gateway workaround anyway (defeating Shopify's main convenience). Full backend ownership also avoids the monthly platform fee.
- **vs. plain Django build:** Saleor gives you product variants, cart, checkout, and order management out of the box — building this from scratch in raw Django would take significantly longer.
- **vs. WooCommerce:** Saleor is API-first (GraphQL), making the custom jersey-builder tool and bulk/team order flow far easier to build than in a WordPress/PHP environment. (WooCommerce is a reasonable alternative if you want the widest existing library of Bangladesh-specific plugins, e.g. bKash/SSLCommerz WooCommerce plugins already exist off-the-shelf.)
- **On payment gateway choice:** SSLCommerz, ShurjoPay, and AamarPay are the main aggregators in Bangladesh. SSLCommerz has the widest bank/MFS coverage and is recommended as the default; ShurjoPay is a solid alternative if their fee structure works out better for your volume.

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page load (LCP) | < 2.5s on product pages |
| Uptime | 99.5%+ |
| Payment security | PCI-DSS compliance via Stripe (no raw card data stored) |
| Mobile responsiveness | Fully responsive, mobile-first design |
| Scalability | Support 10,000+ SKUs and 1,000+ concurrent users without re-architecture |

---

## 7. Estimated Costs (Monthly, Early Stage)

| Item | Estimated Cost (USD) | Estimated Cost (BDT) |
|---|---|---|
| Backend hosting (Railway/Render or Singapore VPS) | $10–25 | ~৳1,200–3,000 |
| Frontend hosting (Vercel) | Free tier initially, ~$20 at scale | ~৳2,400 at scale |
| PostgreSQL | Included in hosting or ~$10–15 separately | ~৳1,200–1,800 |
| Domain (.com or .com.bd) | ~$1–15/month equivalent (annual purchase) | ~৳120–1,800/month equiv. |
| Image CDN (Cloudinary) | Free tier initially, ~$0–20 | ~৳0–2,400 |
| SMS gateway (local provider) | N/A — priced in BDT | ~৳0.30–0.50 per SMS |
| Email (Resend/SendGrid) | Free tier initially | — |
| SSLCommerz transaction fee | ~2.5–3.5% per transaction (varies by method: card vs MFS) | Same, in BDT |
| Courier delivery charge (pass-through to customer) | — | ~৳60–80 inside Dhaka, ~৳100–150 outside Dhaka (typical market rates) |
| Search (Meilisearch self-hosted) | Free (self-hosted) or included in backend host | — |
| **Total infra (pre-scale)** | **~$30–70/month** | **~৳3,600–8,500/month + transaction/SMS/delivery fees** |

> Note: SSLCommerz, courier, and SMS fees are usage-based, not fixed — actual monthly cost scales with order volume. Get current-rate quotes directly from SSLCommerz/courier providers before finalizing budget, as these rates change.

---

## 8. Milestones & Suggested Timeline

| Phase | Deliverable | Est. Duration |
|---|---|---|
| 1. Setup | Saleor backend deployed, Postgres/Redis configured, Stripe connected | 1–2 weeks |
| 2. Storefront MVP | Next.js frontend with catalog, PDP, cart, checkout | 2–3 weeks |
| 3. Customization Tool | Name/number jersey customizer with live preview | 2–3 weeks |
| 4. Bulk/Team Orders | Roster upload + bulk pricing logic | 1–2 weeks |
| 5. Admin & Polish | Admin workflows, email notifications, QA | 1–2 weeks |
| 6. Launch | Go live, monitoring in place | — |

**Total estimated timeline: ~8–12 weeks** (single full-stack developer; faster with a small team).

---

## 9. Open Questions

- Will inventory be self-stocked or print-on-demand (dropship)?
- Do you need multi-currency support (for overseas Bangladeshi customers) at launch, or later?
- Will the business ship internationally (e.g., to expat customers) or domestically only at launch?
- Do you have existing jersey mockup/design assets, or will these need to be created?
- Is the business VAT-registered? (E-commerce businesses in Bangladesh may need to account for VAT depending on revenue/registration status — recommend confirming with a local accountant, as this affects checkout pricing display.)
- Which courier partner(s) do you already have a relationship with, if any (Pathao, RedX, Steadfast, Sundarban)? This affects which API gets built first.
- What % of expected orders will be COD vs. digital payment? This affects how much fraud-prevention/verification workflow to prioritize in v1.

---

## 10. Appendix: Key Technology Links

- Saleor: https://saleor.io
- Next.js: https://nextjs.org
- SSLCommerz: https://www.sslcommerz.com
- Meilisearch: https://www.meilisearch.com
- Railway: https://railway.app
- Vercel: https://vercel.com
- Pathao Courier: https://pathao.com/courier
- RedX: https://redx.com.bd
- Steadfast Courier: https://steadfast.com.bd

*Note: pricing, coverage, and API availability for local providers (SSLCommerz, courier partners, SMS gateways) should be verified directly with each provider, as terms and rates change over time.*
