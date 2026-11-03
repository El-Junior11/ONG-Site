const jwt = require('jsonwebtoken');

// Vérifie le jeton envoyé par le frontend : Authorization: Bearer <jeton>
module.exports = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET est absent du fichier .env');
    return res.status(500).json({ erreur: 'Configuration du serveur incomplète.' });
  }

  const entete = req.headers.authorization || '';
  const jeton = entete.startsWith('Bearer ') ? entete.slice(7) : null;

  if (!jeton) {
    return res.status(401).json({ erreur: 'Authentification requise.' });
  }

  try {
    const donnees = jwt.verify(jeton, process.env.JWT_SECRET);

    // Accepte { id }, { adminId } ou { userId } selon ce que votre connexion met dans le jeton
    const id = donnees.id ?? donnees.adminId ?? donnees.userId;

    if (!id) {
      return res.status(401).json({ erreur: 'Jeton invalide.' });
    }

    req.user = { ...donnees, id };
    next();
  } catch (erreur) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }
};