import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Layers, Loader2, RefreshCcw, AlertCircle, Pause, Play } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import api from '../api/axios';
import { normalizeLanguage, localizeIntervention } from '../utils/localizeIntervention';

const REFRESH_INTERVAL = 30000;
const MIN_SLIDES = 8;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&fit=crop";

const translations = {
  fr: {
    label: 'Galerie Visuelle', title: 'Nos Réalisations',
    description: "Chaque image capturée ici est le témoin d'un engagement profond et d'une volonté inébranlable d'apporter un changement durable à travers nos actions de terrain.",
    gallery: 'Galerie Panoramique', photos: 'photo(s)', scrolling: 'Défilement Continu',
    loading: 'Chargement...', error: 'Impossible de charger les réalisations.', retry: 'Réessayer',
    empty: 'Aucune réalisation disponible',
    emptyDesc: "Les images publiées depuis l'espace d'administration apparaîtront ici.",
    pause: 'Mettre en pause', play: 'Reprendre'
  },
  mg: {
    label: 'Tahirin-tsary', title: 'Ny zava-bitanay',
    description: "Ny sary tsirairay eto dia maneho ny fanoloran-tena lalina sy ny finiavana tsy mihozongozona hitondra fiovana maharitra amin'ny alalan'ny asa ataonay eny ifotony.",
    gallery: 'Fampirantiana sary', photos: 'sary', scrolling: 'Fihodinana mitohy',
    loading: 'Eo am-pampidirana...', error: 'Tsy afaka nampiditra ny zava-bita.', retry: 'Andramo indray',
    empty: 'Tsy misy zava-bita azo aseho',
    emptyDesc: "Hiseho eto ireo sary navoaka avy amin'ny sehatry ny fitantanana.",
    pause: 'Ajanona vetivety', play: 'Tohizana'
  },
  en: {
    label: 'Visual Gallery', title: 'Our Achievements',
    description: 'Every image captured here bears witness to a deep commitment and an unwavering determination to bring about lasting change through our actions in the field.',
    gallery: 'Panoramic Gallery', photos: 'photo(s)', scrolling: 'Continuous Scrolling',
    loading: 'Loading...', error: 'Unable to load achievements.', retry: 'Try again',
    empty: 'No achievements available',
    emptyDesc: 'Images published from the administration area will appear here.',
    pause: 'Pause', play: 'Resume'
  },
  it: {
    label: 'Galleria Visiva', title: 'I nostri risultati',
    description: 'Ogni immagine qui catturata testimonia un impegno profondo e una volontà incrollabile di apportare un cambiamento duraturo attraverso le nostre azioni sul campo.',
    gallery: 'Galleria Panoramica', photos: 'foto', scrolling: 'Scorrimento Continuo',
    loading: 'Caricamento...', error: 'Impossibile caricare i risultati.', retry: 'Riprova',
    empty: 'Nessun risultato disponibile',
    emptyDesc: "Le immagini pubblicate dall'area di amministrazione appariranno qui.",
    pause: 'Metti in pausa', play: 'Riprendi'
  }
};

const isPublished = item => [true, 1, '1', 'true'].includes(item.is_published);

const parseImages = value => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  const image = value.trim();

  try {
    if (image.startsWith('[')) {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed : [image];
    }
    if (image.includes(',') && !image.startsWith('data:')) return image.split(',').map(item => item.trim());
    return [image];
  } catch {
    return [image];
  }
};

const getImages = intervention => [...new Set([
  ...parseImages(intervention.image),
  ...parseImages(intervention.image_url)
].filter(item => typeof item === 'string' && item.trim()))];

function PhotoCard({ item }) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="group/item relative h-full overflow-hidden rounded-[20px] bg-[#F0F5E9] shadow-[0_4px_15px_rgba(20,83,45,0.06)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#DCE9D3]">
        <img src={failed ? FALLBACK_IMAGE : item.url} alt={item.title || ''} loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain transition-transform duration-700 motion-safe:group-hover/item:scale-[1.02]"/>
      </div>

      <div className="border-t border-[#CDDCC4] px-4 py-3">
        <div className="mb-1.5 flex items-start gap-2 text-primary">
          <MapPin size={16} strokeWidth={1.8} className="mt-0.5 shrink-0"/>
          <p className="break-words text-xs font-medium sm:text-sm">{item.location || 'Madagascar'}</p>
        </div>
        <h3 className="break-words text-sm font-semibold leading-snug text-[#14532D] sm:text-base">
          {item.title}
        </h3>
      </div>
    </article>
  );
}

