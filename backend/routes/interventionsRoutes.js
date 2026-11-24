const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/interventionController');
const auth = require('../middleware/auth');

// Consultation publique
router.get('/', interventionController.obtenirInterventions);

// Consultation administrative
router.get('/admin', auth, interventionController.obtenirInterventionsAdmin);

// Traduction automatique
router.post('/translate', auth, interventionController.traduireIntervention);

// Gestion administrative
router.post('/', auth, interventionController.ajouterIntervention);
router.put('/:id', auth, interventionController.modifierIntervention);
router.patch('/:id/publish', auth, interventionController.togglePublish);
router.delete('/:id', auth, interventionController.supprimerIntervention);

module.exports = router;