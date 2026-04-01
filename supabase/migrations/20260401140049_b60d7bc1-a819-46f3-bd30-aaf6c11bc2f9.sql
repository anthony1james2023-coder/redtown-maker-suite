
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can report" ON public.ai_mistakes;
DROP POLICY IF EXISTS "Anyone can update upvotes" ON public.ai_mistakes;

-- Authenticated users can report mistakes
CREATE POLICY "Authenticated users can report"
ON public.ai_mistakes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Create a secure function to increment upvotes by 1
CREATE OR REPLACE FUNCTION public.increment_upvote(mistake_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.ai_mistakes
  SET upvotes = upvotes + 1
  WHERE id = mistake_id;
END;
$$;
