-- Revoke public/anon EXECUTE on all SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.redeem_coupon(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.increment_upvote(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_domain_available(text) FROM anon, public;

-- Trigger-only functions never need direct execution by any client
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;

-- Functions the app legitimately calls remain available to signed-in users
GRANT EXECUTE ON FUNCTION public.redeem_coupon(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_upvote(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_domain_available(text) TO authenticated;

-- Storage: stop anonymous listing of the avatars bucket
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Users can list their own avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);