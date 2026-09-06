import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Globe, Share2, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

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
      Toast.fire({
        icon: 'success',
        title: 'Votre message a été envoyé avec succès.'
      });
      setForm({ name: '', email: '', subject: '', message: '' });
  
    } catch (err) {
      setLoading(false);
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: "Une erreur est survenue lors de l'envoi."
      });
    }
  };

  return (
    <div className="bg-[var(--paper)] font-body text-[var(--ink)] overflow-x-hidden">
      
      {/* --- SECTION 1: EN-TÊTE COMPACT & MODERNE --- */}
      <section className="pt-4 pb-4 px-6 md:px-12 bg-[var(--paper)] border-b border-[var(--paper-line)]">
        <div className="max-w-7xl mx-auto text-left space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--leaf-ice)] text-[var(--leaf-deep)] font-mono-label font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-[var(--leaf)]/25">
            <Sparkles size={12} /> Restons en contact
          </span>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-[var(--ink)] tracking-tight leading-none">
            Contactez-<span className="text-[var(--leaf)]">nous</span>
          </h1>
          <p className="text-[var(--ink-soft)] text-xs md:text-sm font-body leading-relaxed max-w-2xl border-l-2 pl-3 border-[var(--leaf)]">
            Vous avez un projet, une question ou vous souhaitez soutenir nos actions ? Notre équipe est à votre entière disposition.
          </p>
        </div>
      </section>

      {/* --- SECTION 2: INFOS & FORMULAIRE --- */}
      <section className="py-6 md:py-8 px-6 md:px-12 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ANKAVIA: COORDONNÉES */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[var(--paper-line)] space-y-5 shadow-sm">
                <h2 className="text-[11px] font-mono-label font-bold text-[var(--leaf)] uppercase tracking-[0.25em] flex items-center gap-2.5">
                  <MessageCircle size={16} />
                  Nos Coordonnées
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5 group">
                    <div className="bg-[var(--leaf-ice)] p-2.5 rounded-xl text-[var(--leaf-deep)] group-hover:bg-[var(--leaf)] group-hover:text-white transition-colors duration-300 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-[10px] uppercase tracking-widest mb-0.5">Adresse</h4>
                      <p className="text-[var(--ink)] font-body font-semibold text-xs leading-relaxed">Lot 602/3306 Idanda,<br />Fianarantsoa 301, Madagascar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group">
                    <div className="bg-[var(--sky-ice)] p-2.5 rounded-xl text-[var(--sky-deep)] group-hover:bg-[var(--sky)] group-hover:text-white transition-colors duration-300 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-[10px] uppercase tracking-widest mb-0.5">Téléphone</h4>
                      <p className="text-[var(--ink)] font-body font-semibold text-xs">+261 34 12 530 74</p>
                      <p className="text-[var(--ink)] font-body font-semibold text-xs">+261 38 30 083 74</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group">
                    <div className="bg-[var(--leaf-ice)] p-2.5 rounded-xl text-[var(--leaf-deep)] group-hover:bg-[var(--leaf)] group-hover:text-white transition-colors duration-300 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="font-mono-label font-bold text-[var(--ink-soft)] text-[10px] uppercase tracking-widest mb-0.5">E-mail</h4>
                      <p className="text-[var(--ink)] font-body font-semibold text-xs break-all">tsinjoainafi@yahoo.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA */}
              <div className="px-1">
                <h4 className="font-mono-label font-bold text-[var(--ink)] uppercase text-[10px] tracking-[0.25em] mb-3">
                  Suivez notre impact
                </h4>
                <div className="flex gap-2.5">
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
                      className="p-3 bg-white rounded-xl text-[var(--ink)] hover:bg-[var(--leaf)] hover:text-white transition-all duration-300 border border-[var(--paper-line)] flex items-center justify-center shadow-sm"
                    >
                      <social.Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ANKAVANANA: FORMULAIRE */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-[var(--paper-line)] relative overflow-hidden shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] ml-1">Nom complet</label>
                      <input 
                        type="text" 
                        className="w-full px-3.5 py-3 bg-[var(--paper-tint)] border border-[var(--paper-line)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:bg-white transition-all text-[var(--ink)] font-medium text-xs"
                        placeholder="Votre nom"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] ml-1">Adresse e-mail</label>
                      <input 
                        type="email" 
                        className="w-full px-3.5 py-3 bg-[var(--paper-tint)] border border-[var(--paper-line)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:bg-white transition-all text-[var(--ink)] font-medium text-xs"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] ml-1">Sujet</label>
                    <input 
                      type="text" 
                      className="w-full px-3.5 py-3 bg-[var(--paper-tint)] border border-[var(--paper-line)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:bg-white transition-all text-[var(--ink)] font-medium text-xs"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] ml-1">Message</label>
                    <textarea 
                      rows="4" 
                      className="w-full p-3.5 bg-[var(--paper-tint)] border border-[var(--paper-line)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--leaf)] focus:bg-white transition-all resize-none text-[var(--ink)] font-medium text-xs"
                      placeholder="Détaillez votre demande ici..."
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[var(--leaf)] text-white py-3.5 rounded-xl font-mono-label font-bold uppercase tracking-[0.25em] text-xs hover:bg-[var(--leaf-deep)] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={14} />}
                    Envoyer le Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION 3: MAP --- */}
      <section className="h-[300px] w-full bg-[var(--paper-tint)] relative border-t border-[var(--paper-line)]">
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