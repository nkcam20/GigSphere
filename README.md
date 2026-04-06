# GigSphere — AI-Powered Freelancer Marketplace

Welcome to the future of freelancing. **GigSphere** is a high-performance web platform that connects elite talent with world-class projects using Claude AI for intelligent matchmaking.

## 🚀 2026 Core Features
- **Claude AI Ranking**: Automated proposal analysis for perfect matching.
- **Stripe Escrow**: Secure, milestone-based payment processing.
- **Real-time Engine**: WebSocket messaging for instant partner communication.
- **Premium Mesh UI**: Cutting-edge Glassmorphism design system.
- **Supabase Backbone**: Scalable PostgreSql with Row Level Security.

## 🛠️ Project Setup

### 1. Database (Supabase)
1. Create a new Supabase project.
2. Visit the **SQL Editor** and execute the contents of `server/docs/supabase_schema.sql`.
3. Go to **Project Settings > API** to get your URL and Anon Key.

### 2. Backend Installation
```bash
cd server
npm install
cp .env.example .env
```
Update your `.env` with:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `CLAUDE_API_KEY` (Anthropic)
- `STRIPE_SECRET_KEY`

### 3. Frontend Installation
```bash
cd client
npm install
```

### 4. Running Locally
Run both servers simultaneously:
- **Server**: `npm run dev` (Port 5000)
- **Client**: `npm run dev` (Port 5173)

## 🏗️ Architecture
- **Frontend**: React + Vite + Vanilla CSS
- **Backend**: Node.js + Express.js + Socket.io
- **AI Layer**: Claude-3.5-Sonnet (Anthropic SDK)
- **Infrastructure**: Supabase (DB/Auth) + Stripe (Payments)

---
*Built for the 2026 workforce by Antigravity*
