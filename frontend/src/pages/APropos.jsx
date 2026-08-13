import React from 'react';
import { Target, Heart, ShieldCheck, Users, Sprout, Landmark, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const APropos = () => {
  return (
    <div className="bg-[var(--paper)] min-h-screen font-body text-[var(--ink)]">

      {/* --- 1. HERO & VISION (CIBLE DIRECTE) --- */}
      <section className="py-20 px-6 md:px-20 bg-[var(--paper)] border-b border-[var(--paper-line)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--leaf-ice)] text-[var(--leaf-deep)] font-mono-label font-bold text-xs uppercase tracking-[0.3em] rounded-full border border-[var(--leaf)]/25">
              <Sparkles size={14} /> Qui sommes-nous
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--ink)] tracking-tight leading-tight">
              Soutenir les <span className="text-[var(--leaf)]">plus démunis</span>
            </h1>
            <div className="space-y-4 text-[var(--ink-soft)] text-base font-body leading-relaxed border-l-2 pl-6 text-justify bg-[var(--paper-tint)] py-5 rounded-r-xl border border-[var(--paper-line)]" style={{ borderLeftColor: 'var(--sky)', borderLeftWidth: '3px' }}>
              <p>L’action de Tsinjo Aina s’oriente prioritairement vers les personnes les plus vulnérables et marginalisées: celles privées de terres et de moyens de production, les personnes âgées, ainsi que celles vivant avec un handicap physique ou mental. Ces groupes, souvent laissés de côté par les circuits classiques du développement, rencontrent de profondes difficultés pour accéder aux ressources naturelles indispensables à leur survie.</p>
              <p>Pour rompre ce cercle d’exclusion, l’organisation les intègre dans des Groupes de Solidarité (GS), fondés sur une règle d’inclusion radicale: « suivre le plus faible ». Concrètement, la progression collective s’adapte au rythme des membres les plus fragiles, garantissant que personne ne soit abandonné en chemin.</p>
              <p>À travers cette démarche, Tsinjo Aina transforme ces bénéficiaires en citoyens responsables, capables de gérer leur propre effort et de construire leur autonomie. Les objectifs sont clairs: sortir du cycle de l’endettement auprès des usuriers, atteindre la souveraineté alimentaire grâce à l’agroécologie, et obtenir une pleine reconnaissance civique au sein des instances locales de décision.</p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/hero.jpg" 
              alt="Fivorian'ny GS"  
              className="rounded-2xl w-full h-[450px] md:h-[550px] object-cover border border-[var(--paper-line)] shadow-sm" 
            />
          </div>
        </div>
      </section>

      {/* --- 2. LE GROUPE DE SOLIDARITÉ (LA MÉTHODOLOGIE) --- */}
      <section className="py-20 px-6 md:px-20 bg-[var(--paper-tint)] border-b border-[var(--paper-line)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-6 text-left">
            <span className="text-[var(--sky)] font-mono-label font-bold text-xs uppercase tracking-[0.3em]">Méthodologie</span>
            <h3 className="text-3xl font-display font-bold text-[var(--ink)] tracking-tight flex items-center gap-3">
              <Users className="text-[var(--sky)] shrink-0" size={30} /> Démocratie Directe
            </h3>
            <div className="space-y-4 text-[var(--ink-soft)] text-base font-body leading-relaxed text-justify">
              <p> Au sein des Groupes de Solidarité (GS), la démocratie directe s’exprime à travers une organisation horizontale. Chaque groupement devient une cellule d’apprentissage citoyen, où tous les membres disposent d’un droit égal de parole et d’influence sur les décisions collectives. Contrairement aux systèmes classiques fondés sur le vote majoritaire, les résolutions émergent d’un processus exigeant de débat approfondi, visant toujours l’obtention d’un consensus. Ainsi, chaque décision est portée par l’ensemble des participants.</p>
              <p>Cette structure est coordonnée par un bureau permanent – président, trésorier et secrétaire – élu de manière ouverte et transparente. Ces responsables n’exercent aucun pouvoir hiérarchique: leur rôle est exclusivement de service, au bénéfice du collectif.</p>
              <p>Enfin, cette démocratie se veut résolument inclusive grâce au principe du « suivre le plus faible ». Le rythme de progression et les règles du groupe s’ajustent en fonction de sa maturité, afin de protéger et d’intégrer pleinement les membres les plus démunis ou marginalisés.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-xl border border-[var(--paper-line)]">
                <h4 className="font-display font-bold text-[var(--sky-deep)] text-xs uppercase mb-1 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[var(--sky)]" /> Bureau Permanent
                </h4>
                <p className="text-[11px] font-mono-label text-[var(--ink-soft)] uppercase font-semibold">Élu ouvertement : Président, Trésorier, Secrétaire.</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[var(--paper-line)]">
                <h4 className="font-display font-bold text-[var(--leaf-deep)] text-xs uppercase mb-1 flex items-center gap-2">
                  <Heart size={16} className="text-[var(--leaf)]" /> Inclusion Totale
                </h4>
                <p className="text-[11px] font-mono-label text-[var(--ink-soft)] uppercase font-semibold italic">« On suit le plus faible »</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <img  
              src="/Ensbl.jpg"  
              alt="Equipe Tsinjo Aina"  
              className="rounded-2xl w-full h-[450px] md:h-[550px] object-cover border border-[var(--paper-line)] shadow-sm" 
            />
          </div>
        </div>
      </section>

      {/* --- 3. NOTRE HISTOIRE, VISION & VALEURS --- */}
      <section className="py-20 px-6 md:px-20 bg-[var(--paper)] border-b border-[var(--paper-line)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* HISTOIRE & VISION */}
            <div className="space-y-12 text-left">
              <div className="space-y-4">
                <span className="text-[var(--leaf)] font-mono-label font-bold text-xs uppercase tracking-[0.3em]">Parcours</span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--ink)] tracking-tight border-l-2 border-[var(--leaf)] pl-4">
                  Notre Histoire
                </h3>
                <div className="text-base font-body text-[var(--ink-soft)] leading-relaxed font-normal space-y-4 text-justify bg-[var(--paper-tint)] p-6 rounded-xl border border-[var(--paper-line)]">
                  <p>
                    Le Projet Fianarantsoa a vu le jour en 1998, dans la partie sud de la région, à Ambalavao, sous la forme d’une initiative individuelle. Rapidement, il s’est étendu vers le nord en 2001 puis en 2003, amorçant une dynamique de croissance continue. En 2009, pour soutenir et structurer cette démarche, l’Association Tsinjo Aina Betsileo a été fondée. Quelques années plus tard, en décembre 2016, elle a évolué pour devenir l’ONG TSINJO AINA Fianarantsoa.
                  </p>
                  <p>
                    Aujourd’hui, l’organisation accompagne directement près de 25000 bénéficiaires, dont 11800 femmes, et touche indirectement plus de 58400 personnes supplémentaires. Sa mission est d’améliorer les conditions de vie et de renforcer l’autonomie des communautés locales, en particulier des femmes, à travers des projets sociaux, économiques et environnementaux.
                  </p>
                  <p>
                    L’approche adoptée repose sur la mobilisation des efforts communautaires: encourager les groupes à concevoir et gérer leurs propres initiatives de développement durable. L’ONG œuvre également à raviver la solidarité communautaire, une valeur profondément enracinée dans l’histoire Malagasy mais qui s’est progressivement effritée. Elle met l’accent sur le renforcement des capacités, l’acquisition de compétences et la sensibilisation, afin de promouvoir un développement à la fois durable et souverain.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--ink)] tracking-tight border-l-2 border-[var(--ink)] pl-4">
                  Nos Fondements
                </h3>
                <div className="space-y-4 text-base font-body text-[var(--ink-soft)] bg-[var(--paper-tint)] p-6 rounded-xl border border-[var(--paper-line)] text-justify">
                  <p className="leading-relaxed">
                    <strong className="font-display font-bold uppercase text-xs block mb-1 text-[var(--sky)]">Vision :</strong> 
                    Faire de chaque bénéficiaire un citoyen responsable, prenant en main son développement et vivant en harmonie dans une société équitable.
                  </p>
                  <hr className="border-[var(--paper-line)]" />
                  <p className="leading-relaxed">
                    <strong className="font-display font-bold uppercase text-xs block mb-1 text-[var(--leaf)]">Mission :</strong> 
                    Œuvrer pour le développement humain durable, l’autopromotion des communautés et la protection de l’environnement.
                  </p>
                  <hr className="border-[var(--paper-line)]" />
                  <p className="leading-relaxed">
                    <strong className="font-display font-bold uppercase text-xs block mb-1 text-[var(--gold)]">Nos valeurs :</strong> 
                    Notre action est guidée par le développement par l'effort propre, la volonté de ne laisser personne de côté et une approche stricte sans aucune discrimination.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative sticky top-24">
              <div className="rounded-2xl overflow-hidden border border-[var(--paper-line)] shadow-sm bg-white">
                <img 
                  src="/histoire.jpg" 
                  alt="Action de l'ONG Tsinjo Aina" 
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-16 text-center container mx-auto px-6">
        <div className="bg-[var(--ink)] rounded-2xl p-10 md:p-16 text-white relative overflow-hidden border-t-4 border-[var(--leaf)]">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-[var(--leaf-bright)] font-mono-label font-bold text-xs uppercase tracking-[0.4em]">Engagement</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight italic">« Effort Propre & Solidarité »</h2>
            <p className="text-white/70 font-mono-label font-semibold text-xs md:text-sm uppercase tracking-widest pb-4">
              Rejoignez-nous pour un développement humain durable.
            </p>
            <Link 
              to="/activites" 
              className="inline-flex items-center gap-3 bg-[var(--leaf)] text-white px-8 py-4 font-mono-label font-bold uppercase text-xs tracking-widest hover:bg-[var(--leaf-deep)] transition-colors rounded-lg shadow-sm"
            >
              <span>Voir nos activités</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default APropos;