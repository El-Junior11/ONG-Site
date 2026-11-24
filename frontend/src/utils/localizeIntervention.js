const LANGUAGES = ['mg', 'fr', 'en', 'it'];

export function normalizeLanguage(language) {
  const code = (language || 'fr').toLowerCase().split('-')[0];
  return LANGUAGES.includes(code) ? code : 'fr';
}

export function localizeIntervention(item, language) {
  const lang = normalizeLanguage(language);
  const translation = item.translations?.[lang];

  return {
    ...item,
    title: translation?.title?.trim() ? translation.title : item.title,
    description: translation?.description?.trim() ? translation.description : item.description
  };
}
