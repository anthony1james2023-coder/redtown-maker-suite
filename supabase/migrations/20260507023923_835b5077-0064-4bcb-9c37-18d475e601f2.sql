CREATE TABLE public.published_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_published_domains_domain ON public.published_domains(lower(domain));

ALTER TABLE public.published_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check domain availability"
ON public.published_domains FOR SELECT
USING (true);

CREATE POLICY "Users can claim a domain for themselves"
ON public.published_domains FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can release their own domain"
ON public.published_domains FOR DELETE
TO authenticated
USING (auth.uid() = user_id);