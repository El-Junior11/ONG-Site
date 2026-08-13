import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Home, Info, Briefcase, Award, Mail, UserCircle, Menu, X, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

// --- PAGES ---
import Login from './Login';
import Dashboard from './Dashboard';
import InterventionList from './pages/InterventionList';
import APropos from './pages/APropos';
import NosActivites from './components/NosActivites';
import InterventionsPubliees from './pages/InterventionsPubliees';
import Realisations from './pages/Realisations';
import Contact from './pages/Contact';
import Parametres from './pages/Parametres';
import EventCalendar from './components/EventCalendar';
import './index.css';

const phrasesHero = [
  "ONG TSINJO AINA FIANARANTSOA",
  "Construisons l'avenir malagasy",
  "Engageons-nous pour le social",
  "Soutenons nos communautés"
];

// --- DESIGN TOKENS & FONTS (self-contained, does not touch index.css) ---
const DesignSystem = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

    :root{
      --ink:#0E1F16;
      --ink-soft:#3E5A47;
      --paper:#EEF7EC;
      --paper-light:#FFFFFF;
      --paper-line:#D7EAD1;
      --leaf-deep:#245C34;
      --leaf:#3C9A4E;
      --leaf-bright:#6FC96B;
      --leaf-ice:#E7F6E5;
      --sky-deep:#0B4F86;
      --sky:#1C86C9;
      --sky-bright:#38B6E6;
      --sky-ice:#E7F5FC;
      --gold:#E4A93A;
    }

    .font-display{ font-family:'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; }
    .font-body{ font-family:'Inter', ui-sans-serif, system-ui, sans-serif; }
    .font-mono-label{ font-family:'JetBrains Mono', ui-monospace, monospace; }

    ::selection{ background:var(--leaf); color:#fff; }
    *:focus-visible{ outline:2px solid var(--sky); outline-offset:3px; border-radius:4px; }

    ::-webkit-scrollbar{ width:10px; height:10px; }
    ::-webkit-scrollbar-track{ background:var(--paper); }
    ::-webkit-scrollbar-thumb{ background:var(--paper-line); border-radius:999px; }
    ::-webkit-scrollbar-thumb:hover{ background:var(--leaf); }

    @keyframes driftGlow{
      0%,100%{ transform:translate(0,0) scale(1); }
      50%{ transform:translate(-2%,3%) scale(1.06); }
    }
    .glow-blob{ animation:driftGlow 14s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce){
      *{ animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; scroll-behavior:auto !important; }
    }
  `}</style>
);

// --- SIGNATURE ELEMENT: canopy-line divider, echoes leaves / grass against the sky ---
const CanopyDivider = ({ flip = false, className = "" }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-x-0 ${flip ? 'top-0 -scale-y-100' : 'bottom-0'} h-16 md:h-24 overflow-hidden pointer-events-none z-10 ${className}`}
  >
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,70 C90,40 150,95 240,60 C330,25 400,90 480,55 C560,20 630,85 720,52 C810,20 880,88 970,58 C1050,32 1120,70 1200,50 L1200,120 L0,120 Z" fill="var(--paper)" />
      <path d="M0,58 C90,30 150,82 240,50 C330,18 400,78 480,45 C560,12 630,74 720,42 C810,10 880,76 970,48 C1050,24 1120,58 1200,40" fill="none" stroke="var(--leaf-bright)" strokeOpacity="0.4" strokeWidth="2" />
      <path d="M0,46 C90,20 150,68 240,38 C330,8 400,64 480,34 C560,4 630,60 720,30" fill="none" stroke="var(--sky-bright)" strokeOpacity="0.3" strokeWidth="2" />
    </svg>
  </div>
);

