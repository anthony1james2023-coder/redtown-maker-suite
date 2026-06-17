-- 1. Admin role system (roles stored in a dedicated table, never on profiles)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Security definer function to check roles without recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Lock down subscriptions: users can no longer self-assign or self-upgrade plans.
DROP POLICY IF EXISTS "Users can create own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

CREATE POLICY "Admins can insert subscriptions"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Coupons: secret coupons must not be readable by ordinary authenticated users.
DROP POLICY IF EXISTS "Authenticated can view all coupons" ON public.coupons;

CREATE POLICY "Admins can view all coupons"
  ON public.coupons FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Published domains: stop leaking every user's domain + user_id publicly.
DROP POLICY IF EXISTS "Anyone can check domain availability" ON public.published_domains;

CREATE POLICY "Users can view their own domains"
  ON public.published_domains FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Availability check exposed via a function that only returns a boolean (no user data).
CREATE OR REPLACE FUNCTION public.is_domain_available(_domain text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.published_domains WHERE domain = _domain
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_domain_available(text) TO anon, authenticated;