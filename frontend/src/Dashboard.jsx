import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { LayoutDashboard, Layers, Network, Users, ShieldCheck } from 'lucide-react';

const translations = {
  fr: {
    admin: "Espace gestionnaire",
    title: "Tableau de bord administrateur",
    welcome: "Bienvenue dans l’espace de gestion de l’ONG Tsinjo Aina Fianarantsoa.",
    interventions: "Total interventions",
    groups: "Groupes de solidarité",
    members: "Membres actifs"
  },
  mg: {
    admin: "Sehatra fitantanana",
    title: "Tabilao fitantanana",
    welcome: "Tongasoa soa eto amin'ny sehatra fitantanana ny ONG Tsinjo Aina Fianarantsoa.",
    interventions: "Fitambaran’ny asa tanterahina",
    groups: "Vondrona fifanampiana",
    members: "Mpikambana mavitrika"
  },
  en: {
    admin: "Management area",
    title: "Administrator dashboard",
    welcome: "Welcome to the management area of ONG Tsinjo Aina Fianarantsoa.",
    interventions: "Total interventions",
    groups: "Solidarity groups",
    members: "Active members"
  },
  it: {
    admin: "Area gestionale",
    title: "Pannello amministrativo",
    welcome: "Benvenuti nell’area gestionale di ONG Tsinjo Aina Fianarantsoa.",
    interventions: "Totale interventi",
    groups: "Gruppi di solidarietà",
    members: "Membri attivi"
  }
};

export default function Dashboard() {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'fr').split('-')[0];
  const tr = translations[lang] || translations.fr;
  const reduced = useReducedMotion();

  const stats = [
    {
      id: 'interventions', title: tr.interventions, value: '12',
      icon: Layers, color: 'bg-[#176B46] text-white', accent: 'bg-[#176B46]'
    },
    {
      id: 'groups', title: tr.groups, value: '24',
      icon: Network, color: 'bg-[#E5EAF8] text-[#000099]', accent: 'bg-[#4169E1]'
    },
    {
      id: 'members', title: tr.members, value: '350+',
      icon: Users, color: 'bg-[#F5EBC8] text-[#92701B]', accent: 'bg-[#E5C43B]'
    }
  ];

  const animation = {
    initial: reduced ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.5 }
  };

  return (
    <div className="min-h-[80vh] bg-[#E8F0DF] text-[#203528]">
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:px-14">

        {/* En-tête */}
        <motion.header {...animation}
          className="relative mb-5 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#103F30] to-[#176B46] p-5 text-white shadow-lg md:p-7">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[40px] border-white/5"/>
          <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5"/>

          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 md:h-16 md:w-16">
              <LayoutDashboard size={30}/>
            </div>
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[#E5C43B]">
                <ShieldCheck size={15}/>{tr.admin}
              </p>
              <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
                {tr.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                {tr.welcome}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article key={stat.id} {...animation}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : index * 0.12 }}
                whileHover={reduced ? undefined : { y: -4 }}
                className="relative overflow-hidden rounded-[24px] border border-[#CDDCC4] bg-[#F0F5E9] p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">

                <div className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`}/>

                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.color}`}>
                    <Icon size={26}/>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium leading-relaxed text-[#374151]">
                      {stat.title}
                    </h3>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-[#14532D] md:text-4xl">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}