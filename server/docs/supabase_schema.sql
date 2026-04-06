-- GigSphere Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT CHECK (role IN ('client', 'freelancer', 'admin')) NOT NULL,
  full_name TEXT NOT NULL,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  avg_rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  auth_provider TEXT DEFAULT 'email'
);

-- 2. Gigs Table
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required TEXT[] DEFAULT '{}',
  budget NUMERIC NOT NULL,
  deadline DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount NUMERIC NOT NULL,
  delivery_days INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  ai_score NUMERIC,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'delivered', 'completed', 'disputed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'paid', 'refunded')),
  paid_at TIMESTAMPTZ
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gigs_client_id ON gigs(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_gig_id ON proposals(gig_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_gig_id ON contracts(gig_id);
CREATE INDEX IF NOT EXISTS idx_messages_contract_id ON messages(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_reviews_contract_id ON reviews(contract_id);

-- Enforce Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Basic Policies (example for users)
-- Authenticated users can view other user profiles (limited info)
CREATE POLICY "Public profiles are viewable by everyone" ON users
FOR SELECT USING (true);

-- Users can only Update their own profile
CREATE POLICY "Users can update their own data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Gigs policies
CREATE POLICY "Gigs are viewable by everyone" ON gigs
FOR SELECT USING (true);

CREATE POLICY "Clients can create their own gigs" ON gigs
FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own gigs" ON gigs
FOR UPDATE USING (auth.uid() = client_id);
