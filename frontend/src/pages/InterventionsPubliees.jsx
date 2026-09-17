
import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, ArrowRight, X, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import api from '../api/axios';

const InterventionsPubliees = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchPublishedData = async () => {
            try {
                setLoading(true);

                const response = await api.get('/interventions');
                const published = response.data.filter(item => item.is_published === true);

                setInterventions(published);
            } catch (err) {
                console.error("Erreur de connexion au serveur backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedData();
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSelectedItem(null);
        };

        window.addEventListener('keydown', handleEsc);

        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-[var(--paper)]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--sky)]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">
            <section className="pt-4 pb-4 px-6 md:px-12 bg-[var(--paper)] border-b border-[var(--paper-line)]">
                <div className="max-w-7xl mx-auto text-left space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--sky-ice)] text-[var(--sky-deep)] font-mono-label font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-[var(--sky)]/25">
                        <Sparkles size={12} /> Nos Actions Humanitaires
                    </span>

                    <h1 className="text-2xl md:text-4xl font-display font-bold text-[var(--ink)] tracking-tight leading-none">
                        Nos Interventions sur le <span className="text-[var(--sky)]">Terrain</span>
                    </h1>

                    <p className="text-[var(--ink-soft)] text-xs md:text-sm font-body leading-relaxed max-w-2xl border-l-2 pl-3 border-[var(--sky)]">
                        Découvrez l'impact concret de nos actions, nos projets réalisés et notre engagement continu auprès des communautés locales.
                    </p>
                </div>
            </section>

            <section className="py-6 md:py-8 px-6 md:px-12 bg-[var(--paper)]">
                <div className="max-w-7xl mx-auto">
                    {interventions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {interventions.map((item) => {
                                let images = [];

                                try {
                                    if (Array.isArray(item.image)) {
                                        images = item.image;
                                    } else if (typeof item.image === 'string') {
                                        if (item.image.startsWith('[')) {
                                            images = JSON.parse(item.image);
                                        } else {
                                            images = [item.image];
                                        }
                                    }
                                } catch {
                                    images = [];
                                }

                                images = images.filter(Boolean);

                                const mainImage = images[0] || item.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80";
                                const extraCount = images.length > 1 ? images.length - 1 : 0;

                                return (
                                    <article 
                                        key={item.id} 
                                        className="bg-white rounded-2xl overflow-hidden border border-[var(--paper-line)] hover:border-[var(--sky)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-sm"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="relative h-52 overflow-hidden bg-[var(--paper-line)]">
                                            <img 
                                                src={mainImage} 
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono-label font-bold text-[var(--sky)] border border-[var(--paper-line)] uppercase tracking-widest shadow-sm">
                                                    Réalisé
                                                </span>
                                            </div>

                                            {extraCount > 0 && (
                                                <div className="absolute bottom-3 right-3">
                                                    <div className="flex items-center gap-1 bg-[var(--sky)] backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono-label font-bold text-white shadow-sm">
                                                        <ImageIcon size={12} />
                                                        <span>+{extraCount}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow text-left space-y-2.5">
                                            <div className="flex items-center gap-1.5 text-[var(--sky)]">
                                                <MapPin size={14} strokeWidth={2.5} />
                                                <span className="text-[10px] font-mono-label font-bold uppercase tracking-wider">
                                                    {item.location || 'Localisation non spécifiée'}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-base font-display font-bold text-[var(--ink)] line-clamp-2 leading-snug group-hover:text-[var(--sky)] transition-colors">
                                                {item.title}
                                            </h3>
                                            
                                            <p className="text-[var(--ink-soft)] text-xs font-normal leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>

                                            <div className="mt-auto pt-3 border-t border-[var(--paper-line)] flex items-center justify-between text-[10px] text-[var(--ink-soft)]">
                                                <div className="flex items-center gap-1 font-medium">
                                                    <Calendar size={12} />

                                                    <span>
                                                        {item.created_at
                                                            ? new Date(item.created_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })
                                                            : 'Récemment'
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 text-[var(--sky)] font-mono-label font-bold group-hover:gap-1.5 transition-all">
                                                    <span>Voir plus</span>
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--paper-line)] px-6 shadow-sm max-w-2xl mx-auto">
                            <div className="bg-[var(--paper)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border border-[var(--paper-line)]">
                                <Layers className="text-[var(--ink-soft)]" size={22} />
                            </div>

                            <h3 className="text-base font-display font-bold text-[var(--ink)] mb-1">
                                Aucune intervention publiée
                            </h3>

                            <p className="text-[var(--ink-soft)] font-mono-label text-[10px] uppercase">
                                Revenez un peu plus tard pour découvrir nos nouveaux projets.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {selectedItem && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[var(--ink)]/40 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedItem(null)}
                >
                    <div 
                        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-[var(--paper-line)] flex flex-col relative text-[var(--ink)] text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-[var(--paper)] hover:bg-[var(--sky)] hover:text-white text-[var(--ink-soft)] rounded-xl transition-all shadow-sm border border-[var(--paper-line)] group"
                        >
                            <X size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="overflow-y-auto p-5 md:p-8 space-y-5">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-[var(--sky)]">
                                    <MapPin size={14} strokeWidth={2.5} />

                                    <span className="font-mono-label font-bold uppercase tracking-widest text-[10px]">
                                        {selectedItem.location}
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-2xl font-display font-bold text-[var(--ink)] leading-tight pr-8">
                                    {selectedItem.title}
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(Array.isArray(selectedItem.image) 
                                    ? selectedItem.image 
                                    : (
                                        typeof selectedItem.image === 'string' && selectedItem.image.startsWith('[') 
                                        ? JSON.parse(selectedItem.image) 
                                        : [selectedItem.image]
                                    )
                                ).filter(Boolean).map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative rounded-xl overflow-hidden h-48 bg-[var(--paper)] border border-[var(--paper-line)] shadow-inner"
                                    >
                                        <img 
                                            src={img} 
                                            alt="Intervention zoom" 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--paper-tint)] p-4 md:p-5 rounded-xl border border-[var(--paper-line)] space-y-2">
                                <h4 className="font-display font-bold text-[var(--sky)] text-xs uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-3.5 h-1 bg-[var(--sky)] rounded-full"></span>
                                    À propos de ce projet
                                </h4>

                                <p className="text-[var(--ink-soft)] leading-relaxed text-xs md:text-sm whitespace-pre-wrap font-normal">
                                    {selectedItem.description}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[var(--paper-line)] flex flex-wrap items-center justify-between gap-3 text-[var(--ink-soft)] text-[10px] font-mono-label font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />

                                    <span>
                                        Publié le {selectedItem.created_at
                                            ? new Date(selectedItem.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : 'Récemment'
                                        }
                                    </span>
                                </div>

                                <span className="bg-[var(--sky-ice)] px-2.5 py-1 rounded-lg text-[var(--sky)] border border-[var(--paper-line)]">
                                    ID: {String(selectedItem.id).slice(0, 8)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterventionsPubliees;
