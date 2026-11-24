import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import api from './api/axios';

const translations = {
  fr: {
    welcome: 'Bienvenue !',
    welcomeDesc: 'Connectez-vous à votre espace administrateur.',
    adminSpace: 'Espace administrateur',
    home: 'Accueil', admin: 'Administration', login: 'Connexion',
    description: 'Connectez-vous pour accéder à la gestion.',
    email: 'Adresse e-mail', emailPlaceholder: 'nom@exemple.com',
    password: 'Mot de passe', forgot: 'Mot de passe oublié ?',
    show: 'Afficher le mot de passe', hide: 'Masquer le mot de passe',
    submit: 'Se connecter', loading: 'Connexion en cours...',
    success: 'Connexion réussie ! Bienvenue dans l’espace administrateur.',
    error: 'Erreur de connexion',
    invalid: 'Adresse e-mail ou mot de passe incorrect.',
    serverError: 'Impossible de se connecter au serveur.',
    tokenError: 'Token de connexion manquant.',
    forgotDesc: 'Veuillez contacter le responsable de l’administration pour réinitialiser votre mot de passe.',
    understood: 'Compris'
  },
  mg: {
    welcome: 'Tongasoa !',
    welcomeDesc: "Midira ao amin'ny sehatra fitantanana.",
    adminSpace: 'Sehatra fitantanana',
    home: 'Fandraisana', admin: 'Fitantanana', login: 'Fidirana',
    description: "Midira mba hahafahanao mampiasa ny sehatra fitantanana.",
    email: 'Adiresy mailaka', emailPlaceholder: 'anarana@ohatra.com',
    password: 'Teny miafina', forgot: 'Adino ny teny miafina ?',
    show: 'Asehoy ny teny miafina', hide: 'Afeno ny teny miafina',
    submit: 'Hiditra', loading: 'Eo am-pidirana...',
    success: "Tafiditra soa aman-tsara ! Tongasoa eto amin'ny sehatra fitantanana.",
    error: 'Tsy afaka niditra',
    invalid: 'Diso ny adiresy mailaka na ny teny miafina.',
    serverError: "Tsy afaka mifandray amin'ny mpizara.",
    tokenError: 'Tsy hita ny token fidirana.',
    forgotDesc: "Mifandraisa amin'ny tompon'andraikitry ny fitantanana mba hanavaozana ny teny miafinao.",
    understood: 'Azoko'
  },
  en: {
    welcome: 'Welcome!',
    welcomeDesc: 'Sign in to your administration area.',
    adminSpace: 'Administration area',
    home: 'Home', admin: 'Administration', login: 'Sign in',
    description: 'Sign in to access the management platform.',
    email: 'Email address', emailPlaceholder: 'name@example.com',
    password: 'Password', forgot: 'Forgot your password?',
    show: 'Show password', hide: 'Hide password',
    submit: 'Sign in', loading: 'Signing in...',
    success: 'Login successful! Welcome to the administration area.',
    error: 'Login error',
    invalid: 'Incorrect email address or password.',
    serverError: 'Unable to connect to the server.',
    tokenError: 'Authentication token is missing.',
    forgotDesc: 'Please contact the administrator to reset your password.',
    understood: 'Understood'
  },
  it: {
    welcome: 'Benvenuto!',
    welcomeDesc: 'Accedi alla tua area amministrativa.',
    adminSpace: 'Area amministrativa',
    home: 'Home', admin: 'Amministrazione', login: 'Accesso',
    description: 'Accedi per utilizzare la piattaforma di gestione.',
    email: 'Indirizzo e-mail', emailPlaceholder: 'nome@esempio.com',
    password: 'Password', forgot: 'Password dimenticata?',
    show: 'Mostra password', hide: 'Nascondi password',
    submit: 'Accedi', loading: 'Accesso in corso...',
    success: 'Accesso riuscito! Benvenuto nell’area amministrativa.',
    error: 'Errore di accesso',
    invalid: 'Indirizzo e-mail o password non corretti.',
    serverError: 'Impossibile connettersi al server.',
    tokenError: 'Token di autenticazione mancante.',
    forgotDesc: 'Contatta il responsabile dell’amministrazione per reimpostare la password.',
    understood: 'Ho capito'
  }
};

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false,
  timer: 3000, timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const inputClass = 'h-12 w-full rounded-xl border border-[#DCE7E0] bg-[#F8FAF9] pl-11 pr-4 text-sm text-[#1E293B] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#176B46] focus:ring-2 focus:ring-[#176B46]/10';

