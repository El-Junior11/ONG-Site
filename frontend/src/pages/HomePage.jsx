import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import EventCalendar from '../components/EventCalendar';
import { TeamSection, ActivitiesHome, ApproachSection } from './HomeSections';

const titles = {
  fr: ["ONG TSINJO AINA FIANARANTSOA", "Construisons l'avenir malagasy", "Engageons-nous pour le social", "Soutenons nos communautés"],
  mg: ["ONG TSINJO AINA FIANARANTSOA", "Andao hanorina ny hoavintsika", "Andao hifanampy", "Tohano ny vondrom-piarahamonina"],
  en: ["ONG TSINJO AINA FIANARANTSOA", "Building Madagascar's future", "Committed to social development", "Supporting our communities"],
  it: ["ONG TSINJO AINA FIANARANTSOA", "Costruiamo il nostro futuro", "Impegno per lo sviluppo sociale", "Sosteniamo le nostre comunità"]
};

const scrollLabels = { fr: 'Découvrir', mg: 'Hijery bebe kokoa', en: 'Discover', it: 'Scopri' };

function AnimatedTitle({ phrases }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const title = phrases[index];
    const complete = !deleting && text === title;
    const empty = deleting && !text;
    const timer = setTimeout(() => {
      if (complete) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex(i => (i + 1) % phrases.length);
      } else setText(title.slice(0, text.length + (deleting ? -1 : 1)));
    }, complete ? 3000 : empty ? 350 : deleting ? 35 : 65);
    return () => clearTimeout(timer);
  }, [index, text, deleting, phrases, reduced]);

  return (
    <div className="w-full [container-type:inline-size]">
      <h1 className="sr-only">{phrases[0]}</h1>
      <div aria-hidden="true"
        className="min-h-[1.4em] whitespace-nowrap text-[clamp(9px,4.3cqi,76px)] font-semibold leading-tight tracking-[-0.035em] text-white">
        {reduced ? phrases[0] : text}
        {!reduced && (
          <motion.span animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="ml-1 inline-block h-[0.85em] w-[2px] bg-[#E5C43B]"/>
        )}
      </div>
    </div>
  );
}

function Hero() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = i18n.resolvedLanguage || 'fr';

  const animation = delay => ({
    initial: reduced ? false : { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#14532D] text-white">

      {/* Image originale */}
      <motion.img src="/miava.jpg" alt="" fetchPriority="high"
        initial={reduced ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 2.5, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"/>

      {/* Overlay naturel */}
      <div className="absolute inset-0 bg-linear-to-r from-[#092B17]/85 via-[#103D22]/55 to-[#14532D]/15"/>
      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/40"/>

      {/* Contenu principal */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-5 pb-24 pt-28 sm:px-8 lg:px-14 2xl:px-20">

        <motion.div {...animation(0.1)} className="mb-6 flex items-center gap-3">
          <span className="h-[2px] w-10 rounded-full bg-[#E5C43B] sm:w-14"/>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C43B] sm:text-sm">
            {t('hero.label')}
          </span>
        </motion.div>

        <motion.div {...animation(0.25)}>
          <AnimatedTitle key={lang} phrases={titles[lang] || titles.fr}/>
        </motion.div>

        <motion.p {...animation(0.4)}
          className="mt-6 max-w-3xl text-justify text-base font-normal leading-[1.85] text-white/95 sm:text-lg">
          {t('hero.description')}
        </motion.p>

        {/* Boutons */}
        <motion.div {...animation(0.55)} className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#contact"
            className="group inline-flex items-center justify-center gap-4 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#14532D] sm:text-base">
            {t('hero.support')}
            <ArrowRight size={20} strokeWidth={1.8}
              className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
          </a>

          <a href="#activites"
            className="group inline-flex items-center justify-center gap-4 rounded-full border border-white/70 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:text-base">
            {t('hero.activities')}
            <ArrowRight size={20} strokeWidth={1.8}
              className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
          </a>
        </motion.div>
      </div>

      {/* Indicateur de défilement */}
      <a href="#equipe" aria-label={scrollLabels[lang] || scrollLabels.fr}
        className="absolute bottom-8 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-primary">
        <motion.span animate={reduced ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown size={24} strokeWidth={1.8}/>
        </motion.span>
      </a>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="w-full overflow-x-clip bg-[var(--paper)]">
      <Hero/>

      <section id="equipe" className="bg-[var(--paper)]">
        <TeamSection/>
      </section>

      <section className="bg-[var(--leaf-ice)] py-12 md:py-20">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">
          <ScrollReveal direction="up">
            <EventCalendar/>
          </ScrollReveal>
        </div>
      </section>

      <ActivitiesHome/>
      <ApproachSection/>
    </div>
  );
}