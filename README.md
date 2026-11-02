# StudioSpace

**Live Site URL**: [https://studiospace-frontend-two.vercel.app](https://studiospace-frontend-two.vercel.app)

---

## Features

- **Peer-to-Peer Creative Studio Marketplace**: Studio owners can list and manage production spaces (photo studios, film sound stages, podcast lounges, music suites, and art workshops), while creators can discover, inspect availability, and book slots with transparent hourly rates.
- **Dynamic Filtering & Real-time Search**: Search studios by keyword, filter by categories, and sort by price, rating, or capacity dynamically connected to MongoDB.
- **Double-Booking Prevention Engine**: Real-time server-side time slot collision detection preventing scheduling conflicts across confirmed and pending reservations.
- **Downloadable PDF Booking Invoices**: Instant client-side generation and download of itemized PDF receipts for confirmed studio bookings.
- **Saved Studios Wishlist**: Authenticated users can bookmark and manage their favorite creative spaces with persistent MongoDB synchronization.
- **System-wide Theme Customization**: Smooth light and dark mode toggling with persistent user preference storage.
- **Secure Authentication & Protected Mutations**: Creator accounts and session management powered by JWT with HTTPOnly cookies, role-based controls, and password validation.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI / Radix UI, TypeScript
- **Backend**: Express.js, Node.js, MongoDB Atlas (Native MongoClient)
- **Authentication**: BetterAuth, JWT, HTTPOnly Cookies
- **Integrations & Utilities**: jsPDF (Invoice Generation), Sonner (Toast Notifications), Lucide React

---

## Local Setup Steps

### 1. Clone Repositories
```bash
# Clone Frontend
git clone https://github.com/sabbirckc/studiospace.git
cd studiospace

# Clone Backend (in a separate directory)
git clone https://github.com/sabbirckc/studiospace-server.git
cd studiospace-server
```

### 2. Backend Setup
```bash
cd studiospace-server
npm install
```
Create a `.env` file in `studiospace-server`:
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```
Run the server:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd studiospace
npm install
```
Create a `.env` file in `studiospace`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_jwt_secret_key
MONGODB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
Run the frontend:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Examiner Test Credentials

- **Email**: `examiner@studiospace.io`
- **Password**: `Password123!`
- **Capabilities**: Pre-loaded with studio listings, active reservations, and collision test slots.
- **Quick Access**: Click the **"Auto-fill"** button on the Login page to instantly populate these credentials.
