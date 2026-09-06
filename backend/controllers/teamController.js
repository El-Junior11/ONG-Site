const TeamModel = require('../models/teamModel');

const teamController = {
    async obtenirEquipe(req, res) {
        try {
            const equipe = await TeamModel.recupererTous();
            res.json(equipe);
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Impossible de récupérer la liste de l\'équipe.' });
        }
    },

    async ajouterMembre(req, res) {
        try {
            const { name, role, img } = req.body;
            if (!name || !role) {
                return res.status(400).json({ erreur: 'Le nom et le rôle sont obligatoires.' });
            }

            const nouveauMembre = await TeamModel.creer(name, role, img || '');
            res.status(201).json({ message: 'Membre enregistré avec succès !', member: nouveauMembre });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Impossible d\'ajouter le membre.' });
        }
    },

    async modifierMembre(req, res) {
        try {
            const { id } = req.params;
            const { name, role, img } = req.body;

            if (!name || !role) {
                return res.status(400).json({ erreur: 'Le nom et le rôle sont obligatoires.' });
            }

            // Antsoina ilay Model handray ny fanovana (jereo raha TeamModel.modifier na TeamModel.mettreAJour no ampiasainao any amin'ny Model)
            const membreModifie = await TeamModel.modifier(id, name, role, img);

            if (!membreModifie) {
                return res.status(404).json({ erreur: 'Membre introuvable.' });
            }

            res.json({ message: 'Membre modifié avec succès !', member: membreModifie });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Impossible de modifier le membre.' });
        }
    },

    async supprimerMembre(req, res) {
        try {
            const { id } = req.params;
            const supprime = await TeamModel.supprimer(id);
            
            if (!supprime) {
                return res.status(404).json({ erreur: 'Membre introuvable.' });
            }

            res.json({ message: 'Membre supprimé avec succès !' });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Impossible de supprimer le membre.' });
        }
    }
};

module.exports = teamController;