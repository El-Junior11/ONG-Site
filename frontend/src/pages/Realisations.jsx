import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Camera, Sparkles, MapPin, Layers, Loader2, RefreshCcw } from 'lucide-react';
import api from '../api/axios';

const REFRESH_INTERVAL = 30000; // actualisation automatique toutes les 30 s
const MIN_SLIDES = 8;           // nombre minimum de vignettes pour un défilement fluide
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&fit=crop";

const isPublished = (item) =>
    item.is_published === true ||
    item.is_published === 1 ||
    item.is_published === '1' ||
    item.is_published === 'true';

// Récupère TOUTES les images d'une intervention, quel que soit le format du backend :
// tableau, JSON, liste séparée par des virgules, ou image_url (champ enregistré par l'admin)
const getImages = (intervention) => {
    let list = [];

    try {
        if (Array.isArray(intervention.image)) {
            list = intervention.image;
        } else if (typeof intervention.image === 'string' && intervention.image) {
            if (intervention.image.startsWith('[')) {
                list = JSON.parse(intervention.image);
            } else if (intervention.image.includes(',') && !intervention.image.startsWith('data:')) {
                list = intervention.image.split(',').map(item => item.trim());
            } else {
                list = [intervention.image];
            }
        }
    } catch {
        list = typeof intervention.image === 'string' ? [intervention.image] : [];
    }

    // image_url peut contenir une URL simple ou un tableau JSON (plusieurs images)
    if (intervention.image_url) {
        let fromUrl = [intervention.image_url];

        try {
            if (typeof intervention.image_url === 'string' && intervention.image_url.trim().startsWith('[')) {
                fromUrl = JSON.parse(intervention.image_url);
            }
        } catch {
            fromUrl = [intervention.image_url];
        }

        list = [...list, ...fromUrl];
    }

    // Retire les vides et les doublons
    return [...new Set(list.filter(Boolean))];
};

