import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Edit, Trash2, Settings, Save, X, Loader2, ArrowLeft, 
    User, Mail, Lock, Camera, ShieldCheck, Eye, EyeOff, Search, RefreshCcw
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios';

/* ------------------------------------------------------------------ */
/*  Toasts SweetAlert2 : tous les messages passent par ces helpers     */
/* ------------------------------------------------------------------ */
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const notify = (icon, title, text) =>
    Toast.fire({
        icon,
        title,
        text,
        timer: icon === 'error' ? 4500 : 2500
    });

// Toast de confirmation avec boutons (pas de fenêtre modale)
const confirmToast = ({ title, text, icon = 'question', confirmText = 'Oui', cancelText = 'Non', confirmColor = '#1C86C9' }) =>
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon,
        title,
        text,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#45566E',
        reverseButtons: true,
        timer: undefined
    });

const getErrorMessage = (err, fallback) =>
    err.response?.data?.message || err.response?.data?.erreur || err.message || fallback;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getAvatar = (member) =>
    member.img ||
    member.image ||
    member.image_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || "Membre")}&background=0b4f86&color=fff`;

const getMemberId = (member) => member?.id || member?._id;

const AdminProfile = ({ adminUser, setAdminUser }) => {
    const [newEmail, setNewEmail] = useState(adminUser?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (adminUser?.email) setNewEmail(adminUser.email);
    }, [adminUser]);

    const emailChanged = newEmail.trim() !== (adminUser?.email || '');
    const hasChanges = emailChanged || newPassword.length > 0;

    const handleUpdateProfile = async () => {
        const email = newEmail.trim();

        if (!email) {
            notify('warning', 'Email manquant', "L'email ne peut pas être vide.");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            notify('warning', 'Email invalide', 'Vérifiez le format de l\'adresse email.');
            return;
        }

        if (!hasChanges) {
            notify('info', 'Aucune modification');
            return;
        }

        if (newPassword) {
            if (newPassword.length < MIN_PASSWORD_LENGTH) {
                notify('warning', 'Mot de passe trop court', `Minimum ${MIN_PASSWORD_LENGTH} caractères.`);
                return;
            }

            if (newPassword !== confirmPassword) {
                notify('warning', 'Mots de passe différents', 'La confirmation ne correspond pas.');
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                email,
                ...(newPassword && { password: newPassword })
            };

            const response = await api.put('/admin', payload);

            setAdminUser(response.data);
            setNewPassword('');
            setConfirmPassword('');
            notify('success', 'Profil mis à jour');
        } catch (error) {
            notify('error', 'Erreur', getErrorMessage(error, 'Erreur lors de la mise à jour'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(11,79,134,0.08)] border border-[var(--paper-line)] relative overflow-hidden text-[var(--ink)]">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 text-[var(--sky)] rotate-12 pointer-events-none">
                <ShieldCheck size={200} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-2 w-2 bg-[var(--sky)] rounded-full animate-pulse"></div>
                    <h2 className="text-[10px] font-mono-label font-black uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                        Sécurité Administrateur (Backend)
                    </h2>
                </div>
                
                <div className="space-y-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Admin Actuel</label>
                        <div className="flex items-center gap-3 bg-[var(--paper)] p-4 rounded-2xl border border-[var(--paper-line)]">
                            <div className="bg-[var(--sky-ice)] p-2 rounded-xl text-[var(--sky)]">
                                <User size={16} />
                            </div>
                            <span className="text-sm font-bold text-[var(--ink)] break-all">
                                {adminUser?.email || 'admin@ong.mg'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="admin-email" className="text-[10px] font-mono-label font-bold text-[var(--sky)] uppercase tracking-widest ml-1">Modifier l'Email</label>
                        <div className="group flex items-center gap-3 bg-[var(--paper)] p-1 rounded-2xl border border-[var(--paper-line)] focus-within:border-[var(--sky)] transition-all">
                            <div className="pl-4 text-[var(--ink-soft)]">
                                <Mail size={16} />
                            </div>
                            <input 
                                id="admin-email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-transparent border-none text-sm p-3 w-full outline-none text-[var(--ink)] font-bold placeholder:text-gray-400"
                                placeholder="Nouvel email"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="admin-password" className="text-[10px] font-mono-label font-bold text-[var(--sky)] uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <div className="group flex items-center gap-3 bg-[var(--paper)] p-1 rounded-2xl border border-[var(--paper-line)] focus-within:border-[var(--sky)] transition-all">
                            <div className="pl-4 text-[var(--ink-soft)]">
                                <Lock size={16} />
                            </div>
                            <input 
                                id="admin-password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-transparent border-none text-sm p-3 w-full outline-none text-[var(--ink)] font-bold placeholder:text-gray-400"
                                placeholder="Laisser vide pour ne pas changer"
                                autoComplete="new-password"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-4 text-[var(--ink-soft)] hover:text-[var(--sky)] transition-colors"
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {newPassword && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="admin-password-confirm" className="text-[10px] font-mono-label font-bold text-[var(--sky)] uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                            <div className="group flex items-center gap-3 bg-[var(--paper)] p-1 rounded-2xl border border-[var(--paper-line)] focus-within:border-[var(--sky)] transition-all">
                                <div className="pl-4 text-[var(--ink-soft)]">
                                    <Lock size={16} />
                                </div>
                                <input 
                                    id="admin-password-confirm"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-transparent border-none text-sm p-3 w-full outline-none text-[var(--ink)] font-bold placeholder:text-gray-400"
                                    placeholder="Retapez le mot de passe"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleUpdateProfile}
                        disabled={loading || !hasChanges}
                        className="w-full mt-2 rounded-2xl bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] py-4 font-mono-label font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--sky)]/20 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> <span>Mettre à jour</span></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Parametres = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); 
    const [formData, setFormData] = useState({ name: '', role: '', image: null });
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [search, setSearch] = useState('');

    const navigate = useNavigate();

    const fetchTeam = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await api.get('/team');
            setTeam(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error loading team:", err);
            notify('error', "Chargement de l'équipe impossible", getErrorMessage(err, 'Serveur injoignable'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAdmin = useCallback(async () => {
        try {
            const response = await api.get('/admin');
            setAdminUser(response.data);
        } catch (err) {
            console.error("Error loading admin info:", err);
            notify('error', 'Profil administrateur indisponible', getErrorMessage(err, 'Serveur injoignable'));
        }
    }, []);

    useEffect(() => {
        fetchAdmin();
        fetchTeam();
    }, [fetchAdmin, fetchTeam]);

    // Aperçu de la nouvelle photo choisie (libéré à chaque changement)
    useEffect(() => {
        if (!formData.image) {
            setPreviewUrl('');
            return;
        }

        const url = URL.createObjectURL(formData.image);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [formData.image]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', role: '', image: null });
    }, []);

    // Fermer la fenêtre avec la touche Échap
    useEffect(() => {
        if (!isModalOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isModalOpen, closeModal]);

    const filteredTeam = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return team;

        return team.filter(m =>
            (m.name || '').toLowerCase().includes(q) ||
            (m.role || '').toLowerCase().includes(q)
        );
    }, [team, search]);

    const openCreate = () => {
        setEditingItem(null);
        setFormData({ name: '', role: '', image: null });
        setIsModalOpen(true);
    };

    const openEdit = (member) => {
        setEditingItem(member);
        setFormData({ name: member.name || '', role: member.role || '', image: null });
        setIsModalOpen(true);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            notify('error', 'Fichier invalide', 'Veuillez choisir une image.');
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            notify('warning', 'Image trop lourde', 'La photo ne doit pas dépasser 5 Mo.');
            return;
        }

        setFormData(prev => ({ ...prev, image: file }));
    };

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

        const name = formData.name.trim();
        const role = formData.role.trim();

        if (!name || !role) {
            notify('warning', 'Champs incomplets', 'Le nom et le poste sont obligatoires.');
            return;
        }

        setUploading(true);
        try {
            let imageUrl = editingItem?.img || editingItem?.image || '';
            if (formData.image) {
                imageUrl = await handleImageConvert(formData.image);
            }

            const payload = { name, role, img: imageUrl };
            const targetId = getMemberId(editingItem);

            if (editingItem && targetId) {
                await api.put(`/team/${targetId}`, payload);
            } else {
                await api.post('/team', payload);
            }

            await fetchTeam(true);
            notify('success', editingItem ? 'Membre modifié' : 'Membre ajouté');
            closeModal();
        } catch (err) {
            notify('error', 'Erreur', getErrorMessage(err, "Erreur lors de l'enregistrement"));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (member) => {
        const id = getMemberId(member);

        const result = await confirmToast({
            title: `Supprimer ${member.name || 'ce membre'} ?`,
            text: 'Cette action est irréversible.',
            icon: 'warning',
            confirmText: 'Oui, supprimer',
            cancelText: 'Annuler',
            confirmColor: '#ef4444'
        });

        if (!result.isConfirmed) return;

        setDeletingId(id);
        try {
            await api.delete(`/team/${id}`);
            setTeam(prev => prev.filter(m => getMemberId(m) !== id));
            notify('success', 'Membre supprimé');
        } catch (err) {
            notify('error', 'Erreur', getErrorMessage(err, 'Erreur lors de la suppression'));
        } finally {
            setDeletingId(null);
        }
    };

    // Photo affichée dans la fenêtre : nouvelle sélection, sinon photo actuelle
    const modalPhoto = previewUrl || (editingItem ? getAvatar(editingItem) : '');

    return (
        <div className="p-4 md:p-8 bg-[var(--paper)] min-h-screen text-[var(--ink)] font-body">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-gradient-to-br from-[var(--sky)] to-[var(--sky-bright)] rounded-2xl shadow-lg shadow-[var(--sky)]/20 text-white">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-[var(--ink)] tracking-tight uppercase">Configuration</h1>
                        <p className="text-[var(--ink-soft)] text-xs font-mono-label font-bold uppercase tracking-widest">Gestion d'équipe & Sécurité (Backend)</p>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-4 py-2 w-fit bg-white border border-[var(--paper-line)] rounded-2xl text-[var(--ink)] font-bold text-sm hover:border-[var(--sky)] transition-all shadow-sm cursor-pointer">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-[var(--paper-line)] shadow-[0_10px_30px_rgba(11,79,134,0.08)] overflow-hidden">
                        <div className="p-5 md:p-6 border-b border-[var(--paper-line)] flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-[var(--paper)]/50">
                            <h2 className="text-sm font-display font-black text-[var(--ink)] uppercase tracking-widest flex items-center gap-2">
                                <User size={16} className="text-[var(--sky)]" /> Membres de l'organisation
                                <span className="px-2 py-0.5 bg-[var(--sky-ice)] text-[var(--sky-deep)] rounded-full text-[10px] font-mono-label font-bold border border-[var(--paper-line)]">
                                    {team.length}
                                </span>
                            </h2>

                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 md:flex-none">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher..."
                                        className="w-full md:w-48 pl-9 pr-3 py-2.5 bg-white border border-[var(--paper-line)] rounded-xl text-xs font-bold text-[var(--ink)] outline-none focus:border-[var(--sky)] transition-all"
                                    />
                                </div>

                                <button
                                    onClick={() => fetchTeam()}
                                    className="p-2.5 bg-white border border-[var(--paper-line)] rounded-xl text-[var(--ink-soft)] hover:text-[var(--sky)] hover:border-[var(--sky)] transition-all cursor-pointer"
                                    title="Actualiser"
                                    aria-label="Actualiser"
                                >
                                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>

                                <button 
                                    onClick={openCreate}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white px-4 py-2.5 rounded-xl shadow-md shadow-[var(--sky)]/20 hover:shadow-lg transition-all text-xs font-mono-label font-black cursor-pointer"
                                >
                                    <Plus size={16} /> AJOUTER
                                </button>
                            </div>
                        </div>

                        <div className="p-2 overflow-x-auto">
                            {loading ? (
                                <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[var(--sky)]" size={40} /></div>
                            ) : filteredTeam.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] font-mono-label font-black text-[var(--ink-soft)] uppercase tracking-[0.2em] bg-[var(--paper)]">
                                            <th className="px-6 py-4 text-left rounded-l-xl">Profil</th>
                                            <th className="px-6 py-4 text-left">Poste / Rôle</th>
                                            <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--paper-line)]">
                                        {filteredTeam.map((member) => {
                                            const id = getMemberId(member);

                                            return (
                                                <tr key={id} className="group hover:bg-[var(--sky-ice)]/30 transition-all text-left">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--paper-line)] shadow-sm bg-[var(--paper)] shrink-0">
                                                                <img 
                                                                    src={getAvatar(member)} 
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
                                                                onClick={() => openEdit(member)} 
                                                                className="p-2.5 bg-[var(--sky-ice)] text-[var(--sky)] rounded-xl border border-[var(--paper-line)] hover:bg-[var(--sky)] hover:text-white transition-all group/edit cursor-pointer"
                                                                title="Modifier"
                                                                aria-label="Modifier"
                                                            >
                                                                <Edit size={16} className="group-hover/edit:scale-110 transition-transform" />
                                                            </button>

                                                            <button 
                                                                onClick={() => handleDelete(member)} 
                                                                disabled={deletingId === id}
                                                                className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all group/del cursor-pointer disabled:opacity-60"
                                                                title="Supprimer"
                                                                aria-label="Supprimer"
                                                            >
                                                                {deletingId === id
                                                                    ? <Loader2 size={16} className="animate-spin" />
                                                                    : <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="font-display font-extrabold text-lg text-[var(--ink)]">
                                        {team.length === 0 ? 'Aucun membre' : 'Aucun résultat'}
                                    </p>
                                    <p className="text-[var(--ink-soft)] font-mono-label text-[11px] uppercase mt-1">
                                        {team.length === 0 ? "Ajoutez le premier membre de l'équipe." : 'Modifiez votre recherche.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <AdminProfile adminUser={adminUser} setAdminUser={setAdminUser} />
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-[var(--ink)]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-[2rem] p-6 md:p-10 shadow-2xl border border-[var(--paper-line)] text-[var(--ink)] max-h-[92vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-display font-black text-[var(--ink)] uppercase tracking-tight">
                                {editingItem ? 'Modifier' : 'Nouveau'} <span className="text-[var(--sky)]">Membre</span>
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-[var(--paper)] rounded-full transition-colors cursor-pointer" aria-label="Fermer">
                                <X size={20} className="text-[var(--ink-soft)]" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Nom & Prénom</label>
                                <input type="text" placeholder="Nom complet" required className="w-full p-3.5 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:border-[var(--sky)] transition-all font-bold text-[var(--ink)] text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Poste occupé</label>
                                <input type="text" placeholder="Poste" required className="w-full p-3.5 bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl outline-none focus:border-[var(--sky)] transition-all font-bold text-[var(--ink)] text-sm" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-widest ml-1">Photo de profil (5 Mo max)</label>

                                <div className="flex items-center gap-4">
                                    {modalPhoto && (
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[var(--paper-line)] shadow-sm bg-[var(--paper)] shrink-0">
                                            <img src={modalPhoto} alt="Aperçu" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="relative group flex-1">
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handlePhotoChange} />
                                        <div className="w-full p-4 bg-[var(--paper)] border-2 border-dashed border-[var(--paper-line)] rounded-2xl flex items-center justify-center gap-3 text-[var(--ink-soft)] font-bold group-hover:border-[var(--sky)] group-hover:text-[var(--sky)] transition-all text-xs">
                                            <Camera size={18} />
                                            <span className="truncate">{formData.image ? formData.image.name : (editingItem ? "Changer la photo" : "Choisir une photo")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white py-4 rounded-2xl font-mono-label font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-[var(--sky)]/20 hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer mt-6"
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