const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/interventionController');

router.get('/', interventionController.obtenirInterventions);
router.post('/', interventionController.ajouterIntervention);
router.put('/:id', interventionController.modifierIntervention);
router.delete('/:id', interventionController.supprimerIntervention);

module.exports = router;