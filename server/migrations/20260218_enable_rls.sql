-- Enable RLS on the results table
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the results table
-- This is necessary because the application uses the anon key to query results
CREATE POLICY "Enable read access for all users" ON "public"."results"
FOR SELECT USING (true);
