// Utilise la même bibliothèque que votre connexion (bcrypt ou bcryptjs)
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch {
  bcrypt = require('bcryptjs');
}

const AdminModel = require('../models/adminModel');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGUEUR_MIN_MOT_DE_PASSE = 6;

const adminController = {
  // GET /api/admin : administrateur connecté
  async obtenirAdmin(req, res) {
    try {
      const admin = await AdminModel.trouverParId(req.user.id);

      if (!admin) {
        return res.status(404).json({ erreur: 'Administrateur introuvable.' });
      }

      res.json(admin);
    } catch (erreur) {
      console.error(erreur);
      res.status(500).json({ erreur: 'Impossible de récupérer l\'administrateur.' });
    }
  },

  // PUT /api/admin : modifie l'email et, si fourni, le mot de passe
  async modifierAdmin(req, res) {
    try {
      const email = (req.body.email || '').trim();
      const { password } = req.body;

      if (!email) {
        return res.status(400).json({ erreur: 'L\'email est obligatoire.' });
      }

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ erreur: 'Le format de l\'email est invalide.' });
      }

      if (password && password.length < LONGUEUR_MIN_MOT_DE_PASSE) {
        return res.status(400).json({
          erreur: `Le mot de passe doit contenir au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`
        });
      }

      if (await AdminModel.emailExiste(email, req.user.id)) {
        return res.status(409).json({ erreur: 'Cet email est déjà utilisé.' });
      }

      const motDePasseHache = password ? await bcrypt.hash(password, 10) : null;
      const admin = await AdminModel.modifier(req.user.id, email, motDePasseHache);

      if (!admin) {
        return res.status(404).json({ erreur: 'Administrateur introuvable.' });
      }

      // Le frontend attend directement { id, email }
      res.json(admin);
    } catch (erreur) {
      console.error(erreur);
      res.status(500).json({ erreur: 'Impossible de modifier l\'administrateur.' });
    }
  }
};

module.exports = adminController;