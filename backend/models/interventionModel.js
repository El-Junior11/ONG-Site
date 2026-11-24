const pool = require('../config/db');

const LANGUAGES = ['mg', 'fr', 'en', 'it'];

const SELECT_INTERVENTIONS = `
  SELECT i.*, COALESCE(
    (SELECT jsonb_object_agg(t.language, jsonb_build_object(
      'title', t.title, 'description', t.description
    )) FROM intervention_translations t WHERE t.intervention_id = i.id),
    '{}'::jsonb
  ) AS translations
  FROM interventions i
`;

async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function enregistrerTraductions(client, id, translations) {
  for (const language of LANGUAGES) {
    const translation = translations[language];
    if (!translation) continue;

    await client.query(`
      INSERT INTO intervention_translations
        (intervention_id, language, title, description)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (intervention_id, language)
      DO UPDATE SET title = EXCLUDED.title,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    `, [id, language, translation.title, translation.description]);
  }
}

const InterventionModel = {
  async recupererTous() {
    const { rows } = await pool.query(`
      ${SELECT_INTERVENTIONS}
      ORDER BY i.created_at DESC
    `);
    return rows;
  },

  async recupererParId(id) {
    const { rows } = await pool.query(`
      ${SELECT_INTERVENTIONS}
      WHERE i.id = $1
    `, [id]);
    return rows[0];
  },

  async creer(title, description, date, location, imageUrl,
    isPublished = false, sourceLanguage = null, translations = {}) {

    return transaction(async client => {
      const { rows } = await client.query(`
        INSERT INTO interventions
          (title, description, date, location, image_url, is_published, source_language)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [title, description, date, location, imageUrl, isPublished, sourceLanguage]);

      const intervention = rows[0];
      await enregistrerTraductions(client, intervention.id, translations);

      const result = await client.query(`
        ${SELECT_INTERVENTIONS} WHERE i.id = $1
      `, [intervention.id]);

      return result.rows[0];
    });
  },

  async modifier(id, title, description, date, location, imageUrl,
    isPublished, sourceLanguage = undefined, translations = undefined) {

    return transaction(async client => {
      const current = await client.query(`
        SELECT * FROM interventions WHERE id = $1 FOR UPDATE
      `, [id]);

      if (!current.rows[0]) return undefined;

      const original = current.rows[0];
      const language = sourceLanguage === undefined
        ? original.source_language : sourceLanguage;

      const contentChanged = original.title !== title ||
        original.description !== description ||
        original.source_language !== language;

      const { rows } = await client.query(`
        UPDATE interventions SET
          title = $1, description = $2, date = $3,
          location = $4, image_url = $5, is_published = $6,
          source_language = $7
        WHERE id = $8 RETURNING *
      `, [title, description,
        date === undefined ? original.date : date,
        location === undefined ? original.location : location,
        imageUrl === undefined ? original.image_url : imageUrl,
        isPublished === undefined ? original.is_published : isPublished,
        language, id]);

      if (!rows[0]) return undefined;

      if (contentChanged) {
        await client.query(`
          DELETE FROM intervention_translations WHERE intervention_id = $1
        `, [id]);
      }

      if (translations !== undefined) {
        await enregistrerTraductions(client, id, translations);
      }

      const result = await client.query(`
        ${SELECT_INTERVENTIONS} WHERE i.id = $1
      `, [id]);

      return result.rows[0];
    });
  },

  async enregistrerTraductions(id, sourceLanguage, translations) {
    return transaction(async client => {
      const { rows } = await client.query(`
        UPDATE interventions SET source_language = $1
        WHERE id = $2 RETURNING *
      `, [sourceLanguage, id]);

      if (!rows[0]) return undefined;

      await enregistrerTraductions(client, id, translations);

      const result = await client.query(`
        ${SELECT_INTERVENTIONS} WHERE i.id = $1
      `, [id]);

      return result.rows[0];
    });
  },

  async togglePublish(id, isPublished) {
    const { rows } = await pool.query(`
      UPDATE interventions SET is_published = $1
      WHERE id = $2 RETURNING *
    `, [isPublished, id]);
    return rows[0];
  },

  async supprimer(id) {
    const { rows } = await pool.query(`
      DELETE FROM interventions WHERE id = $1 RETURNING *
    `, [id]);
    return rows[0];
  }
};

module.exports = InterventionModel;