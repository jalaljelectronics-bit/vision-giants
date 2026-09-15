-- Expand job_applications with full application form fields

ALTER TABLE job_applications
  ALTER COLUMN job_id DROP NOT NULL,
  ALTER COLUMN name DROP NOT NULL;

ALTER TABLE job_applications
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
  ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS education VARCHAR(255),
  ADD COLUMN IF NOT EXISTS experience VARCHAR(255),
  ADD COLUMN IF NOT EXISTS remote_job VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications (status);

