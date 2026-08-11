import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Globe, Share2, MessageCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await emailjs.send(
        'service_9fthtx8', 
        'template_i3bbvmr', 
        {
          name: form.name,    
          email: form.email,  
          subject: form.subject,
          message: form.message  
        },
        '3zUqCmG2ks6xyxDnl'
      );
  
      setLoading(false);
      Swal.fire({ 
        title: 'Succès !', 
        text: 'Votre message a été envoyé avec succès.',
        icon: 'success',
        confirmButtonColor: '#1C86C9'
      });
      setForm({ name: '', email: '', subject: '', message: '' });
  
    } catch (err) {
      setLoading(false);
      console.error(err);
      Swal.fire({ 
        title: 'Erreur !', 
        text: "Une erreur est survenue lors de l'envoi du message.",
        icon: 'error',
        confirmButtonColor: '#1C86C9'
      });
    }
  };

  return (
    <div className="bg-[var(--paper)] min-h-screen font-body text-[var(--ink)]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Contact.jpg" 
            alt="Background" 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ink)] via-[var(--sky-deep)]/70 to-[var(--sky)]/30"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--sky-bright)]/25 blur-3xl glow-blob"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 py-12">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-[var(--sky-bright)] font-mono-label font-bold text-xs rounded-full uppercase tracking-widest mb-4">
            Restons en contact
          </span>
          <h1 className="text-3xl md:text-6xl font-display font-extrabold uppercase mb-6 tracking-tighter text-white drop-shadow-2xl">
            Contactez-nous
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base font-body font-light leading-relaxed">
            Vous avez un projet, une question ou vous souhaitez soutenir nos actions ? 
            Notre équipe est à votre entière disposition pour vous accompagner.
          </p>
        </div>
      </section>

      {/* --- SECTION 2: INFOS & FORMULAIRE --- */}
      <section className="container mx-auto py-20 px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* ANKAVIA: COORDONNÉES */}
          <div className="lg:col-span-1 space-y-10">
            <div className="bg-white p-8 rounded-3xl border border-[var(--paper-line)] shadow-[0_4px_20px_rgba(11,79,134,0.06)] space-y-8">
              <h2 className="text-xs font-mono-label font-bold text-[var(--sky)] uppercase tracking-[0.3em] flex items-center gap-3">
                <MessageCircle size={18} />
                Nos Coordonnées
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="bg-[var(--ink)] p-3.5 rounded-2xl text-white group-hover:bg-[var(--sky)] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-xs uppercase tracking-widest mb-1">Adresse</h4>
                    <p className="text-[var(--ink)] font-body font-bold text-sm leading-relaxed">Lot 602/3306 Idanda,<br />Fianarantsoa 301, Madagascar</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-[var(--ink)] p-3.5 rounded-2xl text-white group-hover:bg-[var(--sky)] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-xs uppercase tracking-widest mb-1">Téléphone</h4>
                    <p className="text-[var(--ink)] font-body font-bold text-sm">+261 34 12 530 74</p>
                    <p className="text-[var(--ink)] font-body font-bold text-sm">+261 38 30 083 74</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-[var(--ink)] p-3.5 rounded-2xl text-white group-hover:bg-[var(--sky)] group-hover:text-white transition-colors duration-300 shrink-0 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-xs uppercase tracking-widest mb-1">E-mail</h4>
                    <p className="text-[var(--ink)] font-body font-bold text-sm break-all">tsinjoainafi@yahoo.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="px-2">
              <h4 className="font-mono-label font-bold text-[var(--ink)] uppercase text-xs tracking-[0.3em] mb-4">
                Suivez notre impact
              </h4>
              <div className="flex gap-3">
                {[
                  { Icon: Share2, label: "Groupe Officiel", link: "https://www.facebook.com/groups/1016298758850495/" },
                  { Icon: Globe, label: "Réseau", link: "#" }, 
                  { Icon: MessageCircle, label: "Communauté", link: "#" } 
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={social.label}
                    className="p-3.5 bg-white rounded-2xl text-[var(--ink)] hover:bg-[var(--sky)] hover:text-white transition-all duration-300 border border-[var(--paper-line)] shadow-2xs flex items-center justify-center"
                  >
                    <social.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ANKAVANANA: FORMULAIRE */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_4px_20px_rgba(11,79,134,0.06)] border border-[var(--paper-line)] relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">Nom Complet</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--sky)] focus:bg-white transition-all text-[var(--ink)] font-medium text-sm"
                      placeholder="Votre nom"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">Adresse E-mail</label>
                    <input 
                      type="email" 
                      className="w-full p-4 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--sky)] focus:bg-white transition-all text-[var(--ink)] font-medium text-sm"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">Sujet</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--sky)] focus:bg-white transition-all text-[var(--ink)] font-medium text-sm"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows="5" 
                    className="w-full p-4 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--sky)] focus:bg-white transition-all resize-none text-[var(--ink)] font-medium text-sm"
                    placeholder="Détaillez votre demande ici..."
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white py-5 rounded-2xl font-mono-label font-bold uppercase tracking-[0.3em] text-xs shadow-lg shadow-[var(--sky)]/30 hover:shadow-2xl hover:shadow-[var(--sky)]/40 hover:-translate-y-0.5 active:scale-98 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
                  Envoyer le Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: MAP --- */}
      <section className="h-[450px] w-full bg-[var(--sky-ice)] relative border-t border-[var(--paper-line)]">
        <iframe 
          title="ONG Location Idanda"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4480.389744985139!2d47.08137711192371!3d-21.44773352810447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21e7bf81bbb385a1%3A0x70141182c49e987f!2sONG%20TSINJO%20AINA!5e0!3m2!1sfr!2smg!4v1772344636197!5m2!1sfr!2smg"
          className="w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-1000 border-none"
          allowFullScreen="" 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
      
    </div>
  );
};

export default Contact;