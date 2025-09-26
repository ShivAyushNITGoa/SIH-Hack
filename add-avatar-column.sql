-- Add avatar_url column to profiles table
-- Run this in your Supabase SQL editor

-- Add avatar_url column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add phone and department columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department text;

-- Update the updated_at timestamp when avatar_url changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