const TeamSection = () => {
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setTeamLoading(true);
        const mockTeam = [
          { id: 1, name: "Staff Dirigeant", role: "Président", img: "" },
          { id: 2, name: "Équipe Technique", role: "Coordinateur", img: "" }
        ];
        setTeam(mockTeam);
      } catch (err) {
        console.error("Error fetching team:", err.message);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (teamLoading) {
    return (
      <div className="py-20 text-center flex flex-col justify-center items-center bg-[var(--paper)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--leaf)] mb-4"></div>
        <p className="text-[var(--ink-soft)] font-mono-label font-semibold tracking-wider text-xs uppercase">Chargement de l'équipe...</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[var(--paper-light)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10 text-center md:text-left">
          <span className="text-[var(--leaf)] font-mono-label font-bold uppercase tracking-[0.3em] text-xs">Staff & Expertise</span>
          <h3 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight mt-1">
            Ceux qui font la <span className="bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">différence</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div 
              key={member.id}
              className="group bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(36,92,52,0.08)] hover:shadow-[0_12px_32px_rgba(36,92,52,0.16)] transition-all duration-300 border border-[var(--paper-line)] flex items-center gap-4 transform hover:-translate-y-1"
            >
              <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-[var(--leaf-ice)] ring-2 ring-[var(--leaf-bright)] ring-offset-2 ring-offset-white shadow-inner">
                <img 
                  src={member.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3C9A4E&color=fff`} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <h4 className="text-sm font-display font-bold text-[var(--ink)] tracking-tight leading-snug truncate">
                  {member.name}
                </h4>
                <p className="text-[10px] font-mono-label font-semibold text-[var(--leaf)] uppercase tracking-wider mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {team.length === 0 && (
          <div className="text-center py-8 bg-[var(--paper)] rounded-2xl border border-dashed border-[var(--paper-line)]">
            <p className="text-[var(--ink-soft)] font-mono-label font-medium text-xs uppercase tracking-widest">Aucun membre trouvé</p>
          </div>
        )}
      </div>
    </section>
  );
};

const ActivitiesHome = () => {
  const activities = [
    {
      id: "01",
      accent: "var(--sky)",
      title: "Les Groupes de Solidarités (GS)",
      desc: "Le Groupe de Solidarité (GS) représente l’espace central de participation citoyenne, où les membres exercent une démocratie directe garantissant à chacun la liberté de parole. Son fonctionnement repose sur trois piliers essentiels : l’information, la formation et l’accompagnement-conseil, qui soutiennent l’engagement des membres. Pour assurer une gestion transparente, le GS procède à l’élection ouverte d’un bureau permanent composé d’un président, d’un trésorier et d’un secrétaire, tous investis dans la défense de l’intérêt collectif. Les décisions majeures sont systématiquement prises en Assemblée Générale (AG), réunissant l’ensemble des membres.",
      details: ["Épargne commune (riz, argent)", "Crédits internes sans usuriers", "Principe 'On suit le plus faible'", "Gestion transparente par bureau élu"],
      img: "/GS.jpg", align: "flex-row"
    },
    {
      id: "02",
      accent: "var(--leaf)",
      title: "Formations & Production",
      desc: "Ce programme s’adresse en priorité aux personnes les plus vulnérables et marginalisées, confrontées à de fortes difficultés d’accès aux ressources naturelles indispensables à la production. L’appui repose sur une formation solide aux principes de l’agroécologie, renforcée par la mise à disposition de semences locales communautaires, garantissant l’autonomie et la diversité des cultures. Parallèlement, une éducation nutritionnelle valorise la production locale et favorise une alimentation saine et équilibrée pour toutes les familles. Enfin, des formations transversales portant sur la gestion du temps, l’égalité de genre et l’adaptation au changement climatique viennent compléter ce dispositif, afin de renforcer la résilience globale des bénéficiaires.",
      details: ["Bases de l'agroécologie", "Éducation nutritionnelle", "Genre & Climat", "Multiplication et conservation des semences locales"],
      img: "/form.jpg", align: "flex-row-reverse"
    },
    {
      id: "03",
      accent: "var(--gold)",
      title: "Les Réseaux",
      desc: "Le réseau constitue une véritable plateforme d’échange et de concertation entre les différents Groupes de Solidarité, leur permettant d’unir leurs forces pour relever les défis du développement local et progresser vers une autonomie durable. Une action stratégique clé réside dans l’intégration des membres au sein de la Structure Locale de Concertation (SLC), afin de renforcer le lobbying et le plaidoyer auprès des instances décisionnelles. Le réseau accompagne également ses membres dans l’élaboration et la présentation de plans de développement structurés aux autorités locales, contribuant ainsi à influencer les politiques publiques. Outre la défense des droits civiques, il encourage des initiatives communes visant à sécuriser l’accès aux ressources vitales telles que l’eau potable, le foncier et une agriculture durable. Enfin, ce mouvement consolide la solidarité entre les groupements, les positionnant comme des acteurs incontournables du progrès social et économique régional.",
      details: ["Lobbying & Plaidoyer (SLC)", "Défense des Droits Civiques", "Accès à l'eau & Foncier", "Planification locale"],
      img: "/Reseau.jpg", align: "flex-row"
    }
  ];

  return (
    <section className="py-20 bg-[var(--paper)] px-6 md:px-20 relative">
      <div className="container mx-auto">
        <div className="mb-16 text-left max-w-2xl">
          <span className="text-[var(--leaf)] font-mono-label font-bold text-xs uppercase tracking-[0.4em]">Piliers d'intervention</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--ink)] tracking-tighter mt-2">Notre méthodologie.</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] mt-4 rounded-full"></div>
        </div>

        <div className="space-y-24">
          {activities.map((item, index) => (
            <div key={index} className={`flex flex-col lg:items-center gap-10 md:gap-16 ${item.align === 'flex-row' ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <div className="w-full lg:w-1/2 overflow-hidden rounded-3xl shadow-xl shadow-[var(--leaf-deep)]/10 border border-[var(--paper-line)]">
                <img src={item.img} alt={item.title} className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full lg:w-1/2 space-y-6 text-left">
                <div className="relative">
                   <span className="text-7xl font-display font-extrabold absolute -top-10 -left-4 z-0" style={{ color: item.accent, opacity: 0.12 }}>{item.id}</span>
                   <h4 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight relative z-10">{item.title}</h4>
                </div>

                <p className="text-base text-[var(--ink-soft)] leading-relaxed border-l-4 pl-6 font-normal text-justify bg-white/70 py-4 rounded-r-xl" style={{ borderColor: item.accent }}>
                  {item.desc}
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-[var(--paper-line)]">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.accent }}></div>
                      <p className="text-xs text-[var(--ink)] font-mono-label font-bold uppercase tracking-tight leading-tight">
                        {detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApproachSection = () => (
  <div className="py-16 bg-gradient-to-b from-[var(--paper-light)] to-[var(--leaf-ice)] px-6 md:px-20 border-y border-[var(--paper-line)] relative overflow-hidden">
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <div className="space-y-6 text-left">
        <div>
          <span className="text-[var(--leaf)] font-mono-label font-bold text-xs tracking-[0.3em] uppercase">Philosophie</span>
          <h2 className="text-3xl font-display font-extrabold text-[var(--ink)] tracking-tighter mt-1">L'effort propre</h2>
        </div>
        <div className="space-y-4"> 
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(36,92,52,0.07)] border border-[var(--paper-line)] transition-all hover:shadow-[0_12px_28px_rgba(36,92,52,0.14)]">
              <p className="text-base font-display font-bold text-[var(--sky-deep)] mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[var(--sky)]" /> Épargne Collective
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)] text-justify">La mise en place d’une épargne collective constitue une réponse concrète pour briser le cycle de l’endettement. Les petites cotisations hebdomadaires se transforment en un capital communautaire géré de manière transparente. Ce fonds permet d’accorder des crédits internes à des taux équitables, offrant aux paysans la possibilité de se libérer de l’usure et de retrouver leur dignité ainsi qu’une véritable indépendance financière.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(36,92,52,0.07)] border border-[var(--paper-line)] transition-all hover:shadow-[0_12px_28px_rgba(36,92,52,0.14)]">
              <p className="text-base font-display font-bold text-[var(--leaf-deep)] mb-2 flex items-center gap-2">
                <HeartHandshake size={18} className="text-[var(--leaf)]" /> Inclusion Totale
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)] text-justify">Ce principe garantit que le rythme de progression de l'ensemble du groupe s'ajuste systématiquement sur les capacités des membres les plus vulnérables afin de ne laisser personne de côté. En plaçant l'humain avant la performance technique, cette approche renforce la cohésion sociale et assure que chaque avancée bénéficie réellement à toutes et à tous, sans exception.</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[var(--leaf-deep)]/15 border-4 border-white">
          <img src="/TENA.jpg" alt="Impact" className="w-full h-80 object-cover" />
        </div>
        <div className="mt-6 flex items-center gap-4 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(36,92,52,0.07)] border border-[var(--paper-line)]">
          <span className="text-4xl font-display font-extrabold bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] bg-clip-text text-transparent">100%</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-display font-bold uppercase tracking-widest text-[var(--ink)]">Démocratie Directe</span>
            <span className="text-[10px] font-mono-label font-bold text-[var(--leaf)] uppercase">Consensus & Solidarité</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [heroText, setHeroText] = useState("");
  const [heroDeleting, setHeroDeleting] = useState(false);
  const [heroLoop, setHeroLoop] = useState(0);
  const [heroSpeed, setHeroSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const i = heroLoop % phrasesHero.length;
      const fullText = phrasesHero[i];
      setHeroText(heroDeleting ? fullText.substring(0, heroText.length - 1) : fullText.substring(0, heroText.length + 1));
      setHeroSpeed(heroDeleting ? 50 : 100);
      if (!heroDeleting && heroText === fullText) {
        setTimeout(() => setHeroDeleting(true), 2500);
      } else if (heroDeleting && heroText === "") {
        setHeroDeleting(false);
        setHeroLoop(prev => prev + 1);
      }
    };
    const timer = setTimeout(handleTyping, heroSpeed);
    return () => clearTimeout(timer);
  }, [heroText, heroDeleting, heroLoop, heroSpeed]);

  return (
    <>
      <div className="relative h-[70vh] bg-[var(--ink)] overflow-hidden text-left flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/ENTRAIDE.jpg" alt="Background" className="w-full h-full object-cover opacity-35 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ink)] via-[var(--leaf-deep)]/70 to-[var(--sky)]/30"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--leaf-bright)]/25 blur-3xl glow-blob"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[var(--sky-bright)]/20 blur-3xl glow-blob" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="relative z-20 container mx-auto px-6 md:px-20 text-white max-w-5xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-[var(--leaf-bright)] font-mono-label font-semibold text-xs rounded-full uppercase tracking-widest mb-5">
            Formation et Développement
          </span>
          <h1 className="text-3xl md:text-6xl font-display font-extrabold max-w-4xl mb-4 leading-tight tracking-tight min-h-[2.4em]">
            {heroText}
            <span className="inline-block w-1.5 h-8 md:h-12 bg-[var(--sky-bright)] ml-2 animate-pulse align-middle"></span>
          </h1>
          <p className="max-w-xl text-white/80 mb-8 text-sm md:text-base font-body font-light leading-relaxed">
            Réduction durable de la pauvreté par l'autonomie des communautés vulnérables.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--leaf)] to-[var(--sky)] text-white px-8 py-4 font-mono-label font-bold uppercase text-xs tracking-widest hover:shadow-2xl hover:shadow-[var(--leaf)]/40 hover:-translate-y-0.5 transition-all rounded-full shadow-lg shadow-[var(--leaf)]/30">
            Nous soutenir <ArrowRight size={16} />
          </Link>
        </div>
        <CanopyDivider />
      </div>
      <TeamSection />
      <div className="bg-white py-16 px-6 md:px-20 border-t border-[var(--paper-line)]">
        <div className="container mx-auto"><EventCalendar /></div>
      </div>
      <ActivitiesHome />
      <ApproachSection />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { 
    const timer = setTimeout(() => setLoading(false), 400); 
    return () => clearTimeout(timer); 
  }, []);

  const navLinks = [
    { path: "/", label: "Accueil", icon: <Home size={16} /> },
    { path: "/a-propos", label: "À propos", icon: <Info size={16} /> },
    { path: "/interventions-publiees", label: "Interventions", icon: <Briefcase size={16} /> },
    { path: "/realisations", label: "Réalisations", icon: <Award size={16} /> },
    { path: "/contact", label: "Contact", icon: <Mail size={16} /> }
  ];

  if (loading) return (
    <>
      <DesignSystem />
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--paper)] font-mono-label font-black uppercase text-xs tracking-widest text-[var(--leaf)] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--leaf)]"></div>
        Chargement...
      </div>
    </>
  );

  return (
    <Router>
      <DesignSystem />
      <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] relative font-body">
        
        {/* --- NAVBAR --- */}
        <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-20 py-4 flex justify-between items-center border-b border-[var(--paper-line)] shadow-sm">
          <Link to="/" className="flex items-center space-x-3 text-left group">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain rounded-xl border border-[var(--paper-line)] shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-[var(--ink)] font-display font-extrabold text-sm md:text-base leading-tight tracking-tight">
              ONG TSINJO AINA <span className="text-[var(--leaf)]">FIANARANTSOA</span><br />
              <span className="text-[9px] font-mono-label font-bold tracking-[0.25em] text-[var(--ink-soft)] uppercase">Haute Matsiatra</span>
            </span>
          </Link>

          {/* --- VERSION ORDINATEUR --- */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8 text-xs font-mono-label font-extrabold uppercase tracking-widest text-[var(--ink-soft)] items-center">
              {navLinks.map((l) => (
                <li key={l.path}>
                  <NavLink 
                    to={l.path} 
                    className={({ isActive }) => isActive ? "text-[var(--leaf)] border-b-2 border-[var(--leaf)] pb-1" : "hover:text-[var(--sky)] transition-colors"}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4 border-l pl-6 border-[var(--paper-line)]">
              <Link to="/login" className="text-[var(--ink-soft)] hover:text-[var(--leaf)] transition-colors p-2 rounded-full hover:bg-[var(--leaf-ice)]">
                <UserCircle size={26} />
              </Link>
            </div>
          </div>

          {/* --- ICON HAMBURGER (MOBILE) --- */}
          <button className="md:hidden text-[var(--ink)] focus:outline-none p-2 rounded-xl hover:bg-[var(--leaf-ice)] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* --- SIDEBAR MOBILE --- */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 top-[85px] bg-[var(--ink)]/40 z-40 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        <div className={`fixed top-[85px] left-0 h-[calc(100vh-85px)] bg-white/95 backdrop-blur-xl z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col border-r border-[var(--paper-line)] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`} 
        style={{ width: '240px' }}>
          
          <ul className="flex flex-col items-start py-6 space-y-2 px-4">
            {navLinks.map((l) => (
              <li key={l.path} className="w-full">
                <NavLink 
                  to={l.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex flex-row items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full font-mono-label ${
                      isActive 
                        ? 'bg-[var(--leaf-ice)] text-[var(--leaf)] font-bold shadow-xs' 
                        : 'text-[var(--ink-soft)] hover:bg-[var(--leaf-ice)]/70 hover:text-[var(--leaf)]'
                    }`
                  }
                >
                  <span className="shrink-0">{l.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                    {l.label}
                  </span>
                </NavLink>
              </li>
            ))}
            
            <li className="mt-6 pt-4 border-t border-[var(--paper-line)] w-full">
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex flex-row items-center gap-3 p-3 text-[var(--ink-soft)] hover:text-[var(--leaf)] hover:bg-[var(--leaf-ice)]/70 rounded-xl transition-colors font-mono-label"
              >
                <UserCircle size={20} className="shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wide">Admin ONG</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* --- CONTENT --- */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/:id?" element={<Dashboard />} />
            <Route path="/interventions-list" element={<InterventionList />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/activites" element={<NosActivites />} />
            <Route path="/interventions-publiees" element={<InterventionsPubliees />} />
            <Route path="/realisations" element={<Realisations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Parametres />} />
          </Routes>
        </main>

        <footer className="relative bg-gradient-to-b from-[var(--ink)] to-[var(--leaf-deep)] pt-16 pb-6 text-center text-white/90 font-mono-label font-bold text-[10px] uppercase tracking-[0.4em] border-t-2 border-[var(--sky-bright)]/40 overflow-hidden">
          <CanopyDivider flip className="!bottom-auto !top-0" />
          © {new Date().getFullYear()} ONG Tsinjo Aina Fianarantsoa — Haute Matsiatra
        </footer>
      </div>
    </Router>
  );
}

export default App;