const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.obtenirEquipe);
router.post('/', teamController.ajouterMembre);
router.put('/:id', teamController.modifierMembre);
router.delete('/:id', teamController.supprimerMembre);

module.exports = router;