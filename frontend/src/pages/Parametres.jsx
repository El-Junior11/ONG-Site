import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Edit, Trash2, Settings, Save, X, Loader2, ArrowLeft, 
    User, Mail, Lock, Camera, ShieldCheck, Eye, EyeOff 
} from 'lucide-react';
import Swal from 'sweetalert2';

// 1. COMPONENT MITOKANA HO AN'NY ADMIN PROFILE (BACKEND)
const AdminProfile = ({ adminUser, setAdminUser }) => {
    const [newEmail, setNewEmail] = useState(adminUser?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api/admin';

    useEffect(() => {
        if (adminUser?.email) setNewEmail(adminUser.email);
    }, [adminUser]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            if (!newEmail) throw new Error("L'email ne peut pas être vide.");

            const payload = {
                email: newEmail,
                ...(newPassword && { password: newPassword })
            };

            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                setAdminUser(data);
                Swal.fire({ 
                    title: 'Profil mis à jour !', 
                    icon: 'success', 
                    confirmButtonColor: '#0b4f86', 
                    timer: 1500, 
                    showConfirmButton: false 
                });
                setNewPassword('');
            } else {
                throw new Error(data.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            Swal.fire('Erreur', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_30px_rgba(11,79,134,0.08)] border border-[var(--paper-line)] relative overflow-hidden text-[var(--ink)]">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 text-[var(--sky)] rotate-12 pointer-events-none">
                <ShieldCheck size={200} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-2 w-2 bg-[var(--sky)] rounded-full animate-pulse"></div>
                    <h2 className="text-[10px] font-mono-label font-black uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                        Sécurité Administrateur (Backend)
                    </h2>
                </div>
                
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Admin Actuel</label>
                        <div className="flex items-center gap-3 bg-[var(--paper)] p-4 rounded-2xl border border-[var(--paper-line)]">
                            <div className="bg-[var(--sky-ice)] p-2 rounded-xl text-[var(--sky)]">
                                <User size={16} />
                            </div>
                            <span className="text-sm font-bold text-[var(--ink)]">
                                {adminUser?.email || 'admin@ong.mg'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono-label font-bold text-[var(--sky)] uppercase tracking-widest ml-1">Modifier l'Email</label>
                        <div className="group flex items-center gap-3 bg-[var(--paper)] p-1 rounded-2xl border border-[var(--paper-line)] focus-within:border-[var(--sky)] transition-all">
                            <div className="pl-4 text-[var(--ink-soft)]">
                                <Mail size={16} />
                            </div>
                            <input 
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-transparent border-none text-sm p-3 w-full outline-none text-[var(--ink)] font-bold placeholder:text-gray-400"
                                placeholder="Nouvel email"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono-label font-bold text-[var(--sky)] uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <div className="group flex items-center gap-3 bg-[var(--paper)] p-1 rounded-2xl border border-[var(--paper-line)] focus-within:border-[var(--sky)] transition-all">
                            <div className="pl-4 text-[var(--ink-soft)]">
                                <Lock size={16} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-transparent border-none text-sm p-3 w-full outline-none text-[var(--ink)] font-bold placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-4 text-[var(--ink-soft)] hover:text-[var(--sky)] transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="w-full mt-4 rounded-2xl bg-[var(--sky)] py-4 font-mono-label font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--sky)]/20 transition-all duration-300 hover:bg-[var(--sky-bright)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> <span>Mettre à jour</span></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. MAIN COMPONENT: PARAMETRES (BACKEND)
const Parametres = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); 
    const [formData, setFormData] = useState({ name: '', role: '', image: null });
    const [uploading, setUploading] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    const navigate = useNavigate();
    const TEAM_API_URL = 'http://localhost:5000/api/team';
    const ADMIN_API_URL = 'http://localhost:5000/api/admin';

    // Famakiana data ekipa avy ao amin'ny Backend
    const fetchTeam = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(TEAM_API_URL);
            if (response.ok) {
                const data = await response.json();
                setTeam(data);
            } else {
                console.error("Erreur de chargement des membres");
            }
        } catch (err) {
            console.error("Error loading team:", err);
        } finally {
            setLoading(false);
        }
    }, [TEAM_API_URL]);

    // Famakiana data admin avy ao amin'ny Backend
    const fetchAdmin = useCallback(async () => {
        try {
            const response = await fetch(ADMIN_API_URL);
            if (response.ok) {
                const data = await response.json();
                setAdminUser(data);
            }
        } catch (err) {
            console.error("Error loading admin info:", err);
        }
    }, [ADMIN_API_URL]);

    useEffect(() => {
        fetchAdmin();
        fetchTeam();
    }, [fetchAdmin, fetchTeam]);

    // Ovaina ho Base64 ilay sary mba handefasana azy any amin'ny API
    const handleImageConvert = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            // Raha tsy misy sary vaovao voafidy dia ampiasaina ilay sary taloha (raha manova) na tsisy
            let imageUrl = editingItem?.img || editingItem?.image || '';
            if (formData.image) {
                imageUrl = await handleImageConvert(formData.image);
            }

            const payload = {
                name: formData.name,
                role: formData.role,
                img: imageUrl
            };

            let response;
            const targetId = editingItem.id || editingItem._id; // Jereo ny ID

            if (editingItem && targetId) {
                response = await fetch(`${TEAM_API_URL}/${targetId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(TEAM_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                await fetchTeam();
                Swal.fire({ icon: 'success', title: 'Action réussie !', showConfirmButton: false, timer: 1500 });
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ name: '', role: '', image: null });
            } else {
                throw new Error("Erreur lors de l'enregistrement");
            }
        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Supprimer ce membre ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0b4f86',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non', 
            reverseButtons: true    
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${TEAM_API_URL}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setTeam(team.filter(member => member.id !== id));
                    Swal.fire({
                        title: 'Supprimé !',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error("Erreur lors de la suppression");
                }
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[var(--paper)] min-h-screen text-[var(--ink)] font-body">
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--sky)] rounded-2xl shadow-lg shadow-[var(--sky)]/20 text-white">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-[var(--ink)] tracking-tight uppercase">Configuration</h1>
                        <p className="text-[var(--ink-soft)] text-xs font-mono-label font-bold uppercase tracking-widest">Gestion d'équipe & Sécurité (Backend)</p>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-4 py-2 bg-white border border-[var(--paper-line)] rounded-2xl text-[var(--ink)] font-bold text-sm hover:border-[var(--sky)] transition-all shadow-sm cursor-pointer">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* TAHADIR EKIPA (TEAM LIST) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-[var(--paper-line)] shadow-[0_10px_30px_rgba(11,79,134,0.08)] overflow-hidden">
                        <div className="p-6 border-b border-[var(--paper-line)] flex justify-between items-center bg-[var(--paper)]/50">
                            <h2 className="text-sm font-display font-black text-[var(--ink)] uppercase tracking-widest flex items-center gap-2">
                                <User size={16} className="text-[var(--sky)]" /> Membres de l'organisation
                            </h2>
                            <button 
                                onClick={() => { setEditingItem(null); setFormData({name:'', role:'', image: null}); setIsModalOpen(true); }}
                                className="flex items-center gap-2 bg-[var(--sky)] text-white px-4 py-2.5 rounded-xl hover:bg-[var(--sky-bright)] shadow-md shadow-[var(--sky)]/20 transition-all text-xs font-mono-label font-black cursor-pointer"
                            >
                                <Plus size={16} /> AJOUTER
                            </button>
                        </div>

                        <div className="p-2 overflow-x-auto">
                            {loading ? (
                                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[var(--sky)]" size={40} /></div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-mono-label font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] bg-[var(--paper)]">
                                            <th className="px-6 py-4 text-left">Profil</th>
                                            <th className="px-6 py-4 text-left">Poste / Rôle</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--paper-line)]">
                                        {team.map((member) => (
                                            <tr key={member.id} className="group hover:bg-[var(--sky-ice)]/30 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--paper-line)] shadow-sm bg-[var(--paper)]">
                                                            <img 
                                                                src={
                                                                    member.img || 
                                                                    member.image || 
                                                                    member.image_url || 
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || "Membre")}&background=0b4f86&color=fff`
                                                                } 
                                                                alt={member.name} 
                                                                className="w-full h-full object-cover" 
                                                                onError={(e) => {
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || "Membre")}&background=0b4f86&color=fff`;
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-[var(--ink)] text-sm">{member.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-[var(--sky-ice)] border border-[var(--paper-line)] rounded-full text-[10px] font-mono-label font-black text-[var(--sky)] uppercase tracking-wide">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button 
                                                            onClick={() => { 
                                                                setEditingItem(member); 
                                                                setFormData({name: member.name, role: member.role, image: null}); 
                                                                setIsModalOpen(true); 
                                                            }} 
                                                            className="p-2.5 bg-[var(--sky-ice)] text-[var(--sky)] rounded-xl border border-[var(--paper-line)] hover:bg-[var(--sky)] hover:text-white transition-all group/edit cursor-pointer"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} className="group-hover/edit:scale-110 transition-transform" />
                                                        </button>

                                                        <button 
                                                            onClick={() => handleDelete(member.id)} 
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all group/del cursor-pointer"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* ADMIN PROFILE SECTION */}
                <div className="lg:col-span-4">
                    <AdminProfile adminUser={adminUser} setAdminUser={setAdminUser} />
                </div>
            </div>

            {/* MODAL FOMBA FANAMPIANA/FANAMPIANA MEMBRE */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[var(--ink)]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[var(--paper-line)] animate-in fade-in zoom-in duration-300 text-[var(--ink)]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-display font-black text-[var(--ink)] uppercase tracking-tight">
                                {editingItem ? 'Modifier' : 'Nouveau'} <span className="text-[var(--sky)]">Membre</span>
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--paper)] rounded-full transition-colors cursor-pointer"><X size={20} className="text-[var(--ink-soft)]" /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Nom & Prénom</label>
                                <input type="text" placeholder="Nom complet" required className="w-full p-3.5 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:border-[var(--sky)] transition-all font-bold text-[var(--ink)] text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Poste occupé</label>
                                <input type="text" placeholder="Poste" required className="w-full p-3.5 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:border-[var(--sky)] transition-all font-bold text-[var(--ink)] text-sm" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Photo de profil</label>
                                <div className="relative group">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
                                    <div className="w-full p-4 bg-[var(--paper)] border-2 border-dashed border-[var(--paper-line)] rounded-2xl flex items-center justify-center gap-3 text-[var(--ink-soft)] font-bold group-hover:border-[var(--sky)] group-hover:text-[var(--sky)] transition-all text-xs">
                                        <Camera size={18} />
                                        <span>{formData.image ? formData.image.name : "Choisir une photo"}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-[var(--sky)] text-white py-4 rounded-2xl font-mono-label font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-[var(--sky-bright)] shadow-lg shadow-[var(--sky)]/20 transition-all disabled:opacity-50 cursor-pointer mt-6"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> CONFIRMER</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parametres;