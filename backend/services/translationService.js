const LANGUAGES = ['mg', 'fr', 'en', 'it'];
const API_URL = 'https://api.mymemory.translated.net/get';
const MAX_BYTES = 450;

// Découpage du texte selon la limite de l'API
function splitText(text) {
  const chunks = [];
  let current = '';

  for (const word of text.match(/\S+\s*|\s+/gu) || []) {
    if (Buffer.byteLength(current + word, 'utf8') <= MAX_BYTES) {
      current += word;
      continue;
    }
    if (current) chunks.push(current);
    current = '';

    for (const char of word) {
      if (Buffer.byteLength(current + char, 'utf8') > MAX_BYTES) {
        chunks.push(current);
        current = '';
      }
      current += char;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

// Traduction d'un segment
async function translateChunk(text, source, target) {
  if (!text.trim()) return text;

  const params = new URLSearchParams({
    q: text.trim(),
    langpair: `${source}|${target}`
  });

  if (process.env.MYMEMORY_EMAIL) {
    params.set('de', process.env.MYMEMORY_EMAIL);
  }

  const response = await fetch(`${API_URL}?${params}`, {
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP traduction : ${response.status}`);
  }

  const data = await response.json();

  if (data.quotaFinished) {
    throw new Error('Quota journalier de traduction épuisé.');
  }

  if (Number(data.responseStatus) !== 200) {
    throw new Error(data.responseDetails || 'Erreur de traduction.');
  }

  const translated = data.responseData?.translatedText;

  if (typeof translated !== 'string' || !translated.trim()) {
    throw new Error('Traduction vide ou invalide.');
  }

  const leading = text.match(/^\s*/u)?.[0] || '';
  const trailing = text.match(/\s*$/u)?.[0] || '';

  return leading + translated.trim() + trailing;
}

// Traduction d'un texte complet
async function translateText(text, source, target) {
  if (!LANGUAGES.includes(source) || !LANGUAGES.includes(target)) {
    throw new Error('Langue non supportée.');
  }

  if (typeof text !== 'string') {
    throw new Error('Texte invalide.');
  }

  if (!text.trim() || source === target) return text;

  const paragraphs = text.split(/(\r?\n)/);
  const results = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      results.push(paragraph);
      continue;
    }

    const chunks = splitText(paragraph);
    const translated = [];

    for (const chunk of chunks) {
      translated.push(await translateChunk(chunk, source, target));
    }

    results.push(translated.join(''));
  }

  return results.join('');
}

// Traduction d'une intervention dans les quatre langues
async function translateIntervention(title, description, source) {
  if (!LANGUAGES.includes(source)) {
    throw new Error('Langue originale invalide.');
  }

  if (typeof title !== 'string' || typeof description !== 'string' ||
      !title.trim() || !description.trim()) {
    throw new Error('Titre et description obligatoires.');
  }

  const translations = {};

  for (const language of LANGUAGES) {
    if (language === source) {
      translations[language] = { title, description };
      continue;
    }

    translations[language] = {
      title: await translateText(title, source, language),
      description: await translateText(description, source, language)
    };
  }

  return translations;
}

module.exports = {
  LANGUAGES,
  translateText,
  translateIntervention
};
