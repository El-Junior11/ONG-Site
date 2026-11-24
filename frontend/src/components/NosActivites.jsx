import { Check, Sprout, Users, Coins, Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const activities = [
  { id: '01', key: 'solidarity', icon: Users, img: '/GS.jpg', color: 'bg-[#E5EAF8] text-[#0000CC]' },
  { id: '02', key: 'savings', icon: Coins, img: '/Epargne.JPG', color: 'bg-[#E5C43B]/25 text-[#806400]' },
  { id: '03', key: 'agroecology', icon: Sprout, img: '/Produit.jpg', color: 'bg-[#DCE9D3] text-primary' },
  { id: '04', key: 'networks', icon: Network, img: '/reseau.JPG', color: 'bg-[#E5EAF8] text-[#0000CC]' }
];

const paragraph = 'break-words text-justify text-[15px] font-normal leading-[1.85] text-[#374151] md:text-base';

export default function NosActivites() {
  const { t } = useTranslation();
  const programs = t('activities.programs.items', { returnObjects: true });

  return (
    <section className="overflow-hidden bg-[var(--paper)] py-10 text-[#203528] md:py-14">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">

        {/* En-tête */}
        <ScrollReveal className="mb-7 md:mb-9">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 rounded-full bg-primary"/>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {t('activities.label')}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            {t('activities.title')}
          </h2>
          <p className={`${paragraph} mt-3`}>{t('activities.description')}</p>
        </ScrollReveal>

        {/* Domaines d'action */}
        <div className="space-y-5 md:space-y-6">
          {activities.map(({ id, key, icon: Icon, img, color }, index) => {
            const path = `activities.${key}`;
            const points = t(`${path}.points`, { returnObjects: true });

            return (
              <ScrollReveal key={id} direction={index % 2 ? 'right' : 'left'}>
                <article className={`group flex flex-col overflow-hidden rounded-[24px] bg-[#F0F5E9] shadow-[0_5px_20px_rgba(20,83,45,0.06)] ${index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                  {/* Image */}
                  <div className="relative min-h-[240px] shrink-0 overflow-hidden sm:min-h-[300px] lg:w-[40%]">
                    <img src={img} alt={t(`${path}.title`)} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"/>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#14532D]/20 to-transparent"/>
                    <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#14532D] text-base font-semibold text-white shadow-md">
                      {id}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 lg:p-8">

                    <ScrollReveal direction="up" delay={0.05}>
                      <div className="mb-3 flex items-center gap-3">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 motion-safe:group-hover:scale-110 ${color}`}>
                          <Icon size={25} strokeWidth={1.8}/>
                        </span>
                        <span className="text-xs font-semibold uppercase leading-relaxed tracking-[0.12em] text-primary">
                          {t(`${path}.subtitle`)}
                        </span>
                      </div>

                      <h3 className="mb-3 text-2xl font-semibold leading-tight tracking-tight text-[#14532D] md:text-3xl">
                        {t(`${path}.title`)}
                      </h3>

                      <div className="space-y-3">
                        <p className={paragraph}>{t(`${path}.description`)}</p>
                        <p className={paragraph}>{t(`${path}.details`)}</p>
                      </div>
                    </ScrollReveal>

                    {/* Points essentiels */}
                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {Array.isArray(points) && points.map((point, i) => (
                        <ScrollReveal key={i} direction="up" delay={i * 0.06}>
                          <div className="flex h-full items-center gap-3 rounded-xl bg-[#DCE9D3] p-3 transition-colors duration-300 hover:bg-[#CDDCC4]">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={17} strokeWidth={2}/>
                            </span>
                            <span className="text-sm font-medium leading-relaxed text-[#374151]">
                              {point}
                            </span>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Domaines de formation */}
        <ScrollReveal className="mt-6 md:mt-8" direction="up">
          <div className="rounded-[24px] bg-[#DCE9D3] p-5 md:p-7">

            <div className="mb-4">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 rounded-full bg-primary"/>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  {t('activities.programs.label')}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#14532D] md:text-3xl">
                {t('activities.programs.title')}
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(programs) && programs.map((program, i) => (
                <ScrollReveal key={i} direction="up" delay={i * 0.06}>
                  <div className="group flex h-full items-center gap-3 rounded-xl bg-[#F0F5E9] px-4 py-3 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-md">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE9D3] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Check size={19} strokeWidth={2}/>
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-[#374151]">
                      {program}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Engagement */}
        <ScrollReveal className="mt-6 md:mt-8" direction="up">
          <div className="relative overflow-hidden rounded-[24px] bg-[#14532D] px-6 py-7 text-white md:px-10 md:py-9">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E5C43B]/15 blur-3xl"/>
            <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-[#65A30D]/20 blur-3xl"/>

            <div className="relative flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C43B]">
                  {t('activities.cta.label')}
                </span>
                <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  {t('activities.cta.title')}
                </h3>
                <p className="mt-3 text-base font-normal leading-relaxed text-white/90">
                  {t('activities.cta.description')}
                </p>
              </div>

              <Link to="/#contact"
                className="group inline-flex max-w-full shrink-0 items-center justify-center gap-4 rounded-full bg-[#E8F0DF] px-6 py-3.5 text-sm font-semibold text-[#14532D] transition-colors duration-300 hover:bg-[#E5C43B]">
                {t('activities.cta.button')}
                <ArrowRight size={19} strokeWidth={1.8}
                  className="shrink-0 transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}