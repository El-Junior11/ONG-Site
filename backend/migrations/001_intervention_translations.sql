BEGIN;

ALTER TABLE interventions
ADD COLUMN IF NOT EXISTS source_language VARCHAR(2)
CHECK (source_language IN ('mg', 'fr', 'en', 'it'));

CREATE TABLE IF NOT EXISTS intervention_translations (
  id SERIAL PRIMARY KEY,
  intervention_id INTEGER NOT NULL,
  language VARCHAR(2) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_intervention_translation
    FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE CASCADE,
  CONSTRAINT chk_translation_language
    CHECK (language IN ('mg', 'fr', 'en', 'it')),
  CONSTRAINT uq_intervention_language
    UNIQUE (intervention_id, language)
);

CREATE INDEX IF NOT EXISTS idx_translation_language
ON intervention_translations(language);

COMMIT;

