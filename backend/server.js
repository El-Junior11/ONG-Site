const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const interventionRoutes = require('./routes/interventionsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- ROUTES DE L'API ---
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/interventions', interventionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API de l\'ONG Tsinjo Aina Fianarantsoa opérationnelle !' });
});

// --- LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le lien : http://localhost:${PORT}`);
});