const Realisations = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // silent = true : actualisation en arrière-plan, sans écran de chargement
    const fetchRealisations = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);

        try {
            const response = await api.get('/interventions');
            const all = Array.isArray(response.data) ? response.data : [];

            const published = all
                .filter(isPublished)
                .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

            const flat = [];

            published.forEach(intervention => {
                getImages(intervention).forEach((url, idx) => {
                    flat.push({
                        key: `${intervention.id}-${idx}`,
                        url,
                        title: intervention.title,
                        location: intervention.location
                    });
                });
            });

            setPhotos(flat);
            setError(false);
        } catch (err) {
            console.error("Erreur chargement réalisations backend:", err);
            // En actualisation silencieuse, on garde les photos déjà affichées
            if (!silent) setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRealisations();

        const interval = setInterval(() => fetchRealisations(true), REFRESH_INTERVAL);

        // Mise à jour immédiate quand on revient sur l'onglet / la fenêtre
        const refreshOnReturn = () => {
            if (document.visibilityState === 'visible') fetchRealisations(true);
        };

        document.addEventListener('visibilitychange', refreshOnReturn);
        window.addEventListener('focus', refreshOnReturn);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', refreshOnReturn);
            window.removeEventListener('focus', refreshOnReturn);
        };
    }, [fetchRealisations]);

    // Liste du défilement : on répète jusqu'à avoir assez de vignettes, puis on double
    // la série pour une boucle parfaite (animation de 0 à -50 %)
    const slides = useMemo(() => {
        if (photos.length === 0) return [];

        const repeats = Math.max(1, Math.ceil(MIN_SLIDES / photos.length));
        const base = Array.from({ length: repeats }, () => photos).flat();

        return [...base, ...base];
    }, [photos]);

    return (
        <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">
            
            <section className="pt-10 pb-4 md:pt-12 px-6 md:px-12 bg-[var(--paper)]">
                <div className="max-w-7xl mx-auto text-left space-y-3">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--sky-ice)] text-[var(--sky-deep)] font-mono-label font-bold text-xs uppercase tracking-[0.2em] rounded-full border border-[var(--sky)]/25">
                        <Sparkles size={14} /> Galerie Visuelle
                    </span>
                    <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--ink)] tracking-tight leading-[1.05]">
                        Nos{" "}
                        <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">
                            Réalisations
                        </span>
                    </h1>
                    <p
                        className="text-[var(--ink-soft)] text-sm md:text-base font-body leading-relaxed max-w-2xl pl-4"
                        style={{ borderLeft: '4px solid var(--sky)' }}
                    >
                        Chaque image capturée ici est le témoin d'un engagement profond et d'une volonté inébranlable d'apporter un changement durable à travers nos actions de terrain.
                    </p>
                </div>
            </section>

            <section className="py-6 md:py-8 bg-[var(--paper)] relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[var(--sky)] font-mono-label font-bold uppercase tracking-widest text-[10px] bg-[var(--sky-ice)] px-3.5 py-1.5 rounded-xl border border-[var(--paper-line)] shadow-sm">
                        <Camera size={14} />
                        <span>Galerie Panoramique{photos.length > 0 ? ` · ${photos.length} photo(s)` : ''}</span>
                    </div>
                    <div className="h-px flex-1 bg-[var(--paper-line)] mx-6 hidden md:block"></div>
                    <div className="text-[var(--ink-soft)] font-mono-label text-[10px] font-semibold uppercase tracking-wider">
                        Défilement Continu
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="relative flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[var(--sky)]" size={36} />
                            <span className="text-[var(--sky)] font-mono-label font-bold text-[10px] uppercase tracking-widest">Chargement...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-14 bg-white rounded-[2rem] border border-dashed border-[var(--paper-line)] max-w-3xl mx-auto px-6 shadow-sm">
                        <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mb-4">
                            Impossible de charger les réalisations.
                        </p>

                        <button
                            onClick={() => fetchRealisations()}
                            className="inline-flex items-center gap-2 bg-[var(--sky)] text-white px-6 py-3 font-mono-label font-bold uppercase text-[11px] tracking-widest hover:bg-[var(--sky-deep)] transition-colors rounded-full"
                        >
                            <RefreshCcw size={14} /> Réessayer
                        </button>
                    </div>
                ) : slides.length > 0 ? (
                    <div className="relative w-full overflow-hidden group py-2">
                        <div className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 bg-gradient-to-r from-[var(--paper)] to-transparent pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 bg-gradient-to-l from-[var(--paper)] to-transparent pointer-events-none"></div>

                        <div className="flex w-max animate-scroll-slow group-hover:pause-animation">
                            {slides.map((item, index) => (
                                <div key={`${item.key}-${index}`} className="shrink-0 w-72 md:w-96 px-3">
                                    <div className="relative h-60 md:h-72 rounded-[1.5rem] overflow-hidden border border-[var(--paper-line)] group/item bg-white transition-all duration-300 hover:border-[var(--sky)] shadow-sm">
                                        <img 
                                            src={item.url} 
                                            alt={item.title} 
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                                            <div className="flex items-center gap-2 text-white/90 mb-1">
                                                <MapPin size={14} strokeWidth={2.5} className="text-[var(--sky-bright)]" />
                                                <p className="text-[10px] font-mono-label font-bold uppercase tracking-[0.2em]">
                                                    {item.location || 'Madagascar'}
                                                </p>
                                            </div>
                                            <h3 className="text-white text-sm md:text-base font-display font-bold leading-snug">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-[var(--paper-line)] max-w-5xl mx-auto px-6 shadow-sm">
                        <div className="bg-[var(--paper)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border border-[var(--paper-line)]">
                            <Layers className="text-[var(--ink-soft)]" size={22} />
                        </div>
                        <h3 className="text-lg font-display font-extrabold text-[var(--ink)] mb-1">Aucune réalisation disponible</h3>
                        <p className="text-[var(--ink-soft)] font-mono-label text-[11px] uppercase">Les images publiées depuis l'espace d'administration apparaîtront ici.</p>
                    </div>
                )}
            </section>

            <style>{`
                @keyframes scroll-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .animate-scroll-slow {
                    animation: scroll-slow 80s linear infinite;
                }

                .pause-animation:hover {
                    animation-play-state: paused;
                }

                @media (max-width: 768px) {
                    .animate-scroll-slow {
                        animation-duration: 50s;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-scroll-slow {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Realisations;