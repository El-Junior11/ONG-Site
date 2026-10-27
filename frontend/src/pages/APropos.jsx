import React from 'react';
import { Target, Heart, ShieldCheck, Users, Sprout, Landmark, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const APropos = () => {
  return (
    <div className="bg-[var(--paper)] font-body text-[var(--ink)] not-italic overflow-x-hidden">

      {/* SECTION 1: Qui sommes-nous */}
      <section className="pt-10 pb-3 md:pt-12 md:pb-4 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="space-y-3 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--leaf-ice)] text-[var(--leaf-deep)] font-mono-label font-bold text-xs uppercase tracking-[0.3em] rounded-full border border-[var(--leaf)]/25">
              <Sparkles size={14} /> Qui sommes-nous
            </span>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[var(--ink)] tracking-tight leading-[1.05]">
              Soutenir les <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">plus démunis</span>
            </h1>
          </div>

          <article className="group flex flex-col lg:flex-row bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] hover:shadow-[0_16px_40px_rgba(11,79,134,0.12)] transition-shadow duration-300 overflow-hidden">
            <div className="w-full lg:w-5/12 relative min-h-[240px] lg:min-h-full">
              <img
                src="/Fivoriana.jpg"
                alt="Fivorian'ny GS"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            <div
              className="w-full lg:w-7/12 p-6 md:p-8 space-y-3 text-left text-[var(--ink-soft)] text-sm leading-relaxed"
              style={{ borderLeft: '4px solid var(--sky)' }}
            >
              <p>L’action de Tsinjo Aina s’oriente prioritairement vers les personnes les plus vulnérables et marginalisées : celles privées de terres et de moyens de production, les personnes âgées, ainsi que celles vivant avec un handicap physique ou mental. Ces groupes, souvent laissés de côté par les circuits classiques du développement, rencontrent de profondes difficultés pour accéder aux ressources naturelles indispensables à leur survie.</p>
              <p>Pour rompre ce cercle d’exclusion, l’organisation les intègre dans des Groupes de Solidarité (GS), fondés sur une règle d’inclusion radicale : « suivre le plus faible ». Concrètement, la progression collective s’adapte au rythme des membres les plus fragiles, garantissant que personne ne soit abandonné en chemin.</p>
              <p>À travers cette démarche, Tsinjo Aina transforme ces bénéficiaires en citoyens responsables, capables de gérer leur propre effort et de construire leur autonomie. Les objectifs sont clairs : sortir du cycle de l’endettement auprès des usuriers, atteindre la souveraineté alimentaire grâce à l’agroécologie, et obtenir une pleine reconnaissance civique au sein des instances locales de décision.</p>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 2: Méthodologie */}
      <section className="py-3 md:py-4 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <article className="group flex flex-col lg:flex-row-reverse bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] hover:shadow-[0_16px_40px_rgba(11,79,134,0.12)] transition-shadow duration-300 overflow-hidden">
            <div className="w-full lg:w-5/12 relative min-h-[240px] lg:min-h-full">
              <img
                src="/Dvpmt.jpg"
                alt="Equipe Tsinjo Aina"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            <div className="w-full lg:w-7/12 p-6 md:p-8 space-y-4 text-left">
              <div className="space-y-2">
                <span className="text-[var(--sky)] font-mono-label font-bold text-xs uppercase tracking-[0.3em]">Méthodologie</span>

                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--sky-ice)] shrink-0">
                    <Users className="text-[var(--sky)]" size={24} />
                  </span>
                  Démocratie Directe
                </h3>
              </div>

              <div className="space-y-3 text-[var(--ink-soft)] text-sm leading-relaxed">
                <p>Au sein des Groupes de Solidarité (GS), la démocratie directe s’exprime à travers une organisation horizontale. Chaque groupement devient une cellule d’apprentissage citoyen, où tous les membres disposent d’un droit égal de parole et d’influence sur les décisions collectives. Contrairement aux systèmes classiques fondés sur le vote majoritaire, les résolutions émergent d’un processus exigeant de débat approfondi, visant toujours l’obtention d’un consensus. Ainsi, chaque décision est portée par l’ensemble des participants.</p>
                <p>Cette structure est coordonnée par un bureau permanent – président, trésorier et secrétaire – élu de manière ouverte et transparente. Ces responsables n’exercent aucun pouvoir hiérarchique : leur rôle est exclusivement de service, au bénéfice du collectif.</p>
                <p>Enfin, cette démocratie se veut résolument inclusive grâce au principe du « suivre le plus faible ». Le rythme de progression et les règles du groupe s’ajustent en fonction de sa maturité, afin de protéger et d’intégrer pleinement les membres les plus démunis ou marginalisés.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-[var(--paper)] px-4 py-3 rounded-2xl border border-[var(--paper-line)] hover:border-[var(--sky-bright)] transition-colors">
                  <h4 className="font-display font-bold text-[var(--sky-deep)] text-sm uppercase mb-1 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[var(--sky)]" /> Bureau Permanent
                  </h4>
                  <p className="text-[11px] font-mono-label text-[var(--ink-soft)] uppercase font-semibold leading-snug">Élu ouvertement : Président, Trésorier, Secrétaire.</p>
                </div>

                <div className="bg-[var(--paper)] px-4 py-3 rounded-2xl border border-[var(--paper-line)] hover:border-[var(--leaf)] transition-colors">
                  <h4 className="font-display font-bold text-[var(--leaf-deep)] text-sm uppercase mb-1 flex items-center gap-2">
                    <Heart size={18} className="text-[var(--leaf)]" /> Inclusion Totale
                  </h4>
                  <p className="text-[11px] font-mono-label text-[var(--ink-soft)] uppercase font-semibold not-italic leading-snug">« On suit le plus faible »</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 3: Parcours & Fondements */}
      <section className="py-3 md:py-4 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto space-y-4">

          <article className="group flex flex-col lg:flex-row bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(36,92,52,0.06)] hover:shadow-[0_16px_40px_rgba(36,92,52,0.12)] transition-shadow duration-300 overflow-hidden">
            <div className="w-full lg:w-7/12 p-6 md:p-8 space-y-3 text-left order-2 lg:order-1">
              <span className="text-[var(--leaf)] font-mono-label font-bold text-xs uppercase tracking-[0.3em]">Parcours</span>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight border-l-4 border-[var(--leaf)] pl-4">
                Notre Histoire
              </h3>
              <div className="text-sm font-body text-[var(--ink-soft)] leading-relaxed font-normal space-y-3">
                <p>
                  Le Projet Fianarantsoa a vu le jour en 1998, dans la partie sud de la région, à Ambalavao, sous la forme d’une initiative individuelle. Rapidement, il s’est étendu vers le nord en 2001 puis en 2003, amorçant une dynamique de croissance continue. En 2009, pour soutenir et structurer cette démarche, l’Association Tsinjo Aina Betsileo a été fondée. Quelques années plus tard, en décembre 2016, elle a évolué pour devenir l’ONG TSINJO AINA Fianarantsoa.
                </p>
                <p>
                  Aujourd’hui, l’organisation accompagne directement près de 25 000 bénéficiaires, dont 11 800 femmes, et touche indirectement plus de 58 400 personnes supplémentaires. Sa mission est d’améliorer les conditions de vie et de renforcer l’autonomie des communautés locales, en particulier des femmes, à través des projets sociaux, économiques et environnementaux.
                </p>
                <p>
                  L’approche adoptée repose sur la mobilisation des efforts communautaires : encourager les groupes à concevoir et gérer leurs propres initiatives de développement durable. L’ONG œuvre également à raviver la solidarité communautaire, une valeur profondément enracinée dans l’histoire Malagasy mais qui s’est progressivement effritée. Elle met l’accent sur le renforcement des capacités, l’acquisition de compétences et la sensibilisation, afin de promouvoir un développement à la fois durable et souverain.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-5/12 relative min-h-[240px] lg:min-h-full order-1 lg:order-2">
              <img
                src="/histoire.jpg"
                alt="Action de l'ONG Tsinjo Aina"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </article>

          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight border-l-4 border-[var(--sky)] pl-4 text-left">
              Nos Fondements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] hover:shadow-[0_14px_32px_rgba(11,79,134,0.14)] hover:-translate-y-0.5 transition-all text-sm font-body text-[var(--ink-soft)] text-left">
                <p className="leading-relaxed">
                  <strong className="font-display font-bold uppercase text-xs block mb-1.5 tracking-wider text-[var(--sky)]">Vision :</strong>
                  Faire de chaque bénéficiaire un citoyen responsable, prenant en main son développement et vivant en harmonie dans une société équitable.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(36,92,52,0.06)] hover:shadow-[0_14px_32px_rgba(36,92,52,0.14)] hover:-translate-y-0.5 transition-all text-sm font-body text-[var(--ink-soft)] text-left">
                <p className="leading-relaxed">
                  <strong className="font-display font-bold uppercase text-xs block mb-1.5 tracking-wider text-[var(--leaf)]">Mission :</strong>
                  Œuvrer pour le développement humain durable, l’autopromotion des communautés et la protection de l’environnement.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(228,169,58,0.10)] hover:shadow-[0_14px_32px_rgba(228,169,58,0.18)] hover:-translate-y-0.5 transition-all text-sm font-body text-[var(--ink-soft)] text-left">
                <p className="leading-relaxed">
                  <strong className="font-display font-bold uppercase text-xs block mb-1.5 tracking-wider text-[var(--gold)]">Nos valeurs :</strong>
                  Notre action est guidée par le développement par l'effort propre, la volonté de ne laisser personne de côté et une approche stricte sans aucune discrimination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Appel à l'action */}
      <section className="pt-3 pb-10 md:pb-12 text-center container mx-auto px-6">
        <div className="bg-gradient-to-br from-[var(--leaf-deep)] via-[var(--leaf)] to-[var(--leaf)] rounded-[2rem] p-7 md:p-10 text-white relative overflow-hidden border-t-4 border-[var(--sky-bright)] shadow-2xl shadow-[var(--leaf-deep)]/20">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--sky-bright)]/20 blur-3xl" aria-hidden="true"></div>

          <div className="max-w-2xl mx-auto relative z-10 space-y-3">
            <span className="text-[var(--paper)] font-mono-label font-bold text-[10px] uppercase tracking-[0.4em]">Engagement</span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight not-italic">« Effort Propre & Solidarité »</h2>
            <p className="text-white/85 font-mono-label font-semibold text-[10px] md:text-xs uppercase tracking-widest pb-2">
              Rejoignez-nous pour un développement humain durable.
            </p>
            <Link
              to="/#activites"
              className="inline-flex items-center gap-2.5 bg-[var(--sky)] text-white px-8 py-4 font-mono-label font-bold uppercase text-[11px] tracking-widest hover:bg-[var(--sky-deep)] hover:-translate-y-0.5 transition-all rounded-full shadow-lg shadow-black/20"
            >
              <span>Voir nos activités</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default APropos;