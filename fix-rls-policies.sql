-- Fix for infinite recursion in RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any report" ON public.reports;
DROP POLICY IF EXISTS "Admins can update any comment" ON public.report_comments;

-- Create a more efficient admin check function that doesn't cause recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Use auth.jwt() to get user metadata instead of querying profiles table
  RETURN COALESCE(
    (auth.jwt() ->> 'user_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative: Create a function that checks admin status without recursion
CREATE OR REPLACE FUNCTION check_admin_status()
RETURNS BOOLEAN AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from user metadata or default to 'citizen'
  SELECT COALESCE(
    (auth.jwt() ->> 'user_metadata' ->> 'role'),
    'citizen'
  ) INTO user_role;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies without recursion
-- Profiles policies
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (check_admin_status());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (check_admin_status());

-- Reports policies  
CREATE POLICY "Admins can update any report" ON public.reports
  FOR UPDATE USING (check_admin_status());

-- Report comments policies
CREATE POLICY "Admins can update any comment" ON public.report_comments
  FOR UPDATE USING (check_admin_status());

-- Add missing policies for better security
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (check_admin_status());

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (check_admin_status());

CREATE POLICY "Admins can insert reports" ON public.reports
  FOR INSERT WITH CHECK (check_admin_status());

CREATE POLICY "Admins can delete reports" ON public.reports
  FOR DELETE USING (check_admin_status());

CREATE POLICY "Admins can insert comments" ON public.report_comments
  FOR INSERT WITH CHECK (check_admin_status());

CREATE POLICY "Admins can delete comments" ON public.report_comments
  FOR DELETE USING (check_admin_status());
