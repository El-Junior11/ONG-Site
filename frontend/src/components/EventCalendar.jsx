import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, Newspaper, ArrowRight, Sparkles } from 'lucide-react';

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Soloy fetch avy amin'ny API anao ity (ohatra: fetch('http://localhost:5000/api/events'))
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        // Mock data vonjimaika
        const mockEvents = [
          { id: 1, title: "Assemblée Générale GS", event_date: new Date().toISOString() },
          { id: 2, title: "Formation Agroécologie", event_date: new Date(Date.now() + 86400000 * 3).toISOString() }
        ];
        setEvents(mockEvents);
      } catch (err) {
        console.error("Erreur chargement événements :", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const eventDate = events.find(e => 
        new Date(e.event_date).toDateString() === date.toDateString()
      );
      return eventDate ? 'has-event' : null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      
      {/* --- 1. CALENDRIER --- */}
      <div className="w-full lg:w-1/2 bg-sky-50/40 p-6 md:p-8 rounded-3xl border border-sky-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-sky-500 text-slate-950 rounded-2xl shadow-sm">
            <CalendarIcon size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Calendrier des Activités</h2>
        </div>
        
        <Calendar 
          onChange={setDate} 
          value={date} 
          tileClassName={tileClassName}
          className="custom-calendar"
        />

        {loadingEvents && (
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mt-4 text-center animate-pulse">
            Famakiana ny tetiandro...
          </p>
        )}
      </div>

      {/* --- 2. ACTUALITÉS & IMPACT --- */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-sky-600 text-white rounded-2xl shadow-sm">
            <Newspaper size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Actualités & Impact</h2>
        </div>

        <div className="space-y-6">
          {/* Vaovao 1 */}
          <div className="group bg-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-sky-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-sky-500" />
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Dernière minute</span>
            </div>
            <h4 className="font-bold text-slate-900 uppercase text-base leading-tight">Multiplication et conservation des semences locales</h4>
            <p className="text-sm text-slate-600 mt-2 text-justify leading-relaxed">
              La préservation et la diffusion des semences locales au sein des communautés renforcent la souveraineté alimentaire en donnant aux paysans et paysannes la possibilité de conserver et de partager des variétés adaptées et résistantes. Ce système coopératif réduit la dépendance aux intrants agricoles onéreux.
            </p>
          </div>

          {/* Vaovao 2 */}
          <div className="group bg-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-slate-900">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-slate-900" />
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Impact Social</span>
            </div>
            <h4 className="font-bold text-slate-900 uppercase text-base leading-tight">Succès de l'Épargne Collective</h4>
            <p className="text-sm text-slate-600 mt-2 text-justify leading-relaxed">
              La mise en place d’une épargne collective permet aux villageois et villageoises de se libérer de la dépendance aux usuriers en constituant un fonds solidaire géré de manière autonome. Grâce à des crédits internes à faible taux, les familles sécurisent leurs récoltes.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sky-600 hover:text-slate-900 transition-colors pt-2 group">
            Voir tous les rapports <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        .custom-calendar {
          width: 100% !important;
          background: white !important;
          border: 1px solid #e0f2fe !important;
          border-radius: 1.25rem !important;
          padding: 1rem !important;
          font-family: inherit;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        }
        .react-calendar__navigation button {
          color: #0f172a;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .react-calendar__month-view__weekdays {
          font-weight: 700;
          font-size: 0.75rem;
          color: #0284c7;
          text-transform: uppercase;
        }
        .has-event {
          background: #38bdf8 !important; 
          color: #0f172a !important;
          font-weight: 800;
          border-radius: 0.5rem;
        }
        .react-calendar__tile {
          padding: 12px 6px;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }
        .react-calendar__tile:hover {
          background-color: #f0f9ff !important;
        }
        .react-calendar__tile--active {
          background: #0f172a !important;
          color: white !important;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;