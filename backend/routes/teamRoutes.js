const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.obtenirEquipe);
router.post('/', teamController.ajouterMembre);
router.delete('/:id', teamController.supprimerMembre);

module.exports = router;