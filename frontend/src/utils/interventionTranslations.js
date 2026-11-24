export const LANGUAGES = [
  { code: 'mg', label: 'Malagasy', flag: '🇲🇬' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' }
];

const labels = {
  fr: {
    automaticSave: 'Les traductions manquantes seront générées automatiquement lors de l’enregistrement.',
    source: 'Langue originale', select: 'Choisir une langue',
    translate: 'Traduire automatiquement', translating: 'Traduction en cours...',
    title: 'Titre', description: 'Description', completed: 'langues complétées',
    review: 'Vérifiez et corrigez les traductions avant publication.',
    required: 'Les quatre langues sont obligatoires avant publication.',
    error: 'Traduction indisponible. Vous pouvez compléter les textes manuellement.',
    success: 'Traductions générées avec succès.'
  },
  mg: {
    automaticSave: 'Hadika ho azy ireo teny mbola tsy feno rehefa mitahiry.',
    source: 'Teny niaviana', select: 'Misafidiana teny',
    translate: 'Handika ho azy', translating: 'Eo am-pandikana...',
    title: 'Lohateny', description: 'Fanazavana', completed: 'teny feno',
    review: 'Hamarino sy ahitsio ny fandikana alohan’ny famoahana.',
    required: 'Tsy maintsy feno ireo teny efatra alohan’ny famoahana.',
    error: 'Tsy afaka nandika. Afaka mameno amin’ny tanana ianao.',
    success: 'Vita soa aman-tsara ny fandikana.'
  },
  en: {
    automaticSave: 'Missing translations will be generated automatically when saving.',
    source: 'Original language', select: 'Select a language',
    translate: 'Translate automatically', translating: 'Translating...',
    title: 'Title', description: 'Description', completed: 'languages completed',
    review: 'Review and correct translations before publishing.',
    required: 'All four languages are required before publication.',
    error: 'Translation unavailable. You can complete the texts manually.',
    success: 'Translations generated successfully.'
  },
  it: {
    automaticSave: 'Le traduzioni mancanti saranno generate automaticamente al salvataggio.',
    source: 'Lingua originale', select: 'Seleziona una lingua',
    translate: 'Traduci automaticamente', translating: 'Traduzione in corso...',
    title: 'Titolo', description: 'Descrizione', completed: 'lingue completate',
    review: 'Verifica e correggi le traduzioni prima della pubblicazione.',
    required: 'Tutte e quattro le lingue sono obbligatorie prima della pubblicazione.',
    error: 'Traduzione non disponibile. Puoi completare i testi manualmente.',
    success: 'Traduzioni generate con successo.'
  }
};

export const translationLabels = lang => labels[lang] || labels.fr;

export const getTranslations = form => ({
  ...form.translations,
  ...(form.source_language ? {
    [form.source_language]: { title: form.title, description: form.description }
  } : {})
});

export const completeTranslations = form => {
  const items = getTranslations(form);
  return LANGUAGES.every(({ code }) =>
    items[code]?.title?.trim() && items[code]?.description?.trim()
  );
};
