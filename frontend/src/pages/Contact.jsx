import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import ScrollReveal from '../components/ScrollReveal';

const initialForm = { name: '', email: '', subject: '', message: '' };

const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4480.389744985139!2d47.08137711192371!3d-21.44773352810447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21e7bf81bbb385a1%3A0x70141182c49e987f!2sONG%20TSINJO%20AINA!5e0!3m2!1sfr!2smg!4v1772344636197!5m2!1sfr!2smg";

const translations = {
  fr: {
    label: 'Restons en contact', title: 'Contactez-nous',
    description: 'Vous avez un projet, une question ou vous souhaitez soutenir nos actions ? Notre équipe est à votre entière disposition.',
    form: 'Envoyer un message', name: 'Nom complet', namePlaceholder: 'Votre nom',
    emailLabel: 'Adresse e-mail', subject: 'Sujet', subjectPlaceholder: 'Comment pouvons-nous vous aider ?',
    message: 'Message', messagePlaceholder: 'Détaillez votre demande ici...',
    send: 'Envoyer le Message', sending: 'Envoi en cours...',
    success: 'Votre message a été envoyé avec succès.',
    error: "Une erreur est survenue lors de l'envoi."
  },
  mg: {
    label: 'Mifandraisa hatrany', title: 'Mifandraisa aminay',
    description: "Manana tetikasa na fanontaniana ve ianao, sa maniry hanohana ny asa ataonay ? Vonona hanampy anao ny ekipanay.",
    form: 'Handefa hafatra', name: 'Anarana feno', namePlaceholder: 'Ny anaranao',
    emailLabel: 'Adiresy mailaka', subject: 'Lohahevitra', subjectPlaceholder: 'Ahoana no azonay anampiana anao ?',
    message: 'Hafatra', messagePlaceholder: 'Hazavao eto ny fangatahanao...',
    send: 'Alefa ny hafatra', sending: 'Eo am-pandefasana...',
    success: 'Tafavoaka soa aman-tsara ny hafatrao.',
    error: 'Nisy olana teo am-pandefasana ny hafatra.'
  },
  en: {
    label: 'Stay in touch', title: 'Contact us',
    description: 'Do you have a project, a question or would you like to support our actions? Our team is entirely at your disposal.',
    form: 'Send a message', name: 'Full name', namePlaceholder: 'Your name',
    emailLabel: 'Email address', subject: 'Subject', subjectPlaceholder: 'How can we help you?',
    message: 'Message', messagePlaceholder: 'Describe your request here...',
    send: 'Send Message', sending: 'Sending...',
    success: 'Your message has been sent successfully.',
    error: 'An error occurred while sending your message.'
  },
  it: {
    label: 'Restiamo in contatto', title: 'Contattaci',
    description: 'Hai un progetto, una domanda o desideri sostenere le nostre azioni? Il nostro team è a tua completa disposizione.',
    form: 'Invia un messaggio', name: 'Nome completo', namePlaceholder: 'Il tuo nome',
    emailLabel: 'Indirizzo e-mail', subject: 'Oggetto', subjectPlaceholder: 'Come possiamo aiutarti?',
    message: 'Messaggio', messagePlaceholder: 'Descrivi qui la tua richiesta...',
    send: 'Invia il messaggio', sending: 'Invio in corso...',
    success: 'Il tuo messaggio è stato inviato con successo.',
    error: "Si è verificato un errore durante l'invio."
  }
};

const inputClass = 'w-full min-w-0 rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] px-4 py-3 text-sm text-[#203528] outline-none transition-all duration-300 placeholder:text-[#647067] focus:border-primary focus:ring-2 focus:ring-primary/15';

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false,
  timer: 3000, timerProgressBar: true,
  didOpen: toast => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export default function Contact() {
  const { i18n } = useTranslation();
  const tr = translations[i18n.resolvedLanguage] || translations.fr;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(previous => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await emailjs.send('service_9fthtx8', 'template_i3bbvmr', {
        name: form.name, email: form.email,
        subject: form.subject, message: form.message
      }, '3zUqCmG2ks6xyxDnl');

      Toast.fire({ icon: 'success', title: tr.success });
      setForm({ ...initialForm });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: 'error', title: tr.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden bg-[var(--paper)] py-10 text-[#203528] md:py-14">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-14">

        {/* En-tête */}
        <ScrollReveal className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-9 rounded-full bg-primary"/>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {tr.label}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            {tr.title}
          </h2>
          <p className="paragraph mt-3">{tr.description}</p>
        </ScrollReveal>

        <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">

          {/* Google Maps */}
          <ScrollReveal direction="left" className="min-w-0">
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-[24px] bg-[#DCE9D3] shadow-[0_5px_20px_rgba(20,83,45,0.06)] sm:min-h-[380px]">
              <iframe title="ONG TSINJO AINA - Idanda" src={MAP_URL}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"/>
            </div>
          </ScrollReveal>

          {/* Formulaire */}
          <ScrollReveal direction="right" className="min-w-0">
            <div className="flex h-full flex-col rounded-[24px] bg-[#F0F5E9] p-5 shadow-[0_5px_20px_rgba(20,83,45,0.06)] sm:p-6 lg:p-7">

              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DCE9D3] text-primary">
                  <MessageCircle size={25} strokeWidth={1.8}/>
                </span>
                <h3 className="text-xl font-semibold text-[#14532D] md:text-2xl">{tr.form}</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">{tr.name}</label>
                    <input id="contact-name" type="text" name="name"
                      autoComplete="name" placeholder={tr.namePlaceholder}
                      value={form.name} onChange={handleChange}
                      className={inputClass} required/>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">{tr.emailLabel}</label>
                    <input id="contact-email" type="email" name="email"
                      autoComplete="email" placeholder="votre@email.com"
                      value={form.email} onChange={handleChange}
                      className={inputClass} required/>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">{tr.subject}</label>
                  <input id="contact-subject" type="text" name="subject"
                    placeholder={tr.subjectPlaceholder}
                    value={form.subject} onChange={handleChange}
                    className={inputClass} required/>
                </div>

                <div className="flex flex-1 flex-col">
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">{tr.message}</label>
                  <textarea id="contact-message" name="message" rows={5}
                    placeholder={tr.messagePlaceholder}
                    value={form.message} onChange={handleChange}
                    className={`${inputClass} min-h-[130px] flex-1 resize-y`} required/>
                </div>

                <button type="submit" disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <Loader2 size={19} className="animate-spin"/> : (
                    <Send size={19} strokeWidth={1.8}
                      className="transition-transform motion-safe:group-hover:translate-x-1"/>
                  )}
                  {loading ? tr.sending : tr.send}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}