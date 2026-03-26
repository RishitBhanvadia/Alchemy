-- Migration: Create meeting_sessions table
-- Stores ephemeral meeting sessions with 6-char codes for Zoom/Google Meet
-- Sessions expire after 2 hours from creation

CREATE TABLE IF NOT EXISTS meeting_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) NOT NULL,
  meeting_url TEXT NOT NULL,
  platform VARCHAR(10) NOT NULL CHECK (platform IN ('zoom', 'google')),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,

  -- Unique constraint on code to prevent duplicate codes
  CONSTRAINT meeting_sessions_code_unique UNIQUE (code)
);

-- Composite index for fast student lookups: code + not-expired check
CREATE INDEX IF NOT EXISTS idx_meeting_sessions_code_expires
  ON meeting_sessions(code ASC, expires_at ASC);

-- Enable Row Level Security
ALTER TABLE meeting_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can insert their own sessions
CREATE POLICY "Teachers can create meeting sessions"
  ON meeting_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

-- Policy: Any authenticated user can read sessions (for join lookup)
CREATE POLICY "Authenticated users can read meeting sessions"
  ON meeting_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Teachers can delete their own sessions
CREATE POLICY "Teachers can delete own meeting sessions"
  ON meeting_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);
