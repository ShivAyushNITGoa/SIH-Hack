-- Add is_public column to reports table
-- This column determines if a report should be visible to citizens

ALTER TABLE public.reports 
ADD COLUMN is_public boolean DEFAULT true;

-- Update existing reports to be public by default
UPDATE public.reports 
SET is_public = true 
WHERE is_public IS NULL;

-- Add comment to explain the column
COMMENT ON COLUMN public.reports.is_public IS 'Determines if the report is visible to citizens in the public interface';
