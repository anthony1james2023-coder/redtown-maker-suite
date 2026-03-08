
CREATE TABLE public.daily_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  visited_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, visited_date)
);

ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visits"
  ON public.daily_visits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visits"
  ON public.daily_visits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
