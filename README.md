# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

> **Live Application URL**: [https://studiospace-peer-marketplace.vercel.app](https://studiospace-peer-marketplace.vercel.app)  
> **Server API Repository**: [https://github.com/sabbirckc/studiospace-server](https://github.com/sabbirckc/studiospace-server)  
> **Client Web Repository**: [https://github.com/sabbirckc/studiospace](https://github.com/sabbirckc/studiospace)

---

## 🌟 Executive Overview
**StudioSpace** is a high-performance peer-to-peer marketplace engineered specifically for creators, filmmakers, photographers, podcasters, and music producers. Studio owners and hosts can list their production spaces—ranging from daylight cyclorama cyc walls and certified STC-60 cinema sound stages to multi-cam 4K podcast lounges, Dolby Atmos recording suites, and artisan ceramics labs. Visiting creators can discover, inspect dynamic availability, prevent booking collisions, and reserve hourly slots with transparent pricing and real-time reservation management.

---

## 🔑 Key Platform Features (Minimum 5 Highlights)
1. **Dynamic Workspace Discovery & Multi-Category Filtering**: Real-time MongoDB search querying photo studios, cinema sound stages, podcast rooms, music suites, and art workshops with sorting by price, rating, and capacity.
2. **Double-Booking Collision Prevention Engine (Challenge 2)**: Server-side overlap algorithms verify existing `Confirmed` and `Pending` reservations before accepting bookings, preventing double-bookings.
3. **Downloadable PDF Booking Invoice Receipts (Optional 1)**: Instant client-side generation of itemized, verification-watermarked PDF receipts featuring booking references, crew counts, and hourly financial statements.
4. **Interactive Saved Wishlist with MongoDB Sync (Optional 2)**: Persistent bookmarking with reactive heart icons on studio cards stored directly in MongoDB for instant access.
5. **Secure Authentication with HTTPOnly Cookies & JWT (Challenge 1)**: Protected mutations (studio creation, deletion, booking reservations) guarded by JWT verification with password validation rules (uppercase, lowercase, 6+ characters).
6. **Dark / Light Mode Theme Engine (Challenge 3)**: System-wide theme toggle with persistent local storage and CSS variables.
7. **Zero Lorem Ipsum & Modern Toast UI**: 100% authentic production studio photography and equipment specifications, with Sonner toast notifications and custom modal dialogs (no browser alerts).

---

## 🛠️ Complete Tech Stack

| Layer | Technology Selection |
|---|---|
| **FrontEnd** | Next JS (App Router), Shadcn UI / Radix UI tokens, Tailwind CSS, TypeScript / JavaScript |
| **Authentication & Authorization** | BetterAuth, MongoDB Adapter, JWT, HTTPOnly Secure Cookies |
| **BackEnd** | Express JS, MongoDB Atlas (Native MongoClient), TypeScript / JavaScript |
| **Integrations & Utilities** | ImgBB Image Upload API, jsPDF Invoice Generator, Sonner Modern Toasts |

---

## 📋 Examiner Test Credentials

| Role | Email | Password | Pre-loaded Capabilities |
|---|---|---|---|
| **Examiner Demo Account** | `examiner@studiospace.io` | `Password123!` | Host listings, active bookings, test collision check |
| **Google Social Login** | One-Click Demo | N/A | Instant creator authentication |

> 💡 *Examiner Tip*: You can click the **"Auto-fill"** button on the Login page to instantly populate these examiner credentials.

---

## 🚀 Local Installation & Setup Steps

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Git**
- **MongoDB Atlas** cluster URI

---

### 2. Backend Server Setup
```bash
# Clone the server repository
git clone https://github.com/sabbirckc/studiospace-server.git
cd studiospace-server

# Install dependencies
npm install

# Configure environment variables (.env)
cat <<EOF > .env
PORT=8000
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EOF

# Seed initial creative studios and examiner account
node seed.js

# Start the Express server
node index.js
# Backend runs at http://localhost:8000
```

---

### 3. Frontend Client Setup
```bash
# Clone the client repository
git clone https://github.com/sabbirckc/studiospace.git
cd studiospace

# Install dependencies
npm install

# Configure environment variables (.env.local)
cat <<EOF > .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Run development server
npm run dev
# Frontend runs at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore StudioSpace.

---

## 🛡️ Challenge Requirements Fulfillment Summary
- **Challenge 1 (JWT Security with HTTPOnly Cookies)**: Mutations (`POST /api/studios`, `PUT /api/studios/:id`, `DELETE /api/studios/:id`, `POST /api/bookings`) are protected by the `verifyJWT` middleware checking HTTPOnly `token` cookies.
- **Challenge 2 (Double-Booking Collision Prevention)**: Implemented in `routes/bookings.js` with `checkBookingCollision()`, validating time intervals `(newStart < existingEnd && newEnd > existingStart)`. Returns `409 Conflict` if reserved.
- **Challenge 3 (Theme Customization)**: Implemented with `ThemeProvider` (`src/context/theme-context.tsx`), dynamic dark class toggling on `document.documentElement`, and persistent `studiospace_theme` localStorage.

---

## 📄 License & Attribution
Designed & developed for the B14-A8 Cat Harry Project. All images licensed under the Unsplash Creative Commons License.
