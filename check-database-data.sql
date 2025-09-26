-- Check if there's data in the reports table
-- Run this in your Supabase SQL Editor

-- Check total count of reports
SELECT COUNT(*) as total_reports FROM public.reports;

-- Check reports by status
SELECT status, COUNT(*) as count 
FROM public.reports 
GROUP BY status;

-- Check if there are any public reports
SELECT COUNT(*) as public_reports 
FROM public.reports 
WHERE is_public = true;

-- Check recent reports
SELECT id, title, status, is_public, created_at 
FROM public.reports 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are any profiles
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Check sample profile data
SELECT id, name, role, email 
FROM public.profiles 
LIMIT 3;
