-- Create experiment_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.experiment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    experiment_type TEXT NOT NULL,
    chem_a INTEGER CHECK (chem_a >= 0 AND chem_a <= 100),
    chem_b INTEGER CHECK (chem_b >= 0 AND chem_b <= 100),
    chem_c INTEGER CHECK (chem_c >= 0 AND chem_c <= 100),
    chem_d INTEGER CHECK (chem_d >= 0 AND chem_d <= 100),
    result_name TEXT,
    result_formula TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    details JSONB, -- Added to match usage in titration.jsx
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.experiment_results ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can see only their own results
CREATE POLICY "Users can view their own experiment results"
ON public.experiment_results
FOR SELECT
USING (auth.uid() = user_id);

-- Create Policy: Users can insert their own results
CREATE POLICY "Users can insert their own experiment results"
ON public.experiment_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Policy: Users can update their own results (optional, but good for completeness)
CREATE POLICY "Users can update their own experiment results"
ON public.experiment_results
FOR UPDATE
USING (auth.uid() = user_id);
