ALTER TABLE portfolio
  ADD COLUMN IF NOT EXISTS related_service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS challenge TEXT,
  ADD COLUMN IF NOT EXISTS solution TEXT,
  ADD COLUMN IF NOT EXISTS result TEXT,
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Carry over old single-image data into the new cover_image field
UPDATE portfolio
SET cover_image = images->>0
WHERE cover_image IS NULL AND jsonb_array_length(images) > 0;

ALTER TABLE portfolio
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS images;