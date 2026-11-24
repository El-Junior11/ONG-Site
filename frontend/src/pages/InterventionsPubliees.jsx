import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Layers, RefreshCcw, AlertCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import api from '../api/axios';
import { normalizeLanguage, localizeIntervention } from '../utils/localizeIntervention';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80";

const translations = {
  fr: {
    label: 'Nos Actions Humanitaires',
    title: 'Nos Interventions sur le Terrain',
    description: "Découvrez l'impact concret de nos actions, nos projets réalisés et notre engagement continu auprès des communautés locales.",
    completed: 'Réalisé', location: 'Localisation non spécifiée', recent: 'Récemment',
    error: 'Impossible de charger les interventions.', retry: 'Réessayer',
    empty: 'Aucune intervention publiée',
    emptyDesc: 'Revenez un peu plus tard pour découvrir nos nouveaux projets.'
  },
  mg: {
    label: 'Ny asa fanampiana ataonay',
    title: 'Ny asa ataonay eny ifotony',
    description: "Fantaro ny fiantraikan'ny asa ataonay, ireo tetikasa efa vita ary ny fanoloran-tenanay mitohy ho an'ny vondrom-piarahamonina eny ifotony.",
    completed: 'Vita', location: 'Toerana tsy voafaritra', recent: 'Vao haingana',
    error: 'Tsy afaka nampiditra ireo asa.', retry: 'Andramo indray',
    empty: 'Tsy misy asa navoaka',
    emptyDesc: 'Miverena afaka kelikely hahitanao ireo tetikasa vaovao.'
  },
  en: {
    label: 'Our Humanitarian Actions',
    title: 'Our Field Interventions',
    description: 'Discover the tangible impact of our actions, our completed projects and our ongoing commitment to local communities.',
    completed: 'Completed', location: 'Location not specified', recent: 'Recently',
    error: 'Unable to load interventions.', retry: 'Try again',
    empty: 'No published interventions',
    emptyDesc: 'Come back later to discover our new projects.'
  },
  it: {
    label: 'Le nostre azioni umanitarie',
    title: 'I nostri interventi sul campo',
    description: 'Scopri l’impatto concreto delle nostre azioni, i progetti realizzati e il nostro impegno continuo a favore delle comunità locali.',
    completed: 'Realizzato', location: 'Località non specificata', recent: 'Recentemente',
    error: 'Impossibile caricare gli interventi.', retry: 'Riprova',
    empty: 'Nessun intervento pubblicato',
    emptyDesc: 'Torna più tardi per scoprire i nostri nuovi progetti.'
  }
};

const locales = { fr: 'fr-FR', mg: 'mg-MG', en: 'en-GB', it: 'it-IT' };

const paragraph = 'break-words whitespace-pre-wrap text-justify text-[15px] font-normal leading-[1.85] text-[#374151] md:text-base';

const parseImages = value => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    return value.trim().startsWith('[') ? JSON.parse(value) : [value];
  } catch {
    return [];
  }
};

const getImages = item => {
  const images = [...new Set([
    ...parseImages(item.image),
    ...parseImages(item.image_url)
  ].filter(img => typeof img === 'string' && img.trim()))];

  return images.length ? images : [FALLBACK_IMAGE];
};

const formatDate = (value, locale, fallback) => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

function InterventionImage({ src, title, index, completed }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="group/image relative aspect-[4/3] overflow-hidden rounded-xl bg-[#DCE9D3]">
      <img src={failed ? '/Interv.jpg' : src} alt={`${title} ${index + 1}`} loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain transition-transform duration-700 motion-safe:group-hover/image:scale-[1.02]"/>

      {index === 0 && (
        <span className="absolute left-3 top-3 rounded-full bg-[#14532D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          {completed}
        </span>
      )}
    </div>
  );
}