export default function Login() {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'fr').split('-')[0];
  const tr = translations[lang] || translations.fr;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const handleLogin = async e => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      const data = response.data;

      if (!data.token) {
        setError('tokenError');
        Toast.fire({ icon: 'error', title: tr.error, text: tr.tokenError });
        return;
      }

      localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      else localStorage.removeItem('user');

      Toast.fire({ icon: 'success', title: tr.success });
      setEmail('');
      setPassword('');
      navigate('/interventions-list', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const key = [400, 401, 403].includes(status) ? 'invalid' : 'serverError';
      setError(key);
      Toast.fire({ icon: 'error', title: tr.error, text: tr[key] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      icon: 'info', title: tr.forgot, text: tr.forgotDesc,
      confirmButtonText: tr.understood, confirmButtonColor: '#176B46'
    });
  };

  return (
    <div className="login-page flex min-h-svh w-full items-center justify-center bg-[#F1F6F3] px-4 py-6 sm:px-6 lg:py-8">
      <motion.div initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.65 }}
        className="grid w-full max-w-[1000px] overflow-hidden rounded-[26px] border border-[#DCE7E0] bg-white shadow-[0_15px_50px_rgba(16,63,48,0.10)] lg:grid-cols-2">

        {/* Panneau gauche */}
        <div className="relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#103F30] via-[#176B46] to-[#23996A] px-6 py-7 text-center text-white lg:min-h-[500px] lg:px-10">

          {/* Décorations */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5"/>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full border-[45px] border-white/5"/>
          <div aria-hidden="true" className="pointer-events-none absolute right-10 top-24 h-4 w-4 rotate-45 rounded-sm bg-white/20"/>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-24 left-10 h-3 w-3 rounded-full bg-[#38BDF8]/60"/>

          <div className="relative z-10 flex w-full flex-col items-center">

            {/* Identité ONG */}
            <div className="flex items-center gap-3 text-left">
              <img src="/logo.png" alt="ONG TSINJO AINA"
                className="h-14 w-14 shrink-0 rounded-full bg-white object-contain p-1 shadow-md"/>
              <div>
                <h2 className="text-base font-bold tracking-wide sm:text-lg">ONG TSINJO AINA</h2>
                <p className="text-xs font-medium tracking-wider text-white/80">FIANARANTSOA</p>
              </div>
            </div>

            {/* Bienvenue */}
            <h1 className="login-display mt-6 text-3xl font-bold sm:text-4xl lg:text-[44px]">
              {tr.welcome}
            </h1>
            <p className="mt-2 max-w-[310px] text-center text-sm leading-relaxed text-white/85">
              {tr.welcomeDesc}
            </p>

            {/* Illustration */}
            {!avatarError ? (
              <motion.img src="/images/avatar-connexion.svg" alt=""
                onError={() => setAvatarError(true)}
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2 }}
                className="mt-4 hidden h-[230px] w-full max-w-[320px] object-contain lg:block"/>
            ) : (
              <div className="mt-6 hidden h-[200px] w-[200px] items-center justify-center rounded-full border border-white/20 bg-white/10 lg:flex">
                <ShieldCheck size={110} strokeWidth={1.2} className="text-white/90"/>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/80">
              <ShieldCheck size={16}/>
              {tr.adminSpace}
            </div>
          </div>
        </div>

        {/* Panneau droit */}
        <div className="relative flex min-w-0 flex-col justify-center bg-white px-6 py-7 sm:px-10 lg:px-12 lg:py-8">

          {/* Retour accueil */}
          <div className="mb-5">
            <Link to="/" className="group flex w-fit items-center gap-2 text-sm font-semibold text-[#176B46] transition-colors hover:text-[#103F30]">
              <ArrowLeft size={17} className="shrink-0 transition-transform motion-safe:group-hover:-translate-x-1"/>
              {tr.home}
            </Link>
          </div>

          {/* En-tête */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F3ED] px-3 py-1.5 text-xs font-semibold text-[#176B46]">
              <ShieldCheck size={15}/>
              {tr.admin}
            </span>
            <h2 className="login-display mt-3 text-3xl font-bold tracking-tight text-[#103F30] sm:text-4xl">
              {tr.login}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              {tr.description}
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div role="alert" className="mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {tr[error] || tr.error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Adresse email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-[#334155]">
                {tr.email}
              </label>
              <div className="relative">
                <Mail size={19} strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"/>
                <input id="login-email" type="email" name="email"
                  autoComplete="username" placeholder={tr.emailPlaceholder}
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={inputClass} required/>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-[#334155]">
                {tr.password}
              </label>
              <div className="relative">
                <Lock size={19} strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"/>
                <input id="login-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12!`} required/>

                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? tr.hide : tr.show}
                  title={showPassword ? tr.hide : tr.show}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E8F3ED] hover:text-[#176B46]">
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              <div className="mt-2 flex justify-end">
                <button type="button" onClick={handleForgotPassword}
                  className="text-xs font-semibold text-[#176B46] hover:underline">
                  {tr.forgot}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button type="submit" disabled={isLoading} aria-busy={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176B46] text-sm font-semibold text-white shadow-[0_5px_15px_rgba(23,107,70,0.18)] transition-all duration-300 hover:bg-[#103F30] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? <Loader2 size={19} className="animate-spin"/> : <LogIn size={19}/>}
              {isLoading ? tr.loading : tr.submit}
            </button>
          </form>

          {/* Copyright */}
          <div className="mt-6 border-t border-[#E2E8F0] pt-4">
            <p className="text-center text-xs leading-relaxed text-[#64748B]">
              © {new Date().getFullYear()} ONG TSINJO AINA Fianarantsoa
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        .login-page { font-family: 'DM Sans', sans-serif; }
        .login-display { font-family: 'Playfair Display', serif; }
        .login-page input::-ms-reveal,
        .login-page input::-ms-clear { display: none !important; }
        .login-page input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #F8FAF9 inset !important;
          -webkit-text-fill-color: #1E293B !important;
        }
      `}</style>
    </div>
  );
}