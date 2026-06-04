-- Migration: Create google_oauth_tokens table
-- Stores encrypted Google OAuth tokens for teachers to support stateless scaling
-- Replaces the in-memory Map() stored in googleTokenStore

CREATE TABLE IF NOT EXISTS public.google_oauth_tokens (
    teacher_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on google_oauth_tokens
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Only teachers can read their own tokens
CREATE POLICY "Teachers can view own oauth tokens"
    ON public.google_oauth_tokens
    FOR SELECT
    USING (auth.uid() = teacher_id);

-- Policy: Only teachers can insert their own tokens
CREATE POLICY "Teachers can insert own oauth tokens"
    ON public.google_oauth_tokens
    FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- Policy: Only teachers can update their own tokens
CREATE POLICY "Teachers can update own oauth tokens"
    ON public.google_oauth_tokens
    FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Policy: Only teachers can delete their own tokens
CREATE POLICY "Teachers can delete own oauth tokens"
    ON public.google_oauth_tokens
    FOR DELETE
    USING (auth.uid() = teacher_id);
