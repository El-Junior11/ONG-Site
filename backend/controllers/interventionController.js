const InterventionModel = require('../models/interventionModel');

const interventionController = {
    async obtenirInterventions(req, res) {
        try {
            const interventions = await InterventionModel.recupererTous();
            res.json(interventions);
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Impossible de récupérer les interventions.' });
        }
    },

    async ajouterIntervention(req, res) {
        try {
            const { title, description, date, location, image_url, is_published } = req.body;
            if (!title || !description) return res.status(400).json({ erreur: 'Champs obligatoires manquants.' });

            const nouveau = await InterventionModel.creer(title, description, date, location, image_url, is_published);
            res.status(201).json({ message: 'Ajout réussi !', intervention: nouveau });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Erreur lors de l\'ajout.' });
        }
    },

    async modifierIntervention(req, res) {
        try {
            const { id } = req.params;
            const { title, description, date, location, image_url, is_published } = req.body;
            
            const modifie = await InterventionModel.modifier(id, title, description, date, location, image_url, is_published);
            if (!modifie) return res.status(404).json({ erreur: 'Intervention non trouvée.' });

            res.json({ message: 'Modification réussie !', intervention: modifie });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Erreur lors de la modification.' });
        }
    },

    async supprimerIntervention(req, res) {
        try {
            const { id } = req.params;
            const supprime = await InterventionModel.supprimer(id);
            if (!supprime) return res.status(404).json({ erreur: 'Intervention non trouvée.' });

            res.json({ message: 'Suppression réussie !' });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Erreur lors de la suppression.' });
        }
    }, // <--- Nampiana koma eto

    async togglePublish(req, res) {
        try {
            const { id } = req.params;
            const { is_published } = req.body;

            const modifie = await InterventionModel.togglePublish(id, is_published);

            if (!modifie) {
                return res.status(404).json({ erreur: 'Intervention non trouvée.' });
            }

            res.json({ message: 'Statut de publication mis à jour !', intervention: modifie });
        } catch (erreur) {
            console.error(erreur);
            res.status(500).json({ erreur: 'Erreur lors de la mise à jour du statut.' });
        }
    }
};

module.exports = interventionController;