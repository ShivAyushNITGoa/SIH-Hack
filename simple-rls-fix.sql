-- Simple fix: Remove problematic policies and use a simpler approach
-- This approach avoids recursion by not querying profiles table in policies

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any report" ON public.reports;
DROP POLICY IF EXISTS "Admins can update any comment" ON public.report_comments;

-- Create simpler policies that don't cause recursion
-- For profiles table - allow users to manage their own profiles
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- For reports table - allow authenticated users to read all reports
CREATE POLICY "Authenticated users can read reports" ON public.reports
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own reports
CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert reports
CREATE POLICY "Users can insert reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For comments - allow authenticated users to read all comments
CREATE POLICY "Authenticated users can read comments" ON public.report_comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to manage their own comments
CREATE POLICY "Users can manage own comments" ON public.report_comments
  FOR ALL USING (auth.uid() = user_id);

-- Allow users to insert comments
CREATE POLICY "Users can insert comments" ON public.report_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For departments - allow all authenticated users to read
CREATE POLICY "Authenticated users can read departments" ON public.departments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Note: Admin-specific policies can be added later using application-level checks
-- or by using Supabase's built-in admin functions if available
