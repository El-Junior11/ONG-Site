import { Heart, ShieldCheck, Users, ArrowRight, Compass, Target, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';

const sections = [
  { key: 'presentation', img: '/Fivoriana.jpg' },
  { key: 'democracy', img: '/Dvpmt.jpg', icon: Users },
  { key: 'history', img: '/histoire.jpg' }
];

const foundations = [
  { key: 'vision', icon: Compass, color: 'bg-[#E5EAF8] text-[#0000CC]' },
  { key: 'mission', icon: Target, color: 'bg-[#DCE9D3] text-primary' },
  { key: 'values', icon: Handshake, color: 'bg-[#E5C43B]/25 text-[#806400]' }
];

export default function APropos() {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden bg-[var(--paper)] py-10 text-[#203528] md:py-14">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">

        {/* Titre principal */}
        <ScrollReveal className="mb-7 md:mb-9">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 rounded-full bg-primary"/>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {t('about.label')}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            {t('about.title')}
          </h2>
        </ScrollReveal>

        {/* Présentation, démocratie et histoire */}
        <div className="space-y-5 md:space-y-6">
          {sections.map(({ key, img, icon: Icon }, index) => {
            const path = `about.${key}`;
            const paragraphs = t(`${path}.paragraphs`, { returnObjects: true });
            const label = t(`${path}.label`, { defaultValue: '' });
            const title = t(`${path}.title`, { defaultValue: '' });

            return (
              <ScrollReveal key={key} direction={index % 2 ? 'right' : 'left'}>
                <article className={`group flex flex-col overflow-hidden rounded-[24px] bg-[#F0F5E9] shadow-[0_5px_20px_rgba(20,83,45,0.06)] ${index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                  {/* Image */}
                  <div className="relative min-h-[240px] shrink-0 overflow-hidden sm:min-h-[300px] lg:w-[40%]">
                    <img src={img} alt={title || t('about.title')} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"/>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#14532D]/15 to-transparent"/>
                  </div>

                  {/* Contenu */}
                  <div className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">

                    {label.trim() && (
                      <ScrollReveal direction="up">
                        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                          {label}
                        </span>
                      </ScrollReveal>
                    )}

                    {title.trim() && (
                      <ScrollReveal direction="up" delay={0.05}>
                        <div className="mb-4 flex items-center gap-3">
                          {Icon && (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DCE9D3] text-primary">
                              <Icon size={24} strokeWidth={1.8}/>
                            </span>
                          )}
                          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#14532D] md:text-3xl">
                            {title}
                          </h3>
                        </div>
                      </ScrollReveal>
                    )}

                    <div className="space-y-3">
                      {Array.isArray(paragraphs) && paragraphs.map((paragraph, i) => (
                        <ScrollReveal key={i} direction="up" delay={i * 0.06}>
                          <p className="paragraph">{paragraph}</p>
                        </ScrollReveal>
                      ))}
                    </div>

                    {/* Démocratie directe */}
                    {key === 'democracy' && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {[
                          { key: 'committee', icon: ShieldCheck },
                          { key: 'inclusion', icon: Heart }
                        ].map(({ key, icon: FeatureIcon }, i) => (
                          <ScrollReveal key={key} direction="up" delay={i * 0.08}>
                            <div className="h-full rounded-xl bg-[#DCE9D3] p-4 transition-colors duration-300 hover:bg-[#CDDCC4]">
                              <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                  <FeatureIcon size={19} strokeWidth={1.8}/>
                                </span>
                                <h4 className="text-sm font-semibold text-[#14532D] md:text-base">
                                  {t(`about.democracy.${key}.title`)}
                                </h4>
                              </div>
                              <p className="paragraph text-sm">
                                {t(`about.democracy.${key}.description`)}
                              </p>
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Vision, Mission et Valeurs */}
        <div className="mt-8 md:mt-10">
          <ScrollReveal>
            <h3 className="mb-5 text-2xl font-semibold tracking-tight text-[#14532D] md:text-3xl">
              {t('about.foundations')}
            </h3>
          </ScrollReveal>

          <div className="grid gap-4 md:grid-cols-3">
            {foundations.map(({ key, icon: Icon, color }, index) => (
              <ScrollReveal key={key} direction="zoom" delay={index * 0.1}>
                <article className="group h-full rounded-[22px] bg-[#F0F5E9] p-5 shadow-[0_5px_20px_rgba(20,83,45,0.05)] transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-lg md:p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 motion-safe:group-hover:scale-110 ${color}`}>
                      <Icon size={25} strokeWidth={1.8}/>
                    </span>
                    <h4 className="text-lg font-semibold text-[#14532D] md:text-xl">
                      {t(`about.${key}.title`)}
                    </h4>
                  </div>
                  <p className="paragraph">{t(`about.${key}.description`)}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Engagement */}
        <ScrollReveal className="mt-6 md:mt-8" direction="up">
          <div className="relative overflow-hidden rounded-[24px] bg-[#14532D] px-6 py-7 text-white md:px-10 md:py-9">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E5C43B]/15 blur-3xl"/>
            <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-[#65A30D]/20 blur-3xl"/>

            <div className="relative flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C43B]">
                  {t('about.cta.label')}
                </span>
                <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  {t('about.cta.title')}
                </h3>
                <p className="mt-3 text-base font-normal leading-relaxed text-white/90">
                  {t('about.cta.description')}
                </p>
              </div>

              <Link to="/#activites"
                className="group inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-[#E8F0DF] px-6 py-3.5 text-sm font-semibold text-[#14532D] transition-colors duration-300 hover:bg-[#E5C43B]">
                {t('about.cta.button')}
                <ArrowRight size={19} strokeWidth={1.8}
                  className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}