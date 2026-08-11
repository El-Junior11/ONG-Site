const pool = require('../config/db');

const TeamModel = {
    async recupererTous() {
        const requete = 'SELECT * FROM team_members ORDER BY created_at DESC';
        const { rows } = await pool.query(requete);
        return rows;
    },

    async creer(nom, role, imageUrl) {
        const requete = 'INSERT INTO team_members (name, role, image_url) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await pool.query(requete, [nom, role, imageUrl]);
        return rows[0];
    },

    async supprimer(id) {
        const requete = 'DELETE FROM team_members WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(requete, [id]);
        return rows[0];
    }
};

module.exports = TeamModel;