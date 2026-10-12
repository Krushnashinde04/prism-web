-- =========================================================================
-- PRISM COLLEGE PLATFORM — PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor to configure all tables & RLS policies
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'member', 'student', 'guest');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'blocked', 'pending');
CREATE TYPE content_category AS ENUM (
  'College Announcements',
  'News',
  'Events',
  'Programs',
  'Team Activities',
  'Achievements',
  'Workshops',
  'Competitions',
  'Other'
);
CREATE TYPE content_status AS ENUM (
  'Draft',
  'Pending Review',
  'Changes Requested',
  'Approved',
  'Published',
  'Rejected',
  'Archived'
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'student',
  status account_status DEFAULT 'active',
  block_reason TEXT,
  blocked_at TIMESTAMPTZ,
  suspended_until TIMESTAMPTZ,
  department TEXT,
  year TEXT,
  team TEXT,
  designation TEXT,
  avatar TEXT,
  phone TEXT,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEMBERSHIP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  student_id TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  applied_team TEXT NOT NULL,
  reason TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_note TEXT,
  assigned_team TEXT,
  assigned_designation TEXT
);

-- 4. WEBSITE CONTENT & SUBMISSION WORKFLOW TABLE
CREATE TABLE IF NOT EXISTS public.website_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category content_category NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  event_date TEXT,
  event_time TEXT,
  venue TEXT,
  related_team TEXT,
  related_program TEXT,
  external_link TEXT,
  author_id UUID REFERENCES public.users(id),
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_role user_role NOT NULL,
  status content_status DEFAULT 'Draft',
  review_feedback TEXT,
  reviewer_name TEXT,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  category TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  target_role user_role,
  target_user_id UUID,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public Read Published Content" ON public.website_contents
  FOR SELECT USING (status = 'Published');

-- Admins have full access to all tables
CREATE POLICY "Admin Full Access Users" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR EXISTS (
    SELECT 1 FROM public.users WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  ));

CREATE POLICY "Admin Full Access Contents" ON public.website_contents
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  ));

CREATE POLICY "Admin Full Access Logs" ON public.admin_audit_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  ));
