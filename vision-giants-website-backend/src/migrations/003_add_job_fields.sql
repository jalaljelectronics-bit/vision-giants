ALTER TABLE job_postings
  ADD COLUMN IF NOT EXISTS experience_level VARCHAR(100),
  ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::jsonb;

ALTER TABLE job_postings
  ALTER COLUMN requirements DROP DEFAULT,
  ALTER COLUMN requirements TYPE JSONB USING
    CASE
      WHEN requirements IS NULL OR requirements = '' THEN '[]'::jsonb
      ELSE to_jsonb(string_to_array(requirements, E'\n'))
    END,
  ALTER COLUMN requirements SET DEFAULT '[]'::jsonb;