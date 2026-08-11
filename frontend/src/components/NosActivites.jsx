import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Sprout, Users, 
  Coins, Network, ArrowRight, Sparkles 
} from 'lucide-react';

const NosActivites = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activites = [
    {
      id: "01",
      title: "Groupes de Solidarité (GS)",
      subtitle: "L'Humain au cœur du système",
      icon: <Users size={22} className="text-sky-600" />,
      img: "/GS.jpg",
      desc: "La base de l'Action Tsinjo Aina repose sur la constitution de groupes informels soudés par la confiance.",
      details: "Pour fonctionner efficacement, chaque Groupe de Solidarité (GS) se structure en désignant trois responsables : un(e) Président(e), un(e) Trésorier(e) et un(e) Secrétaire, élus de manière ouverte et transparente. Cette organisation minimale est indispensable pour accomplir les tâches spécifiques du groupe, bien que les responsables ne disposent d'aucune prérogative particulière, assumant simplement des responsabilités supplémentaires dans l'intérêt de tous. Le GS sert ainsi de cellule de base pour l'apprentissage de la démocratie directe, où chaque membre peut s'exprimer lors de débats collectifs visant à atteindre un consensus sain pour la prise de décision. Ce fonctionnement est encadré par un Règlement Intérieur (RI) établi dès la création, qui définit les choix du groupement et évolue progressivement selon la maturation et les progrès des membres.",
      points: ["Solidarité et confiance", "Décisions par consensus", "Équilibre hommes/femmes", "Règlement évolutif"],
      badgeBg: "bg-sky-100/80 text-sky-800 border-sky-200"
    },
    {
      id: "02",
      title: "Épargne et Crédit Interne",
      subtitle: "Autodéfense économique",
      icon: <Coins size={22} className="text-emerald-600" />,
      img: "/sary.jpg",
      desc: "L'épargne commune est l'arme principale de libération des membres face aux usuriers.",
      details: "L'épargne commune constitue l'outil principal de libération et d'autodéfense des membres, pouvant prendre la forme d'argent ou de produits agricoles comme le riz, dont la valeur augmente stratégiquement durant la période de soudure. Pour garantir une inclusion totale, le groupement applique le principe fondamental « On suit le plus faible », ajustant le taux de cotisation pour permettre aux membres les plus nécessiteux de participer activement. Cette épargne permet d'octroyer des crédits internes strictement réservés aux besoins vitaux tels que la nourriture, la santé ou l'écolage ainsi qu'à l'achat de semences, offrant ainsi une alternative concrète pour éviter le recours aux usuriers. Afin de protéger les plus vulnérables, la gestion est encadrée par un plafond d'emprunt garantissant l'équité, des délais de remboursement réalistes et un taux d'intérêt nul ou très modeste",
      points: ["Épargne en riz ou argent", "Lutte contre l'usure", "Inclusion des vulnérables", "Gestion rigoureuse"],
      badgeBg: "bg-emerald-100/80 text-emerald-800 border-emerald-200"
    },
    {
      id: "03",
      title: "Agroécologie et Souveraineté",
      subtitle: "Produire pour nourrir sainement",
      icon: <Sprout size={22} className="text-emerald-600" />,
      img: "/AGRO.jpg",
      desc: "Nous formons les membres aux bases de l'agroécologie pour augmenter la production familiale.",
      details: "L'agroécologie au sein de l'ONG Tsinjo Aina vise à transformer la précarité en souveraineté alimentaire en agissant directement sur les charges d'exploitation et la qualité de la nutrition des familles. Au cœur de cette démarche, les membres apprennent à fabriquer du compost et à installer des haies vives pour fertiliser et protéger leurs terres à moindre coût. L'action se concentre également sur la création de banques de semences communautaires et l'augmentation de la diversité des variétés locales disponibles, ce qui permet aux paysans de s'affranchir des intrants coûteux et de garantir une alimentation saine et durable pour leurs foyers. Cette souveraineté est renforcée par des formations spécifiques sur le changement climatique et la gestion familiale, permettant aux bénéficiaires de maîtriser leur production sur le long terme.",
      points: ["Compostage & Haies vives", "Multiplication & Conservation des semences", "Éducation nutritionnelle", "Adaptation au climat"],
      badgeBg: "bg-emerald-100/80 text-emerald-800 border-emerald-200"
    },
    {
      id: "04",
      title: "Réseautage et Plaidoyer",
      subtitle: "Une voix pour les exclus",
      icon: <Network size={22} className="text-sky-600" />,
      img: "/plaidoyer.jpg",
      desc: "Le Réseau Tsinjo Aina regroupe les GS pour porter des plaidoyers au niveau communal.",
      details: "Le réseautage au sein de l'Action Tsinjo Aina s'organise à travers des plates-formes informelles au niveau des Fokontany, permettant aux groupements de proximité de se concerter régulièrement pour renforcer leur autonomie et atteindre le désendettement. Ces rencontres, qui favorisent l'échange et le conseil mutuel, servent de base à un plaidoyer structuré où les membres intègrent les Structures Locales de Concertation (SLC) pour porter leurs revendications auprès des autorités. Cette dynamique collective permet de définir des priorités d'action commune, telles que la défense des droits civiques, la sécurisation foncière, l'accès à l'eau potable et l'agriculture adaptée, transformant ainsi le réseau en un véritable levier d'influence pour l'accès aux services de base et le développement local.",
      points: ["Conseils entre groupes", "Plaidoyer citoyen", "Sécurisation foncière", "Diagnostic participatif"],
      badgeBg: "bg-sky-100/80 text-sky-800 border-sky-200"
    }
  ];

  return (
    <main className="bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-100 min-h-screen font-sans text-slate-900 selection:bg-sky-500 selection:text-white">
      
      {/* --- HERO SECTION COMPACT --- */}
      <div className="relative py-16 md:py-20 bg-slate-950 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <div className="slideshow-infinite">
            <div className="slide-item" style={{ backgroundImage: "url('/GS.jpg')" }}></div>
            <div className="slide-item" style={{ backgroundImage: "url('/Formation.jpg')" }}></div>
            <div className="slide-item" style={{ backgroundImage: "url('/Dvpmt.JPG')" }}></div>
            <div className="slide-item" style={{ backgroundImage: "url('/Epargne.jpg')" }}></div>
          </div>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center space-x-2 text-sky-400 hover:text-white mb-4 transition-colors bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-sky-500/20 backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Retour</span>
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Nos Domaines d'Action
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            NOS <span className="text-sky-400">ACTIVITÉS.</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-sm md:text-base font-normal leading-relaxed border-l-2 border-sky-400 pl-3">
            Transformer la précarité en souveraineté à travers l'effort propre et la solidarité communautaire.
          </p>
        </div>
      </div>

      {/* --- CONTENT SECTION COMPACT --- */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="space-y-10 max-w-6xl mx-auto">
          {activites.map((item, index) => (
            <article 
              key={item.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 lg:gap-8 items-center bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-white hover:border-sky-200 transition-all duration-300 group`} 
            > 
              {/* IMAGE */}
              <div className="w-full lg:w-5/12 relative">
                <div className="relative overflow-hidden rounded-2xl shadow-md h-[280px] md:h-[320px] bg-slate-100 border border-slate-200/60">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-black tracking-widest border border-white/10">
                    {item.id}
                  </div>
                  <div className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-md">
                    {item.icon}
                  </div>
                </div>
              </div>

              {/* TEXT */}
              <div className="w-full lg:w-7/12 space-y-3">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border mb-2 ${item.badgeBg}`}>
                    {item.subtitle}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {item.title}
                  </h2>
                </div>
                
                <div className="space-y-2 text-slate-700">
                  <p className="text-sm font-bold text-slate-900 leading-snug">{item.desc}</p>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-600 text-justify">{item.details}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
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

      {/* --- FORMATION LIST COMPACT --- */}
      <section className="bg-white/60 backdrop-blur-sm py-10 border-y border-slate-200/60">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em]">Programmes</span>
            <h3 className="text-lg font-black text-slate-900 uppercase">Domaines de Formation</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Gestion Simplifiée", "Agroécologie", "Genre", "Nutrition", "Plaidoyer", "Climat"].map((f, i) => (
              <div key={i} className="px-4 py-2 bg-white border border-slate-200 text-[11px] font-bold text-slate-700 uppercase rounded-xl shadow-2xs hover:border-sky-500 hover:text-sky-600 transition-colors">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION COMPACT --- */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800 max-w-5xl mx-auto">
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[10px] font-bold uppercase tracking-widest">
              Engagement
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">Bâtissons l'autonomie.</h2>
            <p className="text-slate-300 text-xs md:text-sm font-normal">
              Nous ciblons les personnes les plus démunies pour transformer l'exclusion en force collective durable.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-sky-500 text-slate-950 px-8 py-3.5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white transition-all rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <span>Travailler avec nous</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CSS SYSTEME SEAMLESS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slideshow-infinite {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .slide-item {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          animation: crossFadeLoop 16s infinite ease-in-out;
        }

        .slide-item:nth-child(1) { animation-delay: 0s; }
        .slide-item:nth-child(2) { animation-delay: 4s; }
        .slide-item:nth-child(3) { animation-delay: 8s; }
        .slide-item:nth-child(4) { animation-delay: 12s; }

        @keyframes crossFadeLoop {
          0% { opacity: 0; }
          5% { opacity: 1; }   
          25% { opacity: 1; }  
          30% { opacity: 0; }  
          100% { opacity: 0; }
        }
      `}} />
    </main>
  );
};

export default NosActivites;