const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/', auth, adminController.obtenirAdmin);
router.put('/', auth, adminController.modifierAdmin);

module.exports = router;