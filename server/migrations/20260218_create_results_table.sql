-- Create results table for chemical reaction lookups
CREATE TABLE IF NOT EXISTS public.results (
    id SERIAL PRIMARY KEY,
    conc_a INTEGER NOT NULL CHECK (conc_a >= 0 AND conc_a <= 100),
    conc_b INTEGER NOT NULL CHECK (conc_b >= 0 AND conc_b <= 100),
    conc_c INTEGER NOT NULL CHECK (conc_c >= 0 AND conc_c <= 100),
    conc_d INTEGER NOT NULL CHECK (conc_d >= 0 AND conc_d <= 100),
    reaction_id INTEGER NOT NULL,
    result_name TEXT NOT NULL,
    result_formula TEXT,
    color TEXT,
    characteristics TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups based on concentrations and reaction type
CREATE INDEX IF NOT EXISTS idx_results_lookup ON public.results(conc_a, conc_b, conc_c, conc_d, reaction_id);

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read results (needed for experiment logic)
CREATE POLICY "Allow public read access"
ON public.results
FOR SELECT
USING (true);

-- Policy: Only service role can modify (prevent users from tampering with game rules)
CREATE POLICY "Allow service role full access"
ON public.results
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Sample Data (from DATABASE.md)
INSERT INTO public.results (conc_a, conc_b, conc_c, conc_d, reaction_id, result_name, result_formula, color, characteristics) 
VALUES
(50, 50, 0, 0, 11, 'Sodium Chloride', 'NaCl', '#ffffff', ARRAY['White crystals', 'Soluble in water']),
(60, 40, 0, 0, 11, 'Water and Salt', 'H2O + NaCl', '#e0e0e0', ARRAY['Clear solution', 'Neutral pH']),
(30, 30, 40, 0, 111, 'Copper Hydroxide', 'Cu(OH)2', '#0070bc', ARRAY['Blue precipitate', 'Insoluble'])
ON CONFLICT DO NOTHING;