export default function Realisations() {
  const { i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.resolvedLanguage);
  const tr = translations[lang] || translations.fr;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);

  const fetchRealisations = useCallback(async (silent = false, signal) => {
    if (!silent) setLoading(true);

    try {
      const response = await api.get('/interventions', { signal });
      const all = Array.isArray(response.data) ? response.data : [];

      const published = all.filter(isPublished)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      const flat = published.flatMap(intervention =>
        getImages(intervention).map((url, idx) => ({
          key: `${intervention.id}-${idx}`,
          url, title: intervention.title, description: intervention.description,
          location: intervention.location, translations: intervention.translations
        }))
      );

      if (!signal?.aborted) {
        setPhotos(previous => JSON.stringify(previous) === JSON.stringify(flat) ? previous : flat);
        setError(false);
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error('Erreur chargement réalisations backend:', err);
        if (!silent) setError(true);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => fetchRealisations(false, controller.signal), 0);
    const interval = setInterval(() => fetchRealisations(true, controller.signal), REFRESH_INTERVAL);

    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible') fetchRealisations(true, controller.signal);
    };

    document.addEventListener('visibilitychange', refreshOnReturn);
    window.addEventListener('focus', refreshOnReturn);

    return () => {
      controller.abort();
      clearTimeout(timer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshOnReturn);
      window.removeEventListener('focus', refreshOnReturn);
    };
  }, [fetchRealisations]);

  const slides = useMemo(() => {
    if (!photos.length) return [];
    const repeats = Math.max(1, Math.ceil(MIN_SLIDES / photos.length));
    const base = Array.from({ length: repeats }, () => photos).flat();
    return [...base, ...base];
  }, [photos]);

  return (
    <section className="overflow-hidden bg-[var(--paper)] py-10 text-[#203528] md:py-14">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">

        {/* En-tête */}
        <ScrollReveal className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 rounded-full bg-primary"/>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {tr.label}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            {tr.title}
          </h2>
          <p className="paragraph mt-3">{tr.description}</p>
        </ScrollReveal>

        {/* En-tête de la galerie */}
        <ScrollReveal direction="up" className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Camera size={22} strokeWidth={1.8}/>
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#14532D] sm:text-lg">{tr.gallery}</h3>
                {photos.length > 0 && (
                  <p className="text-sm text-[#374151]">{photos.length} {tr.photos}</p>
                )}
              </div>
            </div>

            <div className="hidden h-px flex-1 bg-[#CDDCC4] sm:block"/>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-medium uppercase tracking-wide text-[#14532D] sm:block">
                {tr.scrolling}
              </span>
              {slides.length > 0 && (
                <button type="button" onClick={() => setPaused(value => !value)}
                  title={paused ? tr.play : tr.pause} aria-label={paused ? tr.play : tr.pause}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCE9D3] text-primary transition-colors hover:bg-primary hover:text-white">
                  {paused ? <Play size={19}/> : <Pause size={19}/>}
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Chargement */}
        {loading ? (
          <div role="status" className="flex flex-col items-center gap-3 rounded-[24px] bg-[#F0F5E9] py-9">
            <Loader2 size={32} className="text-primary motion-safe:animate-spin"/>
            <span className="text-sm font-medium text-[#374151]">{tr.loading}</span>
          </div>

        ) : error ? (

          /* Erreur */
          <ScrollReveal>
            <div role="alert" className="flex flex-col items-center gap-3 rounded-[24px] bg-[#F0F5E9] px-5 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE9D3] text-primary">
                <AlertCircle size={25} strokeWidth={1.8}/>
              </span>
              <p className="text-sm font-medium text-[#374151]">{tr.error}</p>
              <button type="button" onClick={() => fetchRealisations()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]">
                <RefreshCcw size={17}/>{tr.retry}
              </button>
            </div>
          </ScrollReveal>

        ) : slides.length > 0 ? (

          /* Galerie panoramique */
          <ScrollReveal direction="up">
            <div className={`realisations-gallery relative overflow-x-auto rounded-[24px] py-2 ${paused ? 'is-paused' : ''}`}>

              <div className="realisations-track flex w-max items-stretch">
                {slides.map((item, index) => (
                  <div key={`${item.key}-${index}`} className="w-[280px] shrink-0 px-1.5 sm:w-[320px] lg:w-[350px]">
                    <PhotoCard item={localizeIntervention(item, lang)}/>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        ) : (

          /* Aucune réalisation */
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

      <style>{`
        @keyframes realisations-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .realisations-gallery {
          overflow-x: hidden;
        }

        .realisations-track {
          animation: realisations-scroll 80s linear infinite;
          will-change: transform;
        }

        .realisations-gallery:hover .realisations-track,
        .realisations-gallery:focus-within .realisations-track,
        .realisations-gallery.is-paused .realisations-track {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .realisations-track {
            animation-duration: 50s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .realisations-gallery {
            overflow-x: auto;
          }
          .realisations-track {
            animation: none;
            will-change: auto;
          }
        }
      `}</style>
    </section>
  );
}