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
                // Sivanina tsara izay voasivana hoe "is_published: true" ihany (na 1 / true miankina amin'ny DB)
                result = allInterventions.filter(item => item.is_published === true || item.is_published === 1);
            } else {
                // Data santionany raha misy olana ny fifandraisana amin'ny backend
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

            // Lojika mamoaka ny sary tsirairay avy ao anaty array na string
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

                // Isaky ny sary 1 hita, dia mamorona "card" iray mahaleotena
                listSary.forEach(saryUrl => {
                    saryTsirairay.push({
                        url: saryUrl,
                        title: intervention.title,
                        location: intervention.location
                    });
                });
            });

            // Raha toa ka vitsy loatra ny sary dia averina mba tsy ho tapaka ny animation scroll
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
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body overflow-x-hidden pb-24">
            {/* --- 1. EN-TÊTE (HERO SECTION MAODERINA) --- */}
            <div className="relative py-32 px-6 text-center overflow-hidden border-b border-[var(--paper-line)] bg-white">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/Real.jpg" 
                        alt="Background Realisations" 
                        className="w-full h-full object-cover scale-105 opacity-15 blur-[2px]"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&fit=crop"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-[var(--paper)]"></div>
                </div>

                <div className="relative z-20 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sky-ice)] border border-[var(--paper-line)] text-[var(--sky)] text-xs font-mono-label font-bold uppercase tracking-widest mb-6 shadow-sm">
                        <Sparkles size={14} /> Galerie Visuelle
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight text-[var(--ink)] uppercase">
                        Nos Réalisations
                    </h1>
                    <p className="text-[var(--ink-soft)] max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Chaque image capturée ici est le témoin d'un engagement profond et d'une volonté inébranlable d'apporter un changement durable à travers nos actions de terrain.
                    </p>
                </div>
            </div>

            {/* --- 2. ANIMATION SCROLL SECTION --- */}
            <div className="py-20 bg-[var(--paper)] relative">
                <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[var(--sky)] font-mono-label font-black uppercase tracking-widest text-xs bg-[var(--sky-ice)] px-4 py-2 rounded-2xl border border-[var(--paper-line)] shadow-sm">
                        <Camera size={18} />
                        <span>Galerie Panoramique</span>
                    </div>
                    <div className="h-px flex-1 bg-[var(--paper-line)] mx-6 hidden md:block"></div>
                    <div className="text-[var(--ink-soft)] font-mono-label text-xs font-bold uppercase tracking-wider">
                        Défilement Continu
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="relative flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[var(--sky)]" size={48} />
                            <span className="text-[var(--sky)] font-mono-label font-bold text-xs uppercase tracking-widest">Chargement...</span>
                        </div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="relative w-full overflow-hidden group py-4">
                        
                        {/* Gradient Overlays ho an'ny effect "fading" amin'ny sisiny */}
                        <div className="absolute inset-y-0 left-0 w-32 md:w-64 z-10 bg-gradient-to-r from-[var(--paper)] to-transparent pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-32 md:w-64 z-10 bg-gradient-to-l from-[var(--paper)] to-transparent pointer-events-none"></div>

                        {/* Ny div mikisaka (Marquee) */}
                        <div className="flex w-max animate-scroll-slow group-hover:pause-animation">
                            {data.map((item, index) => (
                                <div key={index} className="shrink-0 w-72 md:w-96 px-3">
                                    <div className="relative h-72 md:h-96 rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(11,79,134,0.06)] border border-[var(--paper-line)] group/item bg-white transition-all duration-500 hover:border-[var(--sky)]">
                                        
                                        <img 
                                            src={item.url} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110 opacity-95 group-hover/item:opacity-100"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&fit=crop"; }}
                                        />
                                        
                                        {/* Overlay mipoitra rehefa hover-ena ny sary */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-left">
                                            <div className="flex items-center gap-2 text-[var(--sky-bright)] mb-2">
                                                <MapPin size={14} strokeWidth={2.5} />
                                                <p className="text-[10px] font-mono-label font-black uppercase tracking-[0.2em]">
                                                    {item.location || 'Madagascar'}
                                                </p>
                                            </div>
                                            <h3 className="text-white text-lg font-display font-extrabold leading-tight">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-[var(--paper-line)] max-w-4xl mx-auto px-6 shadow-sm">
                        <div className="bg-[var(--paper)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--paper-line)]">
                            <Layers className="text-[var(--ink-soft)]" size={32} />
                        </div>
                        <h3 className="text-xl font-display font-extrabold text-[var(--ink)] mb-2">Aucune réalisation disponible</h3>
                        <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mt-1">Les images publiées depuis l'espace d'administration apparaîtront ici.</p>
                    </div>
                )}
            </div>

            {/* --- 3. CSS ANIMATION --- */}
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