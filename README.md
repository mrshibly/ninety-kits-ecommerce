# ⚡ NINETY KITS — Premium Sports Jersey E-Commerce Platform

> **Bangladesh's Premier Destination for Authentic Football & Sports Jerseys**  
> *Engineered with Next.js App Router, TypeScript, Real-Time Heat-Press Customization Studio, Team Roster Builder, Localized Bangladesh Payments (bKash, Nagad, Rocket, COD), and a Complete Dynamic Admin Operations Control Center.*

---

## 🌟 Flagship Features

### 🛍️ 1. Editorial Storefront & Shopping Experience
- **PUMA-Inspired Luxury Design**: Sharp 2px corners, high-contrast monochrome aesthetic (`#000000` / `#FFFFFF`), Athletic Emerald highlights (`#00A855`), and bold `Outfit` + `Inter` typography.
- **Dynamic Real-Time Catalog**: Club kits (Premier League, La Liga, Ligue 1, Serie A) and National Teams (Brazil, Argentina, Bangladesh, Germany, France, etc.) with instant filter & sort.
- **Product Details & Sizing**: S / M / L / XL / XXL sizing charts, detailed fabric specifications, and stock counters.
- **Bilingual Experience**: Instant 1-click toggle between **English (EN)** and **Bangla (বাংলা)** across all interface labels.
- **Instant Search & Wishlist**: Real-time keyword filtering modal and persistent wishlist.

### 🎨 2. Heat-Press Name & Number Customization Studio
- **Live Jersey Mockup**: Real-time visual heat-press simulation of customer-entered **Player Name** and **Squad Number**.
- **Official Team Fonts & Badges**: League tournament sleeve patch selector (UCL, Premier League, World Champions badge).

### 👥 3. Team & Tournament Squad Order Builder (`/team-orders`)
- **Multi-Player Roster Table**: Add customized jersey entries with Player Name, Squad Number, and Size for entire sports teams, tournaments, or corporate squads in a single order.
- **Tiered Volume Bulk Discounts**:
  - 5–10 Kits: **10% OFF**
  - 11–20 Kits: **15% OFF**
  - 21+ Kits: **20% OFF**

### 💳 4. Localized Bangladesh Checkout Flow
- **Payment Gateways**:
  - **bKash Direct & QR** (with verified TrxID validation)
  - **Nagad & Rocket** Mobile Financial Services
  - **Visa / Mastercard / Amex**
  - **Cash on Delivery (COD)** with automated phone verification step
- **Smart Delivery Calculator**: Automated courier rate computation for **Inside Dhaka (৳60)** and **Outside Dhaka (৳120)** with free shipping thresholds.

### 🛡️ 5. Dedicated Enterprise Admin Operations Dashboard (`/admin`)
- **Orders Dynamic Queue**: Real-time order tracking, status steppers (`Pending COD` → `Printing Queue` → `Quality Checked` → `Dispatched` → `Delivered`), customer contact info, and Pathao / Steadfast courier booking.
- **Heat-Press Printing Studio Queue**: Dedicated workflow for workshop technicians to view custom names, numbers, and sleeve patches.
- **COD Phone Verification Module**: Quick verification workflow for customer phone numbers and addresses before dispatch.
- **Product & Inventory CRUD**: Add new jerseys, update prices, manage stock with `[-5]` `[+5]` `[+20]` quick counters, and edit fabric details.
- **Jersey & Hero Image Uploader**: Upload photos directly from local device, select from 8 studio presets, or enter image URLs with instant live preview.
- **Storefront Hero & Campaign Manager**: Change homepage match action banner photos, promotional badges, and main headline copy in real time.
- **Discount Vouchers Engine**: Create percentage (% OFF) or flat amount (৳ OFF) promo codes with minimum cart spend rules and usage counters.

---

## 🏗️ Architecture & Tech Stack

```
                     ┌──────────────────────────────────────────────┐
                     │          CUSTOMER & ADMIN BROWSERS           │
                     │          (Desktop, Tablet, Mobile)           │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │            NEXT.JS STOREFRONT & APPS         │
                     │  - React 19 / Next.js 15 App Router          │
                     │  - TypeScript & CSS Modules Design System    │
                     │  - Client State: Cart, Wishlist, StoreData   │
                     │  - Real-time LocalStorage Persistence Sync   │
                     └──────────────────────┬───────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
                    ▼                                               ▼
     ┌─────────────────────────────┐                 ┌─────────────────────────────┐
     │      PAYMENT INTEGRATION    │                 │      COURIER LOGISTICS      │
     │  - bKash Merchant TrxID     │                 │  - Pathao Express API       │
     │  - Nagad / Rocket MFS       │                 │  - Steadfast Courier API    │
     │  - SSLCommerz Gateway       │                 │  - Live Tracking System     │
     │  - Cash on Delivery (COD)   │                 └─────────────────────────────┘
     └─────────────────────────────┘
```

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS Modules + PUMA Flagship Design System Tokens |
| **Typography** | `Outfit` (Headings, Buttons, Prices) + `Inter` (Body) |
| **State Management** | React Context API with persistent real-time storage |
| **Currency** | Bangladeshi Taka (৳ BDT) |
| **Localization** | English + Bengali (বাংলা) |

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mrshibly/ninety-kits-ecommerce.git
cd ninety-kits-ecommerce/jersey-shop/storefront
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Access Credentials

| Portal | URL | Demo Credentials |
|---|---|---|
| **Customer Storefront** | `http://localhost:3000/` | Public Access |
| **Customer Account Portal** | `http://localhost:3000/account/login` | Click **`[ Auto-fill Demo Customer ]`** |
| **Admin Operations Dashboard** | `http://localhost:3000/admin` | Click **`[ Sign In as Operations Admin ]`** at `/admin/login` |

---

## 📁 Repository Structure

```
jersey-shop/
├── storefront/
│   ├── app/
│   │   ├── page.tsx                  # Flagship Homepage with Hero & Customizer Banner
│   │   ├── products/                 # All Kits Catalog with Dynamic Filter & Sort
│   │   ├── customizer/               # Heat-Press Jersey Customization Studio
│   │   ├── team-orders/              # Squad Roster Order Builder
│   │   ├── checkout/                 # bKash / Nagad / Card / COD Checkout Flow
│   │   ├── track-order/              # Live Courier Order Tracking
│   │   ├── wishlist/                 # Customer Wishlist
│   │   ├── account/                  # Customer Account & Order History
│   │   └── admin/                    # Dedicated Admin Operations Control Center
│   ├── components/                   # Navbar, TopBanner, Footer, Customizer, Icons
│   ├── lib/                          # State Contexts (Cart, Wishlist, StoreData, Auth)
│   └── public/images/                # High-res jersey cutouts & campaign banners
└── README.md
```

---

## 📄 License
Proprietary — © 2026 **NINETY KITS Bangladesh**. All rights reserved.
