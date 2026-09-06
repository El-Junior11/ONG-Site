import React, { useEffect, useState, useCallback } from 'react';
import { Camera, Sparkles, MapPin, Layers, Loader2 } from 'lucide-react';

const Realisations = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api/interventions';

    const fetchRealisations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            let result = [];

            if (response.ok) {
                const allInterventions = await response.json();
                result = allInterventions.filter(item => item.is_published === true || item.is_published === 1);
            } else {
                result = [
                    {
                        id: '1',
                        title: "Construction d'un puit d'eau potable",
                        location: "District de Menabe, Madagascar",
                        image: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&h=400&fit=crop"],
                        is_published: true
                    },
                    {
                        id: '2',
                        title: "Campagne de reforestation communautaire",
                        location: "Région Haute Matsiatra",
                        image: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&h=400&fit=crop"],
                        is_published: true
                    }
                ];
            }

            const saryTsirairay = [];
            
            result.forEach(intervention => {
                let listSary = [];
                
                try {
                    if (Array.isArray(intervention.image)) {
                        listSary = intervention.image;
                    } else if (typeof intervention.image === 'string') {
                        if (intervention.image.startsWith('[')) {
                            listSary = JSON.parse(intervention.image);
                        } else if (intervention.image.includes(',')) {
                            listSary = intervention.image.split(',').map(item => item.trim());
                        } else {
                            listSary = [intervention.image];
                        }
                    }
                } catch {
                    listSary = [intervention.image];
                }

                listSary = listSary.filter(Boolean);

                listSary.forEach(saryUrl => {
                    saryTsirairay.push({
                        url: saryUrl,
                        title: intervention.title,
                        location: intervention.location
                    });
                });
            });

            let finalData = saryTsirairay;
            if (saryTsirairay.length > 0 && saryTsirairay.length < 5) {
                finalData = [...saryTsirairay, ...saryTsirairay, ...saryTsirairay, ...saryTsirairay];
            } else if (saryTsirairay.length > 0) {
                finalData = [...saryTsirairay, ...saryTsirairay, ...saryTsirairay];
            }

            setData(finalData);
        } catch (err) {
            console.error("Erreur chargement réalisations backend:", err);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchRealisations();
    }, [fetchRealisations]);

    return (
        <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">
            
            {/* SECTION 1: En-tête compact et moderne */}
            <section className="pt-4 pb-4 px-6 md:px-12 bg-[var(--paper)] border-b border-[var(--paper-line)]">
                <div className="max-w-7xl mx-auto text-left space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--sky-ice)] text-[var(--sky-deep)] font-mono-label font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-[var(--sky)]/25">
                        <Sparkles size={12} /> Galerie Visuelle
                    </span>
                    <h1 className="text-2xl md:text-4xl font-display font-bold text-[var(--ink)] tracking-tight leading-none">
                        Nos <span className="text-[var(--sky)]">Réalisations</span>
                    </h1>
                    <p className="text-[var(--ink-soft)] text-xs md:text-sm font-body leading-relaxed max-w-2xl border-l-2 pl-3 border-[var(--sky)]">
                        Chaque image capturée ici est le témoin d'un engagement profond et d'une volonté inébranlable d'apporter un changement durable à travers nos actions de terrain.
                    </p>
                </div>
            </section>

            {/* SECTION 2: Animation Scroll Section */}
            <section className="py-6 md:py-8 bg-[var(--paper)] relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[var(--sky)] font-mono-label font-bold uppercase tracking-widest text-[10px] bg-[var(--sky-ice)] px-3.5 py-1.5 rounded-xl border border-[var(--paper-line)] shadow-sm">
                        <Camera size={14} />
                        <span>Galerie Panoramique</span>
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
                ) : data.length > 0 ? (
                    <div className="relative w-full overflow-hidden group py-2">
                        <div className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 bg-gradient-to-r from-[var(--paper)] to-transparent pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 bg-gradient-to-l from-[var(--paper)] to-transparent pointer-events-none"></div>

                        <div className="flex w-max animate-scroll-slow group-hover:pause-animation">
                            {data.map((item, index) => (
                                <div key={index} className="shrink-0 w-72 md:w-96 px-3">
                                    <div className="relative h-60 md:h-72 rounded-2xl overflow-hidden border border-[var(--paper-line)] group/item bg-white transition-all duration-300 hover:border-[var(--sky)] shadow-sm">
                                        <img 
                                            src={item.url} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&fit=crop"; }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                                            <div className="flex items-center gap-2 text-white/90 mb-1">
                                                <MapPin size={14} strokeWidth={2.5} className="text-[var(--sky)]" />
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
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[var(--paper-line)] max-w-5xl mx-auto px-6 shadow-sm">
                        <div className="bg-[var(--paper)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border border-[var(--paper-line)]">
                            <Layers className="text-[var(--ink-soft)]" size={22} />
                        </div>
                        <h3 className="text-base font-display font-bold text-[var(--ink)] mb-1">Aucune réalisation disponible</h3>
                        <p className="text-[var(--ink-soft)] font-mono-label text-[10px] uppercase">Les images publiées depuis l'espace d'administration apparaîtront ici.</p>
                    </div>
                )}
            </section>

            <style>{`
                @keyframes scroll-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
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
            `}</style>
        </div>
    );
};

export default Realisations;