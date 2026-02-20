# FlowMint SaaS - Appointment & Business Management System

FlowMint is a professional multi-tenant SaaS platform designed for beauty shops, barbershops, and aesthetics centers. It allows business owners to manage their clients, employees, services, and appointments in a secure and isolated environment.

## 🚀 Key Features (SaaS Edition)

- **Multi-tenant Architecture:** Total data isolation between businesses. No commerce can see data from others.
- **Google OAuth 2.0:** Secure login and one-click registration.
- **Auto-Provisioning:** New Google sign-ups automatically create a new (inactive) shop space.
- **SuperAdmin Dashboard:** Master control panel to activate/deactivate shop accounts (Subscription management).
- **Financial Analytics:** Isolated revenue reports per shop.
- **AI Assistant:** Integrated AI to help business owners manage their shop contextually.

## 🛠 Tech Stack

### Backend (NestJS)
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** Passport.js + JWT + Google Strategy
- **Documentation:** Swagger (OpenAPI)

### Frontend (React)
- **Framework:** React 18 + Vite
- **Styling:** CSS Modules + SASS + Framer Motion (Animations)
- **UI:** React Bootstrap + Lucide Icons
- **Responsiveness:** Fully optimized for Mobile and Desktop.

## 📦 Deployment Guide (Cost $0 Strategy)

1.  **Database:** Supabase (Free tier PostgreSQL).
2.  **Backend:** Vercel or Render.
3.  **Frontend:** Netlify or Vercel.
4.  **Google Auth:** Set up a project in Google Cloud Console and add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to environment variables.

---
© 2026 FlowMint System - Posadas, Misiones, Argentina.