export default function InterventionsPubliees() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.resolvedLanguage);
  const tr = translations[lang] || translations.fr;
  const locale = locales[lang] || locales.fr;

  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPublishedData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get('/interventions', { signal: controller.signal });
        if (!Array.isArray(response.data)) throw new Error('Invalid data');

        if (!controller.signal.aborted) {
          setInterventions(response.data.filter(item => item.is_published === true));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Erreur de connexion au serveur backend:', err);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPublishedData();
    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="overflow-hidden bg-[var(--paper)] py-10 text-[#203528] md:py-14">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">

        {/* En-tête */}
        <ScrollReveal className="mb-7 md:mb-9">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 rounded-full bg-primary"/>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {tr.label}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            {tr.title}
          </h2>
          <p className={`${paragraph} mt-3`}>{tr.description}</p>
        </ScrollReveal>

        {/* Chargement */}
        {loading ? (
          <div role="status" className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-[#F0F5E9] py-10 text-sm text-[#374151]">
            <span className="h-10 w-10 rounded-full border-2 border-[#CDDCC4] border-t-primary motion-safe:animate-spin"/>
            {t('common.loading')}
          </div>

        ) : error ? (

          /* Erreur de chargement */
          <ScrollReveal>
            <div role="alert" className="flex flex-col items-center gap-3 rounded-[24px] bg-[#F0F5E9] px-5 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE9D3] text-primary">
                <AlertCircle size={25} strokeWidth={1.8}/>
              </span>
              <p className="text-sm font-medium text-[#374151]">{tr.error}</p>
              <button type="button" onClick={() => setAttempt(n => n + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]">
                <RefreshCcw size={17}/>{tr.retry}
              </button>
            </div>
          </ScrollReveal>

        ) : interventions.length ? (

          /* Interventions publiées */
          <div className="space-y-5 md:space-y-6">
            {interventions.map((original, index) => {
              const item = localizeIntervention(original, lang);
              const images = getImages(item);

              return (
                <ScrollReveal key={item.id} direction={index % 2 ? 'right' : 'left'}>
                  <article className={`flex flex-col items-start overflow-hidden rounded-[24px] bg-[#F0F5E9] shadow-[0_5px_20px_rgba(20,83,45,0.06)] ${index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                    {/* Galerie d'images */}
                    <div className={`grid w-full shrink-0 content-start gap-2.5 p-3 sm:p-4 lg:w-[40%] ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {images.map((img, idx) => (
                        <InterventionImage key={`${img}-${idx}`} src={img} title={item.title}
                          index={idx} completed={tr.completed}/>
                      ))}
                    </div>

                    {/* Contenu complet */}
                    <div className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

                      {/* Localisation et date */}
                      <div className="mb-4 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[#DCE9D3] px-3 py-2 text-sm font-medium text-[#14532D]">
                          <MapPin size={17} strokeWidth={1.8} className="shrink-0"/>
                          <span className="break-words">{item.location || tr.location}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-[#E5EAF8] px-3 py-2 text-sm font-medium text-[#1E40AF]">
                          <Calendar size={17} strokeWidth={1.8} className="shrink-0"/>
                          {formatDate(item.created_at, locale, tr.recent)}
                        </span>
                      </div>

                      <h3 className="mb-3 break-words text-2xl font-semibold leading-tight tracking-tight text-[#14532D] md:text-3xl">
                        {item.title}
                      </h3>
                      <p className={paragraph}>{item.description}</p>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

        ) : (

          /* Aucune intervention */
          <ScrollReveal>
            <div className="flex flex-col items-center gap-2 rounded-[24px] bg-[#F0F5E9] px-5 py-8 text-center">
              <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#DCE9D3] text-primary">
                <Layers size={27} strokeWidth={1.8}/>
              </span>
              <h3 className="text-lg font-semibold text-[#14532D]">{tr.empty}</h3>
              <p className="text-sm leading-relaxed text-[#374151]">{tr.emptyDesc}</p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}