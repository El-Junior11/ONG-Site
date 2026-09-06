const pool = require('../config/db');

const InterventionModel = {
    async recupererTous() {
        const requete = 'SELECT * FROM interventions ORDER BY created_at DESC';
        const { rows } = await pool.query(requete);
        return rows;
    },

    async creer(title, description, date, location, imageUrl, isPublished = false) {
        const requete = `
            INSERT INTO interventions (title, description, date, location, image_url, is_published) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        const { rows } = await pool.query(requete, [title, description, date, location, imageUrl, isPublished]);
        return rows[0];
    },

    async modifier(id, title, description, date, location, imageUrl, isPublished) {
        const requete = `
            UPDATE interventions 
            SET title = $1, description = $2, date = $3, location = $4, image_url = $5, is_published = $6 
            WHERE id = $7 
            RETURNING *
        `;
        const { rows } = await pool.query(requete, [title, description, date, location, imageUrl, isPublished, id]);
        return rows[0];
    },

    async togglePublish(id, isPublished) {
        const requete = 'UPDATE interventions SET is_published = $1 WHERE id = $2 RETURNING *';
        const { rows } = await pool.query(requete, [isPublished, id]);
        return rows[0];
    },

    async supprimer(id) {
        const requete = 'DELETE FROM interventions WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(requete, [id]);
        return rows[0];
    }
};

module.exports = InterventionModel;