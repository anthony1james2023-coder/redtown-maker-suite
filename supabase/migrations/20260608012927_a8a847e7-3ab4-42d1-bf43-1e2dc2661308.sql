ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS files jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'html';