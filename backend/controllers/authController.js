const AdminModel = require('../models/adminModel');

const authController = {
    async connexion(req, res) {
        try {
            const { email, password } = req.body;
            
            const admin = await AdminModel.trouverParEmail(email);
            if (!admin) {
                return res.status(401).json({ erreur: 'Email ou mot de passe incorrect.' });
            }

            // Remarque : Utilisez bcrypt pour un hachage sécurisé en production
            if (admin.password !== password) {
                return res.status(401).json({ erreur: 'Email ou mot de passe incorrect.' });
            }

            res.json({ message: 'Connexion réussie !', admin: { email: admin.email } });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Erreur interne du serveur.' });
        }
    }
};

module.exports = authController;