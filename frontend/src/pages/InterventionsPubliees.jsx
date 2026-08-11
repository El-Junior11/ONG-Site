import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, ArrowRight, X, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

const InterventionsPubliees = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const API_URL = 'http://localhost:5000/api/interventions';

    // Famakiana data avy ao amin'ny Backend (Mode Vitrine)
    useEffect(() => {
        const fetchPublishedData = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    // Sivanina mba izay voasivana hoe "is_published: true" ihany no hivoaka amin'ny site vitrine
                    const published = data.filter(item => item.is_published === true);
                    setInterventions(published);
                } else {
                    console.error("Erreur lors de la récupération des interventions");
                }
            } catch (err) {
                console.error("Erreur de connexion au serveur backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedData();
    }, []);

    // Fiarovana raha mikatona ny modal (Esc key)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSelectedItem(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--paper)]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--sky)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--sky)] font-mono-label font-bold text-[10px]">Chargement</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--paper)] min-h-screen pb-24 font-body text-[var(--ink)]">
            {/* HERO SECTION - DESIGN SITE VITRINE MAODERINA */}
            <div className="relative w-full py-32 px-6 text-center overflow-hidden border-b border-[var(--paper-line)] bg-white">
                {/* Background Image miaraka amin'ny Overlay maivana kanto */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/Interv.jpg" 
                        alt="Background Interventions" 
                        className="w-full h-full object-cover scale-105 opacity-15 blur-[2px]"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1600&fit=crop"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-[var(--paper)]"></div>
                </div>

                {/* Content Hero */}
                <div className="relative z-20 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sky-ice)] border border-[var(--paper-line)] text-[var(--sky)] text-xs font-mono-label font-bold uppercase tracking-widest mb-6 shadow-sm">
                        <Sparkles size={14} /> Nos Actions Humanitaires
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight text-[var(--ink)]">
                        Nos Interventions sur le Terrain
                    </h1>
                    <p className="text-[var(--ink-soft)] max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Découvrez l'impact concret de nos actions, nos projets réalisés et notre engagement continu auprès des communautés locales.
                    </p>
                </div>
            </div>

            {/* GRID DES INTERVENTIONS */}
            <div className="max-w-7xl mx-auto px-6 pt-16">
                {interventions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                <div 
                                    key={item.id} 
                                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(11,79,134,0.06)] border border-[var(--paper-line)] hover:border-[var(--sky)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col h-full"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-72 overflow-hidden bg-[var(--paper-line)]">
                                        <img 
                                            src={mainImage} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                        
                                        <div className="absolute top-5 left-5">
                                            <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-mono-label font-black text-[var(--sky)] border border-[var(--paper-line)] uppercase tracking-widest shadow-sm">
                                                Réalisé
                                            </span>
                                        </div>

                                        {extraCount > 0 && (
                                            <div className="absolute bottom-5 right-5">
                                                <div className="flex items-center gap-1.5 bg-[var(--sky)] backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-mono-label font-bold text-white shadow-lg">
                                                    <ImageIcon size={14} />
                                                    <span>+{extraCount}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex flex-col flex-grow text-left">
                                        <div className="flex items-center gap-2 text-[var(--sky)] mb-3">
                                            <div className="p-1.5 bg-[var(--sky-ice)] rounded-lg border border-[var(--paper-line)]">
                                                <MapPin size={14} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-xs font-mono-label font-bold uppercase tracking-wider">{item.location || 'Localisation non spécifiée'}</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-display font-extrabold text-[var(--ink)] mb-3 line-clamp-2 leading-tight group-hover:text-[var(--sky)] transition-colors">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-[var(--ink-soft)] font-normal leading-relaxed mb-6 line-clamp-3 text-sm">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-[var(--paper-line)] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[var(--ink-soft)] text-xs font-medium">
                                                <Calendar size={14} />
                                                <span>
                                                    {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--sky)] font-mono-label font-bold text-sm group-hover:gap-2 transition-all">
                                                <span>Voir plus</span>
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-[var(--paper-line)] px-6 shadow-sm">
                        <div className="bg-[var(--paper)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--paper-line)]">
                            <Layers className="text-[var(--ink-soft)]" size={32} />
                        </div>
                        <h3 className="text-xl font-display font-extrabold text-[var(--ink)] mb-2">Aucune intervention publiée</h3>
                        <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mt-1">Revenez un peu plus tard pour découvrir nos nouveaux projets.</p>
                    </div>
                )}
            </div>

            {/* MODAL / DETAILS POPUP */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[var(--ink)]/40 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    <div 
                        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[var(--paper-line)] flex flex-col relative text-[var(--ink)] text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-6 right-6 z-50 p-3 bg-[var(--paper)] hover:bg-[var(--sky)] hover:text-white text-[var(--ink-soft)] rounded-2xl transition-all shadow-md border border-[var(--paper-line)] group"
                        >
                            <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="overflow-y-auto p-8 md:p-12">
                            <div className="flex items-center gap-2 text-[var(--sky)] mb-3">
                                <MapPin size={18} strokeWidth={2.5} />
                                <span className="font-mono-label font-bold uppercase tracking-widest text-xs">{selectedItem.location}</span>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[var(--ink)] mb-8 leading-tight">
                                {selectedItem.title}
                            </h2>
                            
                            {/* Gallery Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {(Array.isArray(selectedItem.image) 
                                    ? selectedItem.image 
                                    : (typeof selectedItem.image === 'string' && selectedItem.image.startsWith('[') 
                                        ? JSON.parse(selectedItem.image) 
                                        : [selectedItem.image])
                                ).filter(Boolean).map((img, idx) => (
                                    <div key={idx} className="relative rounded-3xl overflow-hidden h-72 bg-[var(--paper)] border border-[var(--paper-line)] shadow-inner">
                                        <img 
                                            src={img} 
                                            alt="Intervention zoom" 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--paper)] p-6 md:p-8 rounded-3xl border border-[var(--paper-line)] mb-6">
                                <h4 className="text-lg font-display font-extrabold text-[var(--sky)] mb-4 flex items-center gap-3">
                                    <div className="w-6 h-1 bg-[var(--sky)] rounded-full"></div>
                                    À propos de ce projet
                                </h4>
                                <p className="text-[var(--ink-soft)] leading-relaxed text-base whitespace-pre-wrap font-normal">
                                    {selectedItem.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-[var(--paper-line)] flex flex-wrap items-center justify-between gap-4 text-[var(--ink-soft)] text-xs font-mono-label font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Publié le {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}</span>
                                </div>
                                <span className="bg-[var(--sky-ice)] px-3 py-1.5 rounded-xl text-[var(--sky)] border border-[var(--paper-line)]">
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