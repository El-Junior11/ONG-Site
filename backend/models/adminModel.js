const pool = require('../config/db');

const AdminModel = {
  // --- Existant (connexion / inscription) ---
  async trouverParEmail(email) {
    const requete = 'SELECT * FROM admins WHERE email = $1';
    const { rows } = await pool.query(requete, [email]);
    return rows[0];
  },

  async creer(email, motDePasseHache) {
    const requete = 'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(requete, [email, motDePasseHache]);
    return rows[0];
  },

  // --- Nouveau (page Paramètres) ---
  async trouverParId(id) {
    const { rows } = await pool.query('SELECT id, email FROM admins WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async emailExiste(email, idExclu) {
    const { rows } = await pool.query(
      'SELECT id FROM admins WHERE email = $1 AND id <> $2',
      [email, idExclu]
    );
    return rows.length > 0;
  },

  async modifier(id, email, motDePasseHache) {
    const requete = motDePasseHache
      ? 'UPDATE admins SET email = $1, password = $2 WHERE id = $3 RETURNING id, email'
      : 'UPDATE admins SET email = $1 WHERE id = $2 RETURNING id, email';

    const params = motDePasseHache ? [email, motDePasseHache, id] : [email, id];
    const { rows } = await pool.query(requete, params);
    return rows[0];
  }
};

module.exports = AdminModel;