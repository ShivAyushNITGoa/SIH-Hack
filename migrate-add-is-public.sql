-- Migration: Add is_public column to existing reports table
-- This script safely adds the missing column without recreating existing tables

-- Check if is_public column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'reports' 
        AND column_name = 'is_public'
        AND table_schema = 'public'
    ) THEN
        -- Add the is_public column
        ALTER TABLE public.reports 
        ADD COLUMN is_public boolean DEFAULT true;
        
        -- Update existing reports to be public by default
        UPDATE public.reports 
        SET is_public = true 
        WHERE is_public IS NULL;
        
        -- Add comment to explain the column
        COMMENT ON COLUMN public.reports.is_public IS 'Determines if the report is visible to citizens in the public interface';
        
        RAISE NOTICE 'Successfully added is_public column to reports table';
    ELSE
        RAISE NOTICE 'is_public column already exists in reports table';
    END IF;
END $$;

-- Update the RLS policy to use is_public column
-- First drop the old policy if it exists
DROP POLICY IF EXISTS "Anyone can read reports" ON public.reports;
DROP POLICY IF EXISTS "Anyone can read public reports" ON public.reports;

-- Create the new policy
CREATE POLICY "Anyone can read public reports" ON public.reports
  FOR SELECT USING (is_public = true);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reports' 
AND table_schema = 'public' 
AND column_name = 'is_public';
