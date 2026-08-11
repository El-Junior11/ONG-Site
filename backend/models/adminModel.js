const pool = require('../config/db');

const AdminModel = {
    async trouverParEmail(email) {
        const requete = 'SELECT * FROM admins WHERE email = $1';
        const { rows } = await pool.query(requete, [email]);
        return rows[0];
    },

    async creer(email, motDePasseHache) {
        const requete = 'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *';
        const { rows } = await pool.query(requete, [email, motDePasseHache]);
        return rows[0];
    }
};

module.exports = AdminModel;