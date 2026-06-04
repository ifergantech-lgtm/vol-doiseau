-- Migration 003 — Remove 'cocktail' category
-- Run this in the Supabase SQL editor

-- Step 1: Move any existing cocktail dresses to 'evening'
UPDATE dresses SET category = 'evening' WHERE category = 'cocktail';

-- Step 2: Drop the old check constraint and replace with the new one
ALTER TABLE dresses DROP CONSTRAINT IF EXISTS dresses_category_check;
ALTER TABLE dresses ADD CONSTRAINT dresses_category_check
  CHECK (category IN ('evening', 'wedding'));
