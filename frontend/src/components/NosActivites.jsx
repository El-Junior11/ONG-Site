import React from 'react';
import { 
  CheckCircle2, Sprout, Users, Coins, Network, ArrowRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NosActivites = () => {
  const activites = [
    {
      id: "01",
      title: "Groupes de Solidarité (GS)",
      subtitle: "L'Humain au cœur du système",
      icon: <Users size={22} className="text-[var(--sky)]" />,
      img: "/GS.jpg",
      desc: "La base de l'Action Tsinjo Aina repose sur la constitution de groupes informels soudés par la confiance.",
      details: "Pour fonctionner efficacement, chaque Groupe de Solidarité (GS) se structure en désignant trois responsables : un(e) Président(e), un(e) Trésorier(e) et un(e) Secrétaire, élus de manière ouverte et transparente. Cette organisation minimale est indispensable pour accomplir les tâches spécifiques du groupe, bien que les responsables ne disposent d'aucune prérogative particulière, assumant simplement des responsabilités supplémentaires dans l'intérêt de tous. Le GS sert ainsi de cellule de base pour l'apprentissage de la démocratie directe, où chaque membre peut s'exprimer lors de débats collectifs visant à atteindre un consensus sain pour la prise de décision. Ce fonctionnement est encadré par un Règlement Intérieur (RI) établi dès la création, qui définit les choix du groupement et évolue progressivement selon la maturation et les progrès des membres.",
      points: ["Solidarité et confiance", "Décisions par consensus", "Équilibre hommes/femmes", "Règlement évolutif"],
      badgeColor: "bg-[var(--sky-ice)] text-[var(--sky-deep)] border-[var(--sky)]/25"
    },
    {
      id: "02",
      title: "Épargne et Crédit Interne",
      subtitle: "Autodéfense économique",
      icon: <Coins size={22} className="text-[var(--leaf)]" />,
      img: "/Epargne.JPG",
      desc: "L'épargne commune est l'arme principale de libération des membres face aux usuriers.",
      details: "L'épargne commune constitue l'outil principal de libération et d'autodéfense des membres, pouvant prendre la forme d'argent ou de produits agricoles comme le riz, dont la valeur augmente stratégiquement durant la période de soudure. Pour garantir une inclusion totale, le groupement applique le principe fondamental « On suit le plus faible », ajustant le taux de cotisation pour permettre aux membres les plus nécessiteux de participer activement. Cette épargne permet d'octroyer des crédits internes strictement réservés aux besoins vitaux tels que la nourriture, la santé ou l'écolage ainsi qu'à l'achat de semences, offrant ainsi une alternative concrète pour éviter le recours aux usuriers. Afin de protéger les plus vulnérables, la gestion est encadrée par un plafond d'emprunt garantissant l'équité, des délais de remboursement réalistes et un taux d'intérêt nul ou très modeste.",
      points: ["Épargne en riz ou argent", "Lutte contre l'usure", "Inclusion des vulnérables", "Gestion rigoureuse"],
      badgeColor: "bg-[var(--leaf-ice)] text-[var(--leaf-deep)] border-[var(--leaf)]/25"
    },
    {
      id: "03",
      title: "Agroécologie et Souveraineté",
      subtitle: "Produire pour nourrir sainement",
      icon: <Sprout size={22} className="text-[var(--leaf)]" />,
      img: "/Produit.jpg",
      desc: "Nous formons les membres aux bases de l'agroécologie pour augmenter la production familiale.",
      details: "L'agroécologie au sein de l'ONG Tsinjo Aina vise à transformer la précarité en souveraineté alimentaire en agissant directement sur les charges d'exploitation et la qualité de la nutrition des familles. Au cœur de cette démarche, les membres apprennent à fabriquer du compost et à installer des haies vives pour fertiliser et protéger leurs terres à moindre coût. L'action se concentre également sur la création de banques de semences communautaires et l'augmentation de la diversité des variétés locales disponibles, ce qui permet aux paysans de s'affranchir des intrants coûteux et de garantir une alimentation saine et durable pour leurs foyers. Cette souveraineté est renforcée par des formations spécifiques sur le changement climatique et la gestion familiale, permettant aux bénéficiaires de maîtriser leur production sur le long terme.",
      points: ["Compostage & Haies vives", "Multiplication & Conservation", "Éducation nutritionnelle", "Adaptation au climat"],
      badgeColor: "bg-[var(--leaf-ice)] text-[var(--leaf-deep)] border-[var(--leaf)]/25"
    },
    {
      id: "04",
      title: "Réseautage et Plaidoyer",
      subtitle: "Une voix pour les exclus",
      icon: <Network size={22} className="text-[var(--sky)]" />,
      img: "/reseau.JPG",
      desc: "Le Réseau Tsinjo Aina regroupe les GS pour porter des plaidoyers au niveau communal.",
      details: "Le réseautage au sein de l'Action Tsinjo Aina s'organise à travers des plates-formes informelles au niveau des Fokontany, permettant aux groupements de proximité de se concerter régulièrement pour renforcer leur autonomie et atteindre le désendettement. Ces rencontres, qui favorisent l'échange et le conseil mutuel, servent de base à un plaidoyer structuré où les membres intègrent les Structures Locales de Concertation (SLC) pour porter leurs revendications auprès des autorités. Cette dynamique collective permet de définir des priorités d'action commune, telles que la défense des droits civiques, la sécurisation foncière, l'accès à l'eau potable et l'agriculture adaptée, transformant ainsi le réseau en un véritable levier d'influence pour l'accès aux services de base et le développement local.",
      points: ["Conseils entre groupes", "Plaidoyer citoyen", "Sécurisation foncière", "Diagnostic participatif"],
      badgeColor: "bg-[var(--sky-ice)] text-[var(--sky-deep)] border-[var(--sky)]/25"
    }
  ];

  return (
    <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">

      {/* SECTION 1: En-tête des activités */}
      <section className="pt-10 pb-6 md:pt-12 md:pb-8 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-end text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--leaf-ice)] text-[var(--leaf-deep)] font-mono-label font-bold text-xs uppercase tracking-[0.3em] rounded-full border border-[var(--leaf)]/25">
              <Sparkles size={14} /> Nos domaines d'action
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[var(--ink)] tracking-tight leading-[1.05]">
              Nos <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">Activités</span>
            </h1>
          </div>

          <p
            className="text-[var(--ink-soft)] text-base md:text-lg font-body leading-relaxed pl-5 py-1"
            style={{ borderLeft: '4px solid var(--sky)' }}
          >
            Transformer la précarité en souveraineté à travers l'effort propre et la solidarité communautaire.
          </p>
        </div>
      </section>

      {/* SECTION 2: Liste des activités détaillées */}
      <section className="py-4 md:py-6 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {activites.map((item, index) => (
            <article
              key={item.id}
              className={`group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] hover:shadow-[0_16px_40px_rgba(11,79,134,0.12)] transition-shadow duration-300 overflow-hidden`}
            >
              <div className="w-full lg:w-5/12 relative min-h-[240px] lg:min-h-full">
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 bg-[var(--ink)]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono-label font-bold tracking-widest border border-white/10">
                  {item.id}
                </div>
                <div className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-[var(--paper-line)]">
                  {item.icon}
                </div>
              </div>

              <div className="w-full lg:w-7/12 p-6 md:p-8 space-y-4 text-left">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono-label font-bold uppercase tracking-[0.2em] border mb-2 ${item.badgeColor}`}>
                    {item.subtitle}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight">
                    {item.title}
                  </h2>
                </div>

                <div className="space-y-2 text-[var(--ink-soft)]">
                  <p className="text-sm md:text-base font-bold text-[var(--ink)] leading-snug">{item.desc}</p>
                  <p className="text-sm leading-relaxed">{item.details}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 bg-[var(--paper)] px-3 py-2.5 rounded-xl border border-[var(--paper-line)] hover:border-[var(--sky-bright)] transition-colors">
                      <CheckCircle2 size={16} className="text-[var(--leaf)] shrink-0" />
                      <span className="text-[11px] font-mono-label font-semibold text-[var(--ink)] uppercase tracking-tight">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 3: Domaines de Formation */}
      <section className="py-6 md:py-8 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_4px_24px_rgba(11,79,134,0.06)] px-6 md:px-8 py-5">
          <div className="text-center md:text-left">
            <span className="text-[var(--sky)] font-mono-label font-bold text-xs uppercase tracking-[0.3em]">Programmes</span>
            <h3 className="text-xl md:text-2xl font-display font-extrabold text-[var(--ink)] tracking-tight">Domaines de Formation</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Gestion Simplifiée", "Agroécologie", "Genre", "Nutrition", "Plaidoyer", "Climat"].map((f, i) => (
              <div key={i} className="px-4 py-2 bg-[var(--paper)] border border-[var(--paper-line)] text-xs font-mono-label font-semibold text-[var(--ink)] uppercase rounded-full hover:border-[var(--sky)] hover:bg-[var(--sky-ice)] transition-colors">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Appel à l'action */}
      <section className="pt-2 pb-10 md:pb-12 text-center container mx-auto px-6">
        <div className="bg-gradient-to-br from-[var(--leaf-deep)] via-[var(--leaf)] to-[var(--leaf)] rounded-[2rem] p-7 md:p-10 text-white relative overflow-hidden border-t-4 border-[var(--sky-bright)] shadow-2xl shadow-[var(--leaf-deep)]/20">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--sky-bright)]/20 blur-3xl" aria-hidden="true"></div>

          <div className="max-w-2xl mx-auto relative z-10 space-y-3">
            <span className="text-[var(--paper)] font-mono-label font-bold text-[10px] uppercase tracking-[0.4em]">Engagement</span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight">Bâtissons l'autonomie.</h2>
            <p className="text-white/85 font-mono-label font-semibold text-[10px] md:text-xs uppercase tracking-widest pb-2">
              Nous ciblons les personnes les plus démunies pour transformer l'exclusion en force collective.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 bg-[var(--sky)] text-white px-8 py-4 font-mono-label font-bold uppercase text-[11px] tracking-widest hover:bg-[var(--sky-deep)] hover:-translate-y-0.5 transition-all rounded-full shadow-lg shadow-black/20"
            >
              <span>Travailler avec nous</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default NosActivites;