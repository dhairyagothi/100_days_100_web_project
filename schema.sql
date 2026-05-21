-- ============================================================
-- 1. CREATE USER PROFILES TABLE
-- ============================================================
-- Creates the user data ledger linking custom app metrics to Supabase Auth
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    username TEXT,
    bookmarks JSONB DEFAULT '[]'::jsonb NOT NULL,
    recent_projects JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Locks down the table to prevent unauthorized background modifications
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Policy A: Allow users to view profile structures internally if required
CREATE POLICY "Allow authenticated read access" 
    ON public.user_profiles FOR SELECT 
    USING (true);

-- Policy B: Allow users to dynamically push bookmarks/recent projects to their own profile rows
CREATE POLICY "Allow users to update their own profile data" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Policy C: Allow the signup automation mechanism to insert user data records upon account verification
CREATE POLICY "Allow users to insert their own profile data" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);