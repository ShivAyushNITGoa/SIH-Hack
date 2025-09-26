-- Check current schema of reports table
-- Run this first to see what columns exist

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reports' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if is_public column exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'reports' 
            AND column_name = 'is_public'
            AND table_schema = 'public'
        ) 
        THEN 'is_public column EXISTS' 
        ELSE 'is_public column MISSING' 
    END as column_status;

-- Check current RLS policies on reports table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'reports' 
AND schemaname = 'public';
