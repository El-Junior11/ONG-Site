import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, UserCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';

const sections = ['accueil', 'apropos', 'activites', 'interventions', 'realisations', 'contact'];

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const isHome = pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;
  const behavior = reducedMotion ? 'instant' : 'smooth';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      if (!isHome) return;
      let current = 'accueil';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) current = 'contact';
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isHome]);

  useEffect(() => {
    const closeTimer = setTimeout(() => setMobileOpen(false), 0);
    const scrollTimer = isHome ? setTimeout(() => {
      document.getElementById(hash.slice(1) || 'accueil')?.scrollIntoView({ behavior, block: 'start' });
    }, 100) : null;
    return () => {
      clearTimeout(closeTimer);
      clearTimeout(scrollTimer);
    };
  }, [pathname, hash, isHome, behavior]);

  useEffect(() => {
    const escape = e => { if (e.key === 'Escape') setMobileOpen(false); };
    const resize = () => { if (window.innerWidth >= 1280) setMobileOpen(false); };
    window.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const goToSection = id => {
    setMobileOpen(false);
    const target = id === 'accueil' ? '/' : `/#${id}`;
    if (isHome && pathname + hash === target) {
      document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
    } else navigate(target, { replace: isHome });
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent text-white' : 'bg-[#E8F0DF]/98 text-[#14532D] shadow-[0_4px_20px_rgba(20,83,45,0.08)]'}`}>
      <nav className="relative z-20 mx-auto flex h-[76px] max-w-[1920px] items-center justify-between gap-3 px-3 sm:px-5 xl:px-6 2xl:px-10">

        {/* Logo */}
        <a href="/" onClick={e => { e.preventDefault(); goToSection('accueil'); }}
          className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="ONG TSINJO AINA"
            className="h-11 w-11 shrink-0 rounded-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-105 sm:h-12 sm:w-12 2xl:h-14 2xl:w-14"/>
          <div className="leading-tight">
            <span className="block whitespace-nowrap text-xs font-bold tracking-tight sm:text-sm 2xl:text-base">ONG TSINJO AINA</span>
            <span className="mt-1 block text-[10px] font-medium tracking-wider sm:text-xs">FIANARANTSOA</span>
          </div>
        </a>

        {/* Navigation desktop */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex 2xl:gap-8">
          {sections.map(id => {
            const active = isHome && activeSection === id;
            return (
              <a key={id} href={id === 'accueil' ? '/' : `/#${id}`}
                onClick={e => { e.preventDefault(); goToSection(id); }}
                aria-current={active ? 'location' : undefined}
                className={`group relative whitespace-nowrap py-3 text-sm font-semibold transition-colors duration-300 2xl:text-base ${transparent ? 'text-white hover:text-[#E5C43B]' : active ? 'text-primary' : 'text-[#203528] hover:text-primary'}`}>
                {t(`nav.${id}`)}
                <span className={`absolute inset-x-0 bottom-1 h-[2px] origin-center rounded-full transition-transform duration-300 ${transparent ? 'bg-[#E5C43B]' : 'bg-primary'} ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}/>
              </a>
            );
          })}
        </div>

        {/* Langues et administration */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <LanguageSelector/>

          <Link to="/login" onClick={() => setMobileOpen(false)}
            title={t('nav.admin')} aria-label={t('nav.admin')}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 motion-safe:hover:scale-110 sm:h-11 sm:w-11 ${transparent ? 'text-white hover:bg-white/15' : 'text-[#14532D] hover:bg-[#DCE9D3]'}`}>
            <UserCircle size={29} strokeWidth={1.7}/>
          </Link>

          {/* Bouton menu mobile */}
          <button type="button" onClick={() => setMobileOpen(prev => !prev)}
            aria-expanded={mobileOpen} aria-controls="mobile-navigation"
            aria-label={t(mobileOpen ? 'common.closeMenu' : 'common.openMenu')}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 xl:hidden ${transparent ? 'hover:bg-white/15' : 'hover:bg-[#DCE9D3]'}`}>
            <motion.span key={mobileOpen ? 'close' : 'menu'}
              initial={{ rotate: reducedMotion ? 0 : -30, opacity: reducedMotion ? 1 : 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}>
              {mobileOpen ? <X size={26} strokeWidth={2}/> : <Menu size={26} strokeWidth={2}/>}
            </motion.span>
          </button>
        </div>
      </nav>

      {/* Navigation mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[76px] z-0 bg-[#14532D]/35 backdrop-blur-sm xl:hidden"/>

            <motion.div id="mobile-navigation"
              initial={{ opacity: 0, y: reducedMotion ? 0 : -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -15 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh-76px)] overflow-y-auto rounded-b-[24px] border-t border-[#CDDCC4] bg-[#E8F0DF] p-4 text-[#203528] shadow-xl sm:p-6 xl:hidden">

              <div className="flex flex-col gap-1.5">
                {sections.map((id, index) => {
                  const active = isHome && activeSection === id;
                  return (
                    <motion.a key={id} href={id === 'accueil' ? '/' : `/#${id}`}
                      initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : index * 0.045 }}
                      onClick={e => { e.preventDefault(); goToSection(id); }}
                      aria-current={active ? 'location' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-300 ${active ? 'bg-[#DCE9D3] font-semibold text-primary' : 'text-[#203528] hover:bg-[#DCE9D3] hover:text-primary'}`}>
                      <span className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-primary' : 'bg-[#9EB894]'}`}/>
                      {t(`nav.${id}`)}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}