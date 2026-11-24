const InterventionModel = require('../models/interventionModel');
const { LANGUAGES, translateText, translateIntervention } = require('../services/translationService');

function validText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validContent(title, description) {
  return validText(title) && title.length <= 255 && validText(description);
}

function completeTranslations(translations) {
  return LANGUAGES.every(lang =>
    validText(translations?.[lang]?.title) &&
    validText(translations?.[lang]?.description)
  );
}

function prepareTranslations(title, description, source, translations = {}) {
  const result = {};

  for (const lang of LANGUAGES) {
    const item = translations?.[lang];
    if (validText(item?.title) && validText(item?.description)) {
      result[lang] = { title: item.title, description: item.description };
    }
  }

  result[source] = { title, description };
  return result;
}


async function ensureTranslations(title, description, source, translations = {}) {
  const prepared = prepareTranslations(title, description, source, translations);

  try {
    for (const lang of LANGUAGES) {
      if (lang === source || prepared[lang]) continue;

      const existing = translations?.[lang] || {};
      prepared[lang] = {
        title: validText(existing.title)
          ? existing.title : await translateText(title, source, lang),
        description: validText(existing.description)
          ? existing.description : await translateText(description, source, lang)
      };
    }

    return prepared;
  } catch (error) {
    console.error('Erreur traduction automatique:', error.message);
    const failure = new Error('Traduction automatique indisponible. Réessayez ultérieurement.');
    failure.code = 'TRANSLATION_UNAVAILABLE';
    throw failure;
  }
}

const interventionController = {
 async obtenirInterventions(req, res) {
  try {
    const interventions = await InterventionModel.recupererTous();
    res.json(interventions.filter(item => item.is_published === true));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Impossible de récupérer les interventions.' });
  }
},

async obtenirInterventionsAdmin(req, res) {
  try {
    const interventions = await InterventionModel.recupererTous();
    res.json(interventions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: 'Impossible de récupérer les interventions.' });
  }
},

  async traduireIntervention(req, res) {
    try {
      const { title, description, source_language } = req.body;

      if (!validContent(title, description)) {
        return res.status(400).json({ erreur: 'Titre ou description invalide.' });
      }

      if (!LANGUAGES.includes(source_language)) {
        return res.status(400).json({ erreur: 'Langue originale invalide.' });
      }

      const translations = await translateIntervention(title, description, source_language);
      res.json({ source_language, translations });
    } catch (error) {
      console.error(error.message);
      res.status(503).json({
        erreur: 'Service de traduction indisponible. Réessayez ultérieurement.'
      });
    }
  },

  async ajouterIntervention(req, res) {
    try {
      const {
        title, description, date, location, image_url,
        source_language, translations, is_published = false
      } = req.body;

      if (!validContent(title, description)) {
        return res.status(400).json({ erreur: 'Titre ou description invalide.' });
      }

      if (!LANGUAGES.includes(source_language)) {
        return res.status(400).json({ erreur: 'Langue originale obligatoire.' });
      }

      if (typeof is_published !== 'boolean') {
        return res.status(400).json({ erreur: 'Statut de publication invalide.' });
      }

      const prepared = await ensureTranslations(title, description, source_language, translations);

      if (is_published && !completeTranslations(prepared)) {
        return res.status(400).json({ erreur: 'Les quatre traductions sont obligatoires avant publication.' });
      }

      const nouveau = await InterventionModel.creer(
        title, description, date, location, image_url,
        is_published, source_language, prepared
      );

      res.status(201).json({ message: 'Ajout réussi !', intervention: nouveau });
    } catch (error) {
      console.error(error);
      if (error.code === 'TRANSLATION_UNAVAILABLE') {
        return res.status(503).json({ erreur: error.message });
      }
      res.status(500).json({ erreur: "Erreur lors de l'ajout." });
    }
  },

  async modifierIntervention(req, res) {
    try {
      const { id } = req.params;
      const current = await InterventionModel.recupererParId(id);

      if (!current) {
        return res.status(404).json({ erreur: 'Intervention non trouvée.' });
      }

      const {
        title = current.title,
        description = current.description,
        date, location, image_url,
        source_language = current.source_language,
        is_published = current.is_published,
        translations
      } = req.body;

      if (!validContent(title, description)) {
        return res.status(400).json({ erreur: 'Titre ou description invalide.' });
      }

      if (!LANGUAGES.includes(source_language)) {
        return res.status(400).json({ erreur: 'Langue originale obligatoire.' });
      }

      if (typeof is_published !== 'boolean') {
        return res.status(400).json({ erreur: 'Statut de publication invalide.' });
      }

      const changed = title !== current.title ||
        description !== current.description ||
        source_language !== current.source_language;

      const previous = changed ? {} : current.translations;
      const prepared = await ensureTranslations(
        title, description, source_language,
        { ...previous, ...translations }
      );

      if (is_published && !completeTranslations(prepared)) {
        return res.status(400).json({ erreur: 'Les quatre traductions sont obligatoires avant publication.' });
      }

      const modifie = await InterventionModel.modifier(
        id, title, description, date, location, image_url,
        is_published, source_language, prepared
      );

      if (!modifie) {
        return res.status(404).json({ erreur: 'Intervention non trouvée.' });
      }

      res.json({ message: 'Modification réussie !', intervention: modifie });
    } catch (error) {
      console.error(error);
      if (error.code === 'TRANSLATION_UNAVAILABLE') {
        return res.status(503).json({ erreur: error.message });
      }
      res.status(500).json({ erreur: 'Erreur lors de la modification.' });
    }
  },

  async supprimerIntervention(req, res) {
    try {
      const supprime = await InterventionModel.supprimer(req.params.id);

      if (!supprime) {
        return res.status(404).json({ erreur: 'Intervention non trouvée.' });
      }

      res.json({ message: 'Suppression réussie !' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erreur: 'Erreur lors de la suppression.' });
    }
  },

  async togglePublish(req, res) {
    try {
      const { id } = req.params;
      const { is_published } = req.body;

      if (typeof is_published !== 'boolean') {
        return res.status(400).json({ erreur: 'Statut de publication invalide.' });
      }

      const current = await InterventionModel.recupererParId(id);

      if (!current) {
        return res.status(404).json({ erreur: 'Intervention non trouvée.' });
      }

      if (is_published && (!LANGUAGES.includes(current.source_language) ||
          !completeTranslations(current.translations))) {
        return res.status(400).json({ erreur: 'Les quatre traductions sont obligatoires avant publication.' });
      }

      const modifie = await InterventionModel.togglePublish(id, is_published);

      if (!modifie) {
        return res.status(404).json({ erreur: 'Intervention non trouvée.' });
      }

      res.json({
        message: 'Statut de publication mis à jour !',
        intervention: modifie
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erreur: 'Erreur lors de la mise à jour du statut.' });
    }
  }
};

module.exports = interventionController;