import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, HeartHandshake, Check, Users, AlertCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const activities = [
  { id: '01', key: 'solidarity', img: '/GS.jpg' },
  { id: '02', key: 'training', img: '/form.jpg' },
  { id: '03', key: 'networks', img: '/Reseau.jpg' }
];

const approaches = [
  { key: 'savings', icon: ShieldCheck },
  { key: 'inclusion', icon: HeartHandshake }
];

const container = 'mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14';

function SectionTitle({ label, title }) {
  return (
    <ScrollReveal className="mb-8 md:mb-10">
      <div className="flex items-center gap-3">
        <span className="h-[2px] w-9 rounded-full bg-primary"/>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">{label}</span>
      </div>
      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">{title}</h2>
    </ScrollReveal>
  );
}

function MemberPhoto({ member }) {
  const [failed, setFailed] = useState(false);
  const name = member.name || member.title || '';
  const image = member.img || member.image || member.image_url;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary p-1 transition-all duration-500 group-hover:border-[#E5C43B] sm:h-32 sm:w-32">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#DCE9D3]">
        {image && !failed ? (
          <img src={image} alt={name} loading="lazy" onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-110"/>
        ) : (
          <span className="text-3xl font-semibold text-primary">{initials || <Users size={40}/>}</span>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const { t } = useTranslation();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTeam = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch('/api/team', { signal: controller.signal });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data');
        if (!controller.signal.aborted) setTeam(data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchTeam();
    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="bg-[var(--paper)] py-12 md:py-16">
      <div className={container}>
        <SectionTitle label={t('team.label')} title={t('team.title')}/>

        {loading ? (
          <div role="status" className="flex flex-col items-center gap-3 py-12 text-sm text-[#374151]">
            <span className="h-9 w-9 rounded-full border-2 border-[#CDDCC4] border-t-primary motion-safe:animate-spin"/>
            {t('common.loading')}
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center gap-3 py-12 text-sm text-[#374151]">
            <AlertCircle size={28} strokeWidth={1.5}/>
            <p>{t('team.error')}</p>
            <button type="button" onClick={() => setAttempt(n => n + 1)}
              className="rounded-full bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#14532D]">
              {t('common.retry')}
            </button>
          </div>
        ) : !team.length ? (
          <div className="flex flex-col items-center gap-3 py-12 text-[#374151]">
            <Users size={30} strokeWidth={1.5}/>
            <p className="text-sm">{t('team.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <ScrollReveal key={member.id ?? index} direction="zoom" delay={(index % 4) * 0.1}>
                <article className="group flex h-full flex-col items-center rounded-[24px] bg-[#F0F5E9] px-5 py-6 text-center shadow-[0_5px_20px_rgba(20,83,45,0.05)] transition-all duration-500 motion-safe:hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(20,83,45,0.12)]">
                  <MemberPhoto member={member}/>
                  <div className="mt-5 w-full">
                    <h3 className="break-words text-base font-semibold leading-snug text-[#203528] xl:text-lg">
                      {member.name || member.title}
                    </h3>
                    <span className="mx-auto my-3 block h-[2px] w-8 rounded-full bg-primary/40"/>
                    <p className="break-words text-sm font-medium leading-relaxed text-[#14532D]">
                      {member.role || member.location}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ActivitiesHome() {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--paper)] py-12 md:py-16">
      <div className={container}>
        <SectionTitle label={t('methodology.label')} title={t('methodology.title')}/>

        <div className="space-y-6 md:space-y-8">
          {activities.map((item, index) => {
            const key = `methodology.${item.key}`;
            const details = t(`${key}.details`, { returnObjects: true });

            return (
              <ScrollReveal key={item.id} direction={index % 2 ? 'right' : 'left'}>
                <article className={`group flex flex-col overflow-hidden rounded-[28px] bg-[#F0F5E9] shadow-[0_6px_25px_rgba(20,83,45,0.05)] lg:rounded-[32px] ${index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

                  {/* Image */}
                  <div className="relative min-h-[260px] overflow-hidden sm:min-h-[350px] lg:w-[44%]">
                    <img src={item.img} alt={t(`${key}.title`)} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-linear-to-t from-[#14532D]/20 to-transparent"/>
                    <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#14532D] text-base font-semibold text-white shadow-md">
                      {item.id}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:w-[56%] lg:p-10">
                    <ScrollReveal direction="up" delay={0.1}>
                      <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-[#14532D] md:text-3xl">
                        {t(`${key}.title`)}
                      </h3>
                      <p className="paragraph">{t(`${key}.description`)}</p>
                    </ScrollReveal>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {Array.isArray(details) && details.map((detail, i) => (
                        <ScrollReveal key={i} delay={i * 0.07} direction="up">
                          <div className="flex h-full items-center gap-3 rounded-xl bg-[#DCE9D3] p-3 transition-colors duration-300 hover:bg-[#CDDCC4]">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={17} strokeWidth={2}/>
                            </span>
                            <span className="text-sm font-medium leading-relaxed text-[#374151]">{detail}</span>
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
      </div>
    </section>
  );
}

export function ApproachSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--leaf-ice)] py-12 md:py-16">
      <div className={container}>
        <SectionTitle label={t('approach.label')} title={t('approach.title')}/>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Philosophie */}
          <div className="flex flex-col gap-5">
            {approaches.map(({ key, icon: Icon }, index) => (
              <ScrollReveal key={key} direction="left" delay={index * 0.12} className="flex-1">
                <article className="group h-full rounded-[24px] bg-[#F0F5E9] p-6 shadow-[0_5px_20px_rgba(20,83,45,0.05)] transition-shadow duration-500 hover:shadow-lg md:p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DCE9D3] text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon size={27} strokeWidth={1.7}/>
                    </span>
                    <h3 className="text-xl font-semibold leading-tight text-[#14532D] md:text-2xl">
                      {t(`approach.${key}.title`)}
                    </h3>
                  </div>
                  <p className="paragraph">{t(`approach.${key}.description`)}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Image et impact */}
          <ScrollReveal direction="right" className="flex flex-col gap-5">
            <div className="group relative min-h-[320px] flex-1 overflow-hidden rounded-[24px]">
              <img src="/TENA.jpg" alt={t('approach.impact')} loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"/>
              <div className="absolute inset-0 bg-linear-to-t from-[#14532D]/20 to-transparent"/>
            </div>

            <div className="flex flex-wrap items-center gap-5 rounded-[24px] bg-[#14532D] p-6 text-white md:p-8">
              <span className="text-4xl font-semibold tracking-tighter text-[#E5C43B] md:text-6xl">100%</span>
              <span className="hidden h-14 w-px bg-white/25 sm:block"/>
              <div>
                <h4 className="text-base font-semibold md:text-lg">{t('approach.democracy')}</h4>
                <p className="mt-1 text-sm font-normal text-white/90">{t('approach.consensus')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}