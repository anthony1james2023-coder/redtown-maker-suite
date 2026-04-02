-- Fix ai_mistakes INSERT policy to prevent reporter identity spoofing
DROP POLICY IF EXISTS "Authenticated users can report" ON public.ai_mistakes;
CREATE POLICY "Authenticated users can report"
ON public.ai_mistakes
FOR INSERT
TO authenticated
WITH CHECK (
  reported_by IS NULL OR reported_by = auth.uid()
);

-- Add DELETE policy for avatars storage bucket
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
