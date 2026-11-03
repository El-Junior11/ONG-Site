const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const interventionRoutes = require('./routes/interventionsRoutes');
const adminRoutes = require('./routes/adminRoutes');           

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);                             
app.use('/api/team', teamRoutes);
app.use('/api/interventions', interventionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de l\'ONG Tsinjo Aina Fianarantsoa opérationnelle !' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ erreur: `Route introuvable : ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le lien : http://localhost:${PORT}`);
});