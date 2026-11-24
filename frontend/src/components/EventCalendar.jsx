import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarDays, Newspaper, ArrowRight, MapPin, Clock, Sprout, HeartHandshake } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { normalizeLanguage, localizeIntervention } from '../utils/localizeIntervention';

const translations = {
  fr: {
    calendar: 'Calendrier des activités', news: 'Actualités & Impact',
    empty: 'Aucune intervention publiée à cette date.',
    error: 'Impossible de charger les interventions.',
    agriculture: 'Agriculture durable', social: 'Impact social',
    seeds: 'Multiplication et conservation des semences locales',
    seedsDesc: 'La préservation et la diffusion des semences locales au sein des communautés renforcent la souveraineté alimentaire en donnant aux paysans et paysannes la possibilité de conserver et de partager des variétés adaptées et résistantes. Ce système coopératif réduit la dépendance aux intrants agricoles onéreux.',
    savings: "Succès de l'épargne collective",
    savingsDesc: 'La mise en place d’une épargne collective permet aux villageois et villageoises de se libérer de la dépendance aux usuriers en constituant un fonds solidaire géré de manière autonome. Grâce à des crédits internes à faible taux, les familles sécurisent leurs récoltes.',
    more: 'Voir nos réalisations'
  },
  mg: {
    calendar: "Tetiandron'ny asa", news: 'Vaovao sy Fiantraikany',
    empty: "Tsy misy asa navoaka amin'io daty io.",
    error: 'Tsy afaka nampiditra ny lisitry ny asa.',
    agriculture: 'Fambolena maharitra', social: 'Fiantraikany ara-tsosialy',
    seeds: 'Fampitomboana sy fitahirizana masomboly eo an-toerana',
    seedsDesc: "Ny fitahirizana sy fizarana masomboly eo an-toerana dia manamafy ny fahaleovantena ara-tsakafo. Afaka mitahiry sy mifampizara masomboly mifanaraka amin'ny tontolo iainana sy mahatanty fahasahiranana ny tantsaha. Mampihena ny fiankinana amin'ny fitaovam-pamokarana lafo vidy izany.",
    savings: 'Fahombiazan’ny tahiry iombonana',
    savingsDesc: "Ny tahiry iombonana dia manampy ny mponina hiala amin'ny fampindramam-bola misy zanabola mihoa-pampana. Amin'ny alalan'ny tahirim-bola tantanina miaraka sy ny fampindramam-bola amin'ny zanabola ambany dia afaka miaro ny vokatra ny fianakaviana.",
    more: 'Hijery ny zava-bitanay'
  },
  en: {
    calendar: 'Activities calendar', news: 'News & Impact',
    empty: 'No published interventions on this date.',
    error: 'Unable to load interventions.',
    agriculture: 'Sustainable agriculture', social: 'Social impact',
    seeds: 'Multiplication and conservation of local seeds',
    seedsDesc: 'Preserving and sharing local seeds within communities strengthens food sovereignty by enabling farmers to conserve and exchange adapted and resilient varieties. This cooperative system reduces dependence on expensive agricultural inputs.',
    savings: 'Success of collective savings',
    savingsDesc: 'Collective savings help villagers escape dependence on usurious lenders by establishing an independently managed solidarity fund. Through low-interest internal loans, families can protect their harvests.',
    more: 'View our achievements'
  },
  it: {
    calendar: 'Calendario delle attività', news: 'Notizie e Impatto',
    empty: 'Nessun intervento pubblicato in questa data.',
    error: 'Impossibile caricare gli interventi.',
    agriculture: 'Agricoltura sostenibile', social: 'Impatto sociale',
    seeds: 'Moltiplicazione e conservazione delle sementi locali',
    seedsDesc: 'La conservazione e la diffusione delle sementi locali rafforzano la sovranità alimentare, consentendo agli agricoltori di conservare e condividere varietà adattate e resistenti. Questo sistema cooperativo riduce la dipendenza dai costosi fattori produttivi agricoli.',
    savings: 'Successo del risparmio collettivo',
    savingsDesc: 'Il risparmio collettivo aiuta gli abitanti dei villaggi a liberarsi dalla dipendenza dagli usurai attraverso un fondo solidale gestito autonomamente. Grazie ai prestiti interni a basso interesse, le famiglie possono proteggere i propri raccolti.',
    more: 'Scopri i nostri risultati'
  }
};

const locales = { fr: 'fr-FR', mg: 'mg-MG', en: 'en-GB', it: 'it-IT' };
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const eventKey = value => typeof value === 'string' ? value.slice(0, 10) : '';

const cardClass = 'flex min-w-0 flex-1 flex-col rounded-[24px] bg-[#F0F5E9] p-4 shadow-[0_5px_20px_rgba(20,83,45,0.05)] sm:p-5';

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="mb-3 flex min-h-12 items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <Icon size={22} strokeWidth={1.8}/>
      </span>
      <h2 className="text-xl font-semibold leading-tight tracking-tight text-[#14532D] md:text-2xl">
        {title}
      </h2>
    </div>
  );
}

export default function EventCalendar() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.resolvedLanguage);
  const tr = translations[lang] || translations.fr;
  const locale = locales[lang] || locales.fr;
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch('/api/interventions', { signal: controller.signal });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data');
        if (!controller.signal.aborted) {
          setEvents(data.filter(item => item.is_published === true && item.date));
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const selectedEvents = events.filter(event => eventKey(event.date) === dateKey(date)).map(event => localizeIntervention(event, lang));
  const hasEvent = day => events.some(event => eventKey(event.date) === dateKey(day));

  const news = [
    { icon: Sprout, label: tr.agriculture, title: tr.seeds, desc: tr.seedsDesc, color: 'bg-[#DCE9D3] text-primary' },
    { icon: HeartHandshake, label: tr.social, title: tr.savings, desc: tr.savingsDesc, color: 'bg-[#E5EAF8] text-[#0000CC]' }
  ];

  return (
    <div className="grid min-w-0 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">

      {/* Calendrier des activités */}
      <ScrollReveal direction="left" className="flex min-w-0 flex-col">
        <div className="flex h-full flex-col">
          <SectionHeading icon={CalendarDays} title={tr.calendar}/>

          <div className={cardClass}>

            {/* Calendrier */}
            <div className="flex flex-1 flex-col justify-center">
              <Calendar locale={locale} value={date} onChange={setDate}
                calendarType="iso8601" selectRange={false}
                showFixedNumberOfWeeks
                tileContent={({ date: day, view }) => view === 'month' ? (
                  <span className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${hasEvent(day) ? 'bg-[#E5C43B] ring-1 ring-[#14532D]/30' : 'invisible'}`}/>
                ) : null}
                className="w-full! border-0! bg-transparent! font-sans!
                  [&_.react-calendar__navigation]:mb-1!
                  [&_.react-calendar__navigation]:h-10!
                  [&_.react-calendar__navigation_button]:min-w-8!
                  [&_.react-calendar__navigation_button]:rounded-lg!
                  [&_.react-calendar__navigation_button]:text-sm!
                  [&_.react-calendar__navigation_button]:font-semibold!
                  [&_.react-calendar__navigation_button]:text-[#14532D]!
                  [&_.react-calendar__navigation_button:hover]:bg-[#DCE9D3]!
                  [&_.react-calendar__month-view__weekdays]:text-xs!
                  [&_.react-calendar__month-view__weekdays]:font-semibold!
                  [&_.react-calendar__month-view__weekdays]:text-[#14532D]!
                  [&_.react-calendar__month-view__weekdays_abbr]:no-underline!
                  [&_.react-calendar__tile]:relative!
                  [&_.react-calendar__tile]:h-12!
                  [&_.react-calendar__tile]:rounded-lg!
                  [&_.react-calendar__tile]:px-0!
                  [&_.react-calendar__tile]:py-2!
                  [&_.react-calendar__tile]:text-sm!
                  [&_.react-calendar__tile]:font-medium!
                  [&_.react-calendar__tile:hover]:bg-[#DCE9D3]!
                  [&_.react-calendar__tile--now]:bg-[#DCE9D3]!
                  [&_.react-calendar__tile--active]:bg-[#008000]!
                  [&_.react-calendar__tile--active]:text-white!
                  [&_.react-calendar__tile--active:hover]:bg-[#14532D]!
                  lg:[&_.react-calendar__tile]:h-14!"
              />
            </div>

            {/* Interventions sélectionnées */}
            <div className="mt-3 border-t border-[#CDDCC4] pt-3">
              <div className="mb-2 flex items-center gap-2 text-[#14532D]">
                <CalendarDays size={17} className="shrink-0"/>
                <p className="text-sm font-semibold capitalize">
                  {date.toLocaleDateString(locale, {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>

              {loading ? (
                <p role="status" className="rounded-xl bg-[#DCE9D3] px-3 py-2.5 text-sm text-[#374151]">
                  {t('common.loading')}
                </p>
              ) : error ? (
                <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {tr.error}
                </p>
              ) : !selectedEvents.length ? (
                <p className="rounded-xl bg-[#DCE9D3] px-3 py-2.5 text-sm leading-relaxed text-[#374151]">
                  {tr.empty}
                </p>
              ) : (
                <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {selectedEvents.map(event => (
                    <article key={event.id} className="rounded-xl border-l-[3px] border-primary bg-[#E8F0DF] p-3">
                      <div className="flex items-center gap-2 text-[#14532D]">
                        <Clock size={17} className="shrink-0"/>
                        <h3 className="text-base font-semibold">{event.title}</h3>
                      </div>
                      {event.location && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#374151]">
                          <MapPin size={16} className="shrink-0 text-primary"/>
                          {event.location}
                        </p>
                      )}
                      <p className="paragraph mt-2">{event.description}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Actualités & Impact */}
      <ScrollReveal direction="right" className="flex min-w-0 flex-col">
        <div className="flex h-full flex-col">
          <SectionHeading icon={Newspaper} title={tr.news}/>

          <div className={cardClass}>
            <div className="flex flex-1 flex-col divide-y divide-[#CDDCC4]">

              {news.map(({ icon: Icon, label, title, desc, color }, index) => (
                <article key={index}
                  className={`group flex flex-1 flex-col justify-center ${index === 0 ? 'pb-4' : 'pt-4'}`}>

                  <div className="mb-2 flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 motion-safe:group-hover:scale-110 ${color}`}>
                      <Icon size={21} strokeWidth={1.8}/>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#14532D]">
                      {label}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#14532D] md:text-xl">
                    {title}
                  </h3>
                  <p className="paragraph mt-2">{desc}</p>
                </article>
              ))}
            </div>

            {/* Bouton réalisations */}
            <div className="mt-4 border-t border-[#CDDCC4] pt-3">
              <a href="/#realisations"
                className="group flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#14532D]">
                {tr.more}
                <ArrowRight size={18}
                  className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"/>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}