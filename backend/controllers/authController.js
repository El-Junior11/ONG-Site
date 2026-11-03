const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');

const authController = {
    async connexion(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    erreur: 'Email et mot de passe obligatoires.'
                });
            }

            const admin = await AdminModel.trouverParEmail(email);

            if (!admin || admin.password !== password) {
                return res.status(401).json({
                    erreur: 'Email ou mot de passe incorrect.'
                });
            }

            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    erreur: 'Configuration JWT manquante.'
                });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    email: admin.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                message: 'Connexion réussie !',
                token,
                user: {
                    id: admin.id,
                    email: admin.email
                }
            });

        } catch (erreur) {
            console.error(erreur);
            return res.status(500).json({
                erreur: 'Erreur interne du serveur.'
            });
        }
    }
};

module.exports = authController;
