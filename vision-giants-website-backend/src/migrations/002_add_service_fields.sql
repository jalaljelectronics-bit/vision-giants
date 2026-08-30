ALTER TABLE services
  ADD COLUMN IF NOT EXISTS sub_services JSONB DEFAULT '[]'::jsonb;