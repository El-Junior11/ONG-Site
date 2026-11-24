import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const languages = [
  { code: 'fr', flag: 'fr', name: 'Français' },
  { code: 'mg', flag: 'mg', name: 'Malagasy' },
  { code: 'en', flag: 'gb', name: 'English' },
  { code: 'it', flag: 'it', name: 'Italiano' }
];

export default function LanguageSelector({ className = '' }) {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const current = languages.find(l => l.code === i18n.resolvedLanguage) || languages[0];

  useEffect(() => {
    const outside = e => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    const escape = e => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const changeLanguage = async code => {
    await i18n.changeLanguage(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button ref={buttonRef} type="button" onClick={() => setOpen(prev => !prev)}
        aria-label={`${t('common.language')} : ${current.name}`} aria-expanded={open}
        className="flex h-11 items-center gap-2 rounded-xl px-2 transition-opacity duration-300 hover:opacity-80">
        <span className={`fi fi-${current.flag} rounded-[3px] text-2xl shadow-sm`}/>
        <ChevronDown size={15} strokeWidth={2}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.97 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-[100] mt-3 w-48 origin-top-right overflow-hidden rounded-2xl border border-[#CDDCC4] bg-[#F0F5E9] p-2 text-[#203528] shadow-[0_12px_35px_rgba(20,83,45,0.15)]">

            {languages.map((lang, index) => {
              const active = current.code === lang.code;
              return (
                <motion.button key={lang.code} type="button"
                  initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : index * 0.04 }}
                  onClick={() => changeLanguage(lang.code)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-medium transition-colors duration-300 ${active ? 'bg-[#DCE9D3] font-semibold text-primary' : 'text-[#374151] hover:bg-[#E8F0DF] hover:text-primary'}`}>
                  <span className={`fi fi-${lang.flag} rounded-[3px] text-xl`}/>
                  <span className="flex-1">{lang.name}</span>
                  {active && <Check size={17} strokeWidth={2}/>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}