import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowUpRight, ArrowUp, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const sections = ['accueil', 'apropos', 'activites', 'interventions', 'realisations', 'contact'];
const FACEBOOK_URL = 'https://www.facebook.com/groups/1016298758850495/';

const translations = {
  fr: {
    description: "Réduction durable de la pauvreté par l'autonomie des communautés vulnérables.",
    navigation: 'Navigation rapide', contact: 'Contactez-nous',
    address: 'Madagascar', addressLabel: 'Adresse', phone: 'Téléphone', email: 'E-mail',
    social: 'Suivez notre impact', facebook: 'Groupe officiel Facebook',
    rights: 'Tous droits réservés.', top: 'Retour en haut'
  },
  mg: {
    description: "Fampihenana maharitra ny fahantrana amin'ny fanamafisana ny fahaleovantenan'ireo vondrom-piarahamonina marefo.",
    navigation: 'Menio', contact: 'Mifandraisa aminay',
    address: 'Madagasikara', addressLabel: 'Adiresy', phone: 'Finday', email: 'Mailaka',
    social: 'Araho ny fiantraikanay', facebook: 'Vondrona ofisialy Facebook',
    rights: 'Zo rehetra voatokana.', top: 'Hiverina eny ambony'
  },
  en: {
    description: 'Sustainable poverty reduction through the empowerment of vulnerable communities.',
    navigation: 'Quick links', contact: 'Contact us',
    address: 'Madagascar', addressLabel: 'Address', phone: 'Phone', email: 'Email',
    social: 'Follow our impact', facebook: 'Official Facebook group',
    rights: 'All rights reserved.', top: 'Back to top'
  },
  it: {
    description: 'Riduzione sostenibile della povertà attraverso l’autonomia delle comunità vulnerabili.',
    navigation: 'Link rapidi', contact: 'Contattaci',
    address: 'Madagascar', addressLabel: 'Indirizzo', phone: 'Telefono', email: 'E-mail',
    social: 'Segui il nostro impatto', facebook: 'Gruppo ufficiale Facebook',
    rights: 'Tutti i diritti riservati.', top: 'Torna in alto'
  }
};

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v9h4v-9h3l1-4h-4V9c0-.7.3-1 1-1z"/>
    </svg>
  );
}

function FooterTitle({ children }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-white">{children}</h3>
      <span className="mt-2 block h-[3px] w-9 rounded-full bg-[#E5C43B]"/>
    </div>
  );
}

function ContactItem({ icon: Icon, label, children }) {
  return (
    <div className="group flex min-w-0 items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#E5C43B] transition-colors duration-300 group-hover:bg-[#E5C43B] group-hover:text-[#14532D]">
        <Icon size={19} strokeWidth={1.8}/>
      </span>
      <div className="min-w-0">
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">{label}</h4>
        <div className="text-sm font-normal leading-relaxed text-white/90">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t, i18n } = useTranslation();
  const text = translations[i18n.resolvedLanguage] || translations.fr;

  const scrollTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#14532D] text-white">

      {/* Ligne décorative */}
      <div className="flex h-1 w-full">
        <span className="w-[70%] bg-[#008000]"/>
        <span className="w-[20%] bg-[#E5C43B]"/>
        <span className="w-[10%] bg-[#0000CC]"/>
      </div>

      {/* Décoration de fond */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#65A30D]/10 blur-3xl"/>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#008000]/20 blur-3xl"/>

      <div className="relative mx-auto max-w-[1680px] px-5 pb-5 pt-9 sm:px-8 lg:px-14 lg:pt-12">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-10">

          {/* Identité de l'ONG */}
          <ScrollReveal direction="up">
            <Link to="/#accueil" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="ONG TSINJO AINA"
                className="h-16 w-16 shrink-0 rounded-full bg-white object-contain p-1"/>
              <div>
                <h2 className="text-lg font-semibold leading-tight tracking-tight sm:text-xl">
                  ONG TSINJO AINA
                </h2>
                <p className="mt-1 text-xs font-medium tracking-[0.15em] text-white/80">
                  FIANARANTSOA
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-justify text-sm font-normal leading-[1.85] text-white/85">
              {text.description}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#E5C43B]">
              <MapPin size={17} strokeWidth={1.8} className="shrink-0"/>
              <span>Haute Matsiatra — {text.address}</span>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-5">
              <h4 className="mb-3 text-sm font-medium text-white/90">{text.social}</h4>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                title={text.facebook} aria-label={text.facebook}
                className="group inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 transition-colors duration-300 hover:bg-white/20">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white">
                  <FacebookIcon/>
                </span>
                <span className="text-sm font-medium">Facebook</span>
                <ArrowUpRight size={15} className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"/>
              </a>
            </div>
          </ScrollReveal>

          {/* Navigation rapide */}
          <ScrollReveal direction="up" delay={0.1}>
            <FooterTitle>{text.navigation}</FooterTitle>

            <nav aria-label={text.navigation} className="grid grid-cols-2 gap-x-4 gap-y-4">
              {sections.map(id => (
                <Link key={id} to={`/#${id}`}
                  className="group flex min-w-0 items-center gap-2 text-sm font-normal text-white/85 transition-colors duration-300 hover:text-[#E5C43B]">
                  <ChevronRight size={16} strokeWidth={2}
                    className="shrink-0 text-[#E5C43B] transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
                  <span className="break-words">{t(`nav.${id}`)}</span>
                </Link>
              ))}
            </nav>
          </ScrollReveal>

          {/* Coordonnées */}
          <ScrollReveal direction="up" delay={0.2} className="md:col-span-2 lg:col-span-1">
            <FooterTitle>{text.contact}</FooterTitle>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ContactItem icon={MapPin} label={text.addressLabel}>
                <p>Lot 602/3306 Idanda</p>
                <p>Fianarantsoa 301, {text.address}</p>
              </ContactItem>

              <ContactItem icon={Phone} label={text.phone}>
                <a href="tel:+261341253074" className="block transition-colors hover:text-[#E5C43B]">
                  +261 34 12 530 74
                </a>
                <a href="tel:+261383008374" className="block transition-colors hover:text-[#E5C43B]">
                  +261 38 30 083 74
                </a>
              </ContactItem>

              <ContactItem icon={Mail} label={text.email}>
                <a href="mailto:tsinjoainafi@yahoo.com"
                  className="break-all transition-colors hover:text-[#E5C43B]">
                  tsinjoainafi@yahoo.com
                </a>
              </ContactItem>
            </div>
          </ScrollReveal>
        </div>

        {/* Copyright et retour en haut */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-4 sm:flex-row">
          <p className="text-center text-xs font-normal leading-relaxed text-white/75 sm:text-left sm:text-sm">
            © {new Date().getFullYear()} ONG TSINJO AINA Fianarantsoa. {text.rights}
          </p>

          <button type="button" onClick={scrollTop} aria-label={text.top}
            className="group flex shrink-0 items-center gap-3 text-sm font-medium text-white/85 transition-colors hover:text-[#E5C43B]">
            {text.top}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-[#E5C43B] group-hover:text-[#14532D]">
              <ArrowUp size={20} strokeWidth={1.8}
                className="transition-transform motion-safe:group-hover:-translate-y-0.5"/>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}