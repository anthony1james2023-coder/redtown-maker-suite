
CREATE POLICY "Users can delete own visits"
  ON public.daily_visits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own visits"
  ON public.daily_visits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
