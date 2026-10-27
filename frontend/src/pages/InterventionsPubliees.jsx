import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Sparkles, Layers, RefreshCcw } from 'lucide-react';
import api from '../api/axios';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80";

// Liste d'images fiable, quel que soit le format reçu du backend
const getImages = (item) => {
    let images = [];

    try {
        if (Array.isArray(item.image)) {
            images = item.image;
        } else if (typeof item.image === 'string' && item.image) {
            images = item.image.startsWith('[') ? JSON.parse(item.image) : [item.image];
        }
    } catch {
        images = [];
    }

    images = images.filter(Boolean);

    if (images.length === 0 && item.image_url) {
        images = [item.image_url];
    }

    return images.length > 0 ? images : [FALLBACK_IMAGE];
};

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : 'Récemment';

const InterventionsPubliees = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchPublishedData = async () => {
        try {
            setLoading(true);
            setError(false);

            const response = await api.get('/interventions');
            const published = response.data.filter(item => item.is_published === true);

            setInterventions(published);
        } catch (err) {
            console.error("Erreur de connexion au serveur backend:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishedData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-[var(--paper)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--sky)]"></div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">

            {/* En-tête */}
            <section className="pt-10 pb-4 md:pt-12 px-6 md:px-12 bg-[var(--paper)]">
                <div className="max-w-7xl mx-auto text-left space-y-3">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--sky-ice)] text-[var(--sky-deep)] font-mono-label font-bold text-xs uppercase tracking-[0.2em] rounded-full border border-[var(--sky)]/25">
                        <Sparkles size={14} /> Nos Actions Humanitaires
                    </span>

                    <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--ink)] tracking-tight leading-[1.05]">
                        Nos Interventions sur le{" "}
                        <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">
                            Terrain
                        </span>
                    </h1>

                    <p
                        className="text-[var(--ink-soft)] text-sm md:text-base font-body leading-relaxed max-w-2xl pl-4"
                        style={{ borderLeft: '4px solid var(--sky)' }}
                    >
                        Découvrez l'impact concret de nos actions, nos projets réalisés et notre engagement continu auprès des communautés locales.
                    </p>
                </div>
            </section>

            {/* Liste : tous les détails sont visibles directement */}
            <section className="py-4 md:py-6 px-6 md:px-12 bg-[var(--paper)]">
                <div className="max-w-7xl mx-auto">

                    {error ? (
                        <div className="text-center py-14 bg-white rounded-[2rem] border border-dashed border-[var(--paper-line)] px-6 max-w-2xl mx-auto">
                            <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mb-4">
                                Impossible de charger les interventions.
                            </p>

                            <button
                                onClick={fetchPublishedData}
                                className="inline-flex items-center gap-2 bg-[var(--sky)] text-white px-6 py-3 font-mono-label font-bold uppercase text-[11px] tracking-widest hover:bg-[var(--sky-deep)] transition-colors rounded-full"
                            >
                                <RefreshCcw size={14} /> Réessayer
                            </button>
                        </div>
                    ) : interventions.length > 0 ? (
                        <div className="space-y-6 md:space-y-8">
                            {interventions.map((item, index) => {
                                const images = getImages(item);
                                const [mainImage, ...otherImages] = images;

                                return (
                                    <article
                                        key={item.id}
                                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] overflow-hidden`}
                                    >
                                        {/* Images : toutes visibles */}
                                        <div className="w-full lg:w-5/12 p-3 space-y-3 bg-[var(--paper)]/60">
                                            <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] bg-[var(--paper-line)]">
                                                <img
                                                    src={mainImage}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />

                                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono-label font-bold text-[var(--sky)] border border-[var(--paper-line)] uppercase tracking-widest shadow-sm">
                                                    Réalisé
                                                </span>
                                            </div>

                                            {otherImages.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3">
                                                    {otherImages.map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="rounded-2xl overflow-hidden aspect-square bg-[var(--paper-line)]"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${item.title} ${idx + 2}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Texte complet */}
                                        <div className="w-full lg:w-7/12 p-6 md:p-8 space-y-4 text-left">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 text-[var(--sky)] bg-[var(--sky-ice)] px-3 py-1 rounded-full border border-[var(--paper-line)]">
                                                    <MapPin size={14} strokeWidth={2.5} />
                                                    <span className="text-[11px] font-mono-label font-bold uppercase tracking-wider">
                                                        {item.location || 'Localisation non spécifiée'}
                                                    </span>
                                                </span>

                                                <span className="inline-flex items-center gap-1.5 text-[var(--ink-soft)] bg-[var(--paper)] px-3 py-1 rounded-full border border-[var(--paper-line)]">
                                                    <Calendar size={13} />
                                                    <span className="text-[11px] font-mono-label font-bold uppercase tracking-wider">
                                                        {formatDate(item.created_at)}
                                                    </span>
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight leading-tight">
                                                {item.title}
                                            </h3>

                                            <p
                                                className="text-[var(--ink-soft)] text-sm md:text-base font-normal leading-relaxed whitespace-pre-wrap break-words pl-4"
                                                style={{ borderLeft: '4px solid var(--sky)' }}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-[var(--paper-line)] px-6 shadow-sm max-w-2xl mx-auto">
                            <div className="bg-[var(--paper)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border border-[var(--paper-line)]">
                                <Layers className="text-[var(--ink-soft)]" size={22} />
                            </div>

                            <h3 className="text-lg font-display font-extrabold text-[var(--ink)] mb-1">
                                Aucune intervention publiée
                            </h3>

                            <p className="text-[var(--ink-soft)] font-mono-label text-[11px] uppercase">
                                Revenez un peu plus tard pour découvrir nos nouveaux projets.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <div className="h-6 md:h-8"></div>
        </div>
    );
};

export default InterventionsPubliees;