# ALSA.S — Author Platform & Digital Sanctuary

An elegant, literary-grade author platform and digital sanctuary crafted for author and poet **Alsa.S**. Built with Next.js 15, Tailwind CSS, Prisma, SQLite, and Nodemailer.

---

## ✨ Features

- **Editorial Literary Aesthetic**: Warm ivory tones (`#FAF8F5`, `#FAF6EB`), deep ink typography (`#1A1715`), antique gold accents (`#C5A059`), and Cormorant Garamond typography.
- **Book Catalog**: Showcases published titles, work-in-progress novels (*Like the Moon to the Tide*, *Do Not Get Off*), synopsis, author notes, excerpts, and external purchase links (Amazon, Notion Press, Barnes & Noble, etc.).
- **Writings & Poetry**: Literary pieces organized by category (Poetry, Short Stories, Excerpts, Reflections) with custom submission/publication dates and estimated reading times.
- **Author's Journal (Blog)**: Long-form reflective articles, behind-the-scenes writing journey posts, tags, and reading times.
- **Dynamic About Page Studio**: Fully customizable biography, literary philosophy pillars, and interactive milestone timeline editable directly from `/admin/about`.
- **Dynamic Contact Page Studio**: Manage literary agency representation, direct correspondence email, and social sanctuaries from `/admin/contact`.
- **Subscriber Messages & Presentation Decks**:
  - Broadcast personal author letters and early excerpts.
  - Attach reading presentation lookbooks and pitch decks (Google Slides, Canva, Dropbox, PDF).
  - Live email preview modal matching the author's brand.
  - **Real Gmail Inbox Delivery**: Integrates with Gmail SMTP via Nodemailer to deliver formatted emails directly into subscribers' Gmail inboxes.
- **Protected Admin Studio**: Full administrative suite at `/admin` secured with JWT authentication.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.17+ recommended)
- `npm`

### 2. Installation

Clone the repository:
```bash
git clone <your-repository-url>
cd "Author Portfolio"
```

Install dependencies:
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file from the template:
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secure_jwt_secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Database Initialization & Seeding

Initialize the SQLite database schema and seed default author content:
```bash
npx prisma db push
node prisma/seed.js
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗝️ Default Admin Studio Credentials

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@alsas.com`
- **Password**: `AlsaAuthor2026!`

*(Remember to update the admin password in production.)*

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Styling**: Tailwind CSS & Lucide Icons
- **Database**: SQLite with Prisma ORM
- **Email Delivery**: Nodemailer (Gmail SMTP integration)
- **Authentication**: JWT & HTTP-only cookies with `jose` and `bcryptjs`
