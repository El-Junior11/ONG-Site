import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, LogIn, KeyRound } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // States ho an'ny OTP / Famaivanana Password
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    
    const navigate = useNavigate();

    // Toast configuration kanto (SweetAlert2)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // 1. Fidirana Admin tena izy mifandray amin'ny Backend Node.js
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Connexion réussie ! Bienvenue dans l’espace administrateur.'
                });

                setEmail('');
                setPassword('');

                setTimeout(() => {
                    navigate('/interventions-list');
                }, 1000);
            } else {
                setError(data.erreur || "Erreur de connexion.");
                Toast.fire({
                    icon: 'error',
                    title: 'Erreur de connexion',
                    text: data.erreur || 'Veuillez vérifier vos informations.'
                });
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Olana tamin'ny serveur:", err);
            setError("Tsy tafiditra: Tsy mifandray amin'ny serveur backend.");
            Toast.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: 'Impossible de joindre le serveur backend.'
            });
        }
    };

    // 2. Fandefasana ny kaody (OTP)
    const handleSendCode = () => {
        if (!email) {
            Toast.fire({
                icon: 'warning',
                title: 'Adresse email requise',
                text: 'Veuillez saisir votre e-mail d’abord.'
            });
            return;
        }

        Swal.fire({
            title: 'Envoi en cours...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            Swal.close();
            Toast.fire({
                icon: 'success',
                title: 'Code envoyé !',
                text: 'Un code de vérification a été envoyé à votre email.'
            });
            setStep(2);
        }, 1200);
    };
    
    // 3. Hanamarinana ny kaody OTP
    const handleVerifyCode = (e) => {
        e.preventDefault();
        if (!otp) return;

        Swal.fire({
            title: 'Vérification...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            Swal.close();
            Toast.fire({
                icon: 'success',
                title: 'Connexion réussie !',
                text: 'Bienvenue Admin.'
            });

            setTimeout(() => {
                navigate('/interventions-list');
            }, 1000);
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--paper)] overflow-hidden p-4 font-body">
            <div className="flex flex-col lg:flex-row w-full max-w-md lg:max-w-4xl bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(11,79,134,0.08)] overflow-hidden border border-[var(--paper-line)]">
                
                {/* 1. ANKAVIA: SARY / ILUSTRATION */}
                <div className="w-full lg:w-1/2 relative bg-[var(--sky-ice)] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[var(--paper-line)] h-56 sm:h-64 lg:h-[32rem] overflow-hidden">
                    <img 
                        src="/Logo TAF 3D.png" 
                        alt="Admin Illustration" 
                        className="w-full h-full object-cover opacity-90"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&fit=crop"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/30 via-transparent to-transparent"></div>
                </div>
    
                {/* 2. ANKAVANANA: FORMULAIRE */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
                    <div className="w-full max-w-xs space-y-6 text-left">
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[var(--sky-ice)] rounded-2xl border border-[var(--paper-line)] shadow-sm">
                                    <ShieldCheck className="text-[var(--sky)]" size={22} />
                                </div>
                                <h2 className="text-xl font-display font-extrabold text-[var(--ink)] uppercase tracking-tight">
                                    Espace <span className="text-[var(--sky)]">Admin</span>
                                </h2>
                            </div>
                            <p className="text-[var(--ink-soft)] text-xs font-medium ml-1">
                                {step === 1 ? "Connectez-vous pour accéder à la gestion." : "Entrez le code reçu par email."}
                            </p>
                        </div>
    
                        {error && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold rounded-r-xl">
                                {error}
                            </div>
                        )}
    
                        {/* STEP 1: LOGIN NORMAL */}
                        {step === 1 ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">
                                        Adresse Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" size={18} />
                                        <input 
                                            type="email"
                                            className="w-full pl-11 pr-4 py-3 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl focus:ring-2 focus:ring-[var(--sky)] text-sm outline-none transition-all text-[var(--ink)]"
                                            placeholder="nom@exemple.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
    
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1">
                                        Mot de passe
                                    </label>
                                    
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" size={18} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            className="w-full pl-11 pr-11 py-3 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl focus:ring-2 focus:ring-[var(--sky)] text-sm outline-none transition-all text-[var(--ink)]"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)] hover:text-[var(--sky)] p-1"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    <div className="flex justify-end px-1 pt-1">
                                        <button 
                                            type="button"
                                            onClick={handleSendCode}
                                            className="text-[11px] font-mono-label font-bold text-[var(--sky)] hover:underline transition-colors"
                                        >
                                            Mot de passe oublié ?
                                        </button>
                                    </div>
                                </div>
    
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[var(--sky)] text-white py-3.5 rounded-2xl font-mono-label font-bold uppercase tracking-widest text-xs shadow-lg shadow-[var(--sky)]/20 hover:bg-[var(--sky-bright)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <LogIn size={18} />
                                    {isLoading ? "Vérification..." : "Se connecter"}
                                </button>
                            </form>
                        ) : (
                            /* STEP 2: VERIFICATION CODE OTP */
                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest ml-1 text-center block">
                                        Code de vérification
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" size={18} />
                                        <input 
                                            type="text"
                                            className="w-full pl-4 pr-4 py-3 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl focus:ring-2 focus:ring-[var(--sky)] text-base outline-none transition-all text-center font-bold font-mono tracking-[0.4em] text-[var(--ink)]"
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={8}
                                            required
                                        />
                                    </div>
                                </div>
    
                                <button 
                                    type="submit"
                                    className="w-full bg-[var(--sky)] text-white py-3.5 rounded-2xl font-mono-label font-bold uppercase tracking-widest text-xs shadow-lg shadow-[var(--sky)]/20 hover:bg-[var(--sky-bright)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Vérifier le code
                                </button>
    
                                <button 
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest hover:text-[var(--sky)] transition-colors pt-2"
                                >
                                    Retour au login
                                </button>
                            </form>
                        )}
    
                    </div>
                </div>
            </div>
    
            <style>{`
                input::-ms-reveal, input::-ms-clear, input::-webkit-password-reveal {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}

export default Login;