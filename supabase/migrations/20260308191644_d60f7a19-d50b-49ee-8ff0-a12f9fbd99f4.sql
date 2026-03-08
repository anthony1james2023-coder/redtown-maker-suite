-- Add user_id column to projects (nullable for existing data)
ALTER TABLE public.projects ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can create projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;

-- New RLS: everyone can view all projects
CREATE POLICY "Projects are viewable by everyone"
ON public.projects FOR SELECT
USING (true);

-- Logged-in users can insert their own projects
CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Also allow anon inserts for backward compat (no user_id)
CREATE POLICY "Anon can create projects without user_id"
ON public.projects FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);