
-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'core',
  duration_description TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 1000,
  current_uses INTEGER NOT NULL DEFAULT 0,
  one_time_per_user BOOLEAN NOT NULL DEFAULT true,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active non-secret coupons"
ON public.coupons FOR SELECT
USING (active = true AND is_secret = false);

CREATE POLICY "Authenticated can view all coupons"
ON public.coupons FOR SELECT
TO authenticated
USING (true);

-- Create coupon_redemptions table
CREATE TABLE public.coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
ON public.coupon_redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
ON public.coupon_redemptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to redeem a coupon
CREATE OR REPLACE FUNCTION public.redeem_coupon(p_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_user_id UUID;
  v_already_used BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'You must be signed in');
  END IF;

  SELECT * INTO v_coupon FROM coupons WHERE code = p_code AND active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired coupon code');
  END IF;

  IF v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has reached its maximum uses');
  END IF;

  IF v_coupon.one_time_per_user THEN
    SELECT EXISTS(
      SELECT 1 FROM coupon_redemptions WHERE coupon_id = v_coupon.id AND user_id = v_user_id
    ) INTO v_already_used;
    IF v_already_used THEN
      RETURN json_build_object('success', false, 'error', 'You have already used this coupon');
    END IF;
  END IF;

  INSERT INTO coupon_redemptions (coupon_id, user_id) VALUES (v_coupon.id, v_user_id);
  UPDATE coupons SET current_uses = current_uses + 1 WHERE id = v_coupon.id;

  -- Activate the subscription
  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (v_user_id, v_coupon.plan::subscription_plan, 'active')
  ON CONFLICT DO NOTHING;

  -- If user already has a subscription, update it
  UPDATE subscriptions SET plan = v_coupon.plan::subscription_plan, status = 'active', updated_at = now()
  WHERE user_id = v_user_id;

  RETURN json_build_object('success', true, 'plan', v_coupon.plan, 'duration', v_coupon.duration_description);
END;
$$;
