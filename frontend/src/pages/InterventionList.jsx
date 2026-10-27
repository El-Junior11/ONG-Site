import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { 
    PlusCircle, LogOut, LayoutList, Trash2, Edit3, Send, 
    RefreshCcw, Settings, MapPin, X, Save, Type, 
    Image as ImageIcon, AlignLeft, Eye, EyeOff, Loader2,
    Info, Search
} from 'lucide-react';
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

// Toast de confirmation (avec boutons), sans fenêtre modale
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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo par image

const EMPTY_FORM = {
    title: '',
    location: '',
    description: '',
    image: [],
    is_published: false
};

const getCover = (item) =>
    (item.image && Array.isArray(item.image) && item.image.length > 0)
        ? item.image[0]
        : (item.image_url
            ? item.image_url
            : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=300&h=300&fit=crop");

const InterventionList = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    // Recherche et filtre
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | published | draft

    const loadData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const response = await api.get('/interventions');
            setInterventions(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Erreur de chargement Backend:", err);
            notify('error', 'Serveur injoignable', 'Impossible de joindre le serveur backend');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Fermer le formulaire avec la touche Échap
    useEffect(() => {
        if (!isFormOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') resetForm();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isFormOpen]);

    const filteredInterventions = useMemo(() => {
        const q = search.trim().toLowerCase();

        return interventions.filter((item) => {
            const matchStatus =
                statusFilter === 'all' ||
                (statusFilter === 'published' && item.is_published) ||
                (statusFilter === 'draft' && !item.is_published);

            const matchSearch =
                !q ||
                (item.title || '').toLowerCase().includes(q) ||
                (item.location || '').toLowerCase().includes(q) ||
                (item.description || '').toLowerCase().includes(q);

            return matchStatus && matchSearch;
        });
    }, [interventions, search, statusFilter]);

    const counts = useMemo(() => ({
        all: interventions.length,
        published: interventions.filter(i => i.is_published).length,
        draft: interventions.filter(i => !i.is_published).length
    }), [interventions]);

    const handleLogout = async () => {
        const result = await confirmToast({
            title: 'Se déconnecter ?',
            text: 'Votre session sera fermée.',
            confirmText: 'Oui',
            cancelText: 'Non'
        });

        if (result.isConfirmed) {
            notify('success', 'Déconnexion réussie');
            navigate('/login');
        }
    };

    const deleteIntervention = async (id) => {
        const result = await confirmToast({
            title: 'Supprimer cette intervention ?',
            text: 'Cette action est définitive.',
            icon: 'warning',
            confirmText: 'Oui, supprimer',
            cancelText: 'Annuler',
            confirmColor: '#ef4444'
        });

        if (!result.isConfirmed) return;

        setDeletingId(id);
        try {
            await api.delete(`/interventions/${id}`);
            setInterventions(prev => prev.filter(item => item.id !== id));
            notify('success', 'Supprimé', "L'intervention a été retirée avec succès.");
        } catch (err) {
            notify('error', 'Erreur', err.response?.data?.erreur || 'Erreur lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    };

    // Mise à jour immédiate de l'écran, retour en arrière si le serveur refuse
    const togglePublish = async (id, currentStatus) => {
        const nextStatus = !currentStatus;

        setInterventions(prev =>
            prev.map(item => item.id === id ? { ...item, is_published: nextStatus } : item)
        );

        try {
            await api.patch(`/interventions/${id}/publish`, {
                is_published: nextStatus
            });

            notify('success', nextStatus ? 'Publication réussie' : 'Mis en brouillon');
        } catch (err) {
            setInterventions(prev =>
                prev.map(item => item.id === id ? { ...item, is_published: currentStatus } : item)
            );
            notify('error', 'Erreur de mise à jour', err.response?.data?.erreur);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        const existingImage = item.image_url ? [item.image_url] : [];

        setFormData({
            title: item.title || '',
            location: item.location || '',
            description: item.description || '',
            image: existingImage,
            is_published: item.is_published || false
        });
        
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = formData.title.trim();
        const location = formData.location.trim();
        const description = formData.description.trim();

        if (!title || !location || !description) {
            notify('warning', 'Champs incomplets', 'Titre, localisation et description sont obligatoires.');
            return;
        }

        setSaving(true);

        try {
            const firstImage = Array.isArray(formData.image) && formData.image.length > 0
                ? formData.image[0]
                : (formData.image || '');

            const payload = {
                title,
                location,
                description,
                is_published: formData.is_published,
                image_url: firstImage
            };

            if (editingId) {
                await api.put(`/interventions/${editingId}`, payload);
            } else {
                await api.post('/interventions', payload);
            }

            await loadData(true);

            notify('success', editingId ? 'Modification réussie' : 'Enregistré avec succès');

            resetForm();
        } catch (err) {
            notify('error', 'Erreur technique', err.response?.data?.erreur || err.message);
        } finally {
            setSaving(false);
        } 
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = ''; // permet de re-sélectionner le même fichier
        if (files.length === 0) return;
    
        const allAreImages = files.every(file => file.type.startsWith('image/'));

        if (!allAreImages) {
            notify('error', 'Fichier invalide', 'Veuillez sélectionner uniquement des fichiers images.');
            return;
        }

        const tooBig = files.find(file => file.size > MAX_IMAGE_SIZE);

        if (tooBig) {
            notify('warning', 'Image trop lourde', `"${tooBig.name}" dépasse 5 Mo.`);
            return;
        }
    
        setActionLoading(true);
    
        try {
            const readerPromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
            });

            const base64Images = await Promise.all(readerPromises);
    
            setFormData(prev => ({
                ...prev,
                image: Array.isArray(prev.image) ? [...prev.image, ...base64Images] : base64Images
            }));
    
            notify('success', `${files.length} image(s) ajoutée(s)`);
    
        } catch (error) {
            notify('error', 'Erreur', 'Impossible de charger les images');
        } finally {
            setActionLoading(false);
        }
    };

    const filterTabs = [
        { id: 'all', label: 'Toutes', count: counts.all },
        { id: 'published', label: 'Publiées', count: counts.published },
        { id: 'draft', label: 'Brouillons', count: counts.draft }
    ];

    return (
        <div className="p-4 md:p-8 bg-[var(--paper)] min-h-screen font-body text-[var(--ink)]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(11,79,134,0.06)] border border-[var(--paper-line)] gap-6">
                <div className="flex items-center gap-4 text-left">
                    <div className="bg-gradient-to-br from-[var(--sky)] to-[var(--sky-bright)] p-4 rounded-2xl text-white shadow-lg shadow-[var(--sky)]/30">
                        <LayoutList size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[var(--ink)] tracking-tight">
                            GESTION DES <span className="text-[var(--sky)]">INTERVENTIONS</span>
                        </h2>
                        <p className="text-[var(--ink-soft)] font-mono-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 mt-1">
                            <Info size={14} className="text-[var(--sky)]" />
                            Mode Base de Données (Backend Node.js)
                        </p>
                    </div>
                </div>
        
                <div className="flex items-center gap-3 bg-[var(--paper)] p-2 rounded-3xl border border-[var(--paper-line)]">
                    <button onClick={() => loadData()} className="p-3 text-[var(--ink-soft)] hover:text-[var(--sky)] hover:bg-white rounded-2xl transition-all" title="Actualiser">
                        <RefreshCcw size={22} className={loading ? 'animate-spin' : ''} />
                    </button>

                    <Link to="/settings" className="p-3 text-[var(--ink-soft)] hover:text-[var(--sky)] hover:bg-white rounded-2xl transition-all" title="Paramètres">
                        <Settings size={22} /> 
                    </Link>

                    <button 
                        onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-mono-label font-bold uppercase text-xs tracking-wider transition-all shadow-lg ${
                            isFormOpen 
                            ? 'bg-[var(--paper-line)] text-[var(--ink)] hover:bg-slate-200' 
                            : 'bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white shadow-[var(--sky)]/30'
                        }`}
                    >
                        {isFormOpen ? <X size={20} /> : <PlusCircle size={20} />}
                        <span>{isFormOpen ? 'Fermer' : 'Nouvelle'}</span>
                    </button>

                    <div className="w-px h-8 bg-[var(--paper-line)] mx-1"></div>

                    <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all" title="Déconnexion">
                        <LogOut size={22} />
                    </button>
                </div>
            </div>

            {/* Form */}
            {isFormOpen && (
                <div className="mb-8 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_12px_32px_rgba(11,79,134,0.1)] border border-[var(--paper-line)]">
                    <div className="flex items-center gap-3 mb-6 text-left">
                        <div className="w-2 h-8 bg-[var(--sky)] rounded-full"></div>
                        <h3 className="text-2xl font-display font-extrabold text-[var(--ink)]">
                            {editingId ? 'Modifier l\'Intervention' : 'Ajouter une Intervention'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest mb-2">
                                    <Type size={18} className="text-[var(--sky)]" /> Titre du projet
                                </label>
                                <input 
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Distribution de kits scolaires..."
                                    className="w-full p-4 bg-[var(--paper)] border-2 border-[var(--paper-line)] rounded-2xl text-[var(--ink)] focus:border-[var(--sky)] outline-none transition-all font-medium text-sm"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest mb-2">
                                    <MapPin size={18} className="text-[var(--sky)]" /> Localisation
                                </label>
                                <input 
                                    required
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Antananarivo, Madagascar"
                                    className="w-full p-4 bg-[var(--paper)] border-2 border-[var(--paper-line)] rounded-2xl text-[var(--ink)] focus:border-[var(--sky)] outline-none transition-all font-medium text-sm"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest mb-2">
                                    <ImageIcon size={18} className="text-[var(--sky)]" /> Images
                                </label>
                                <div className="relative">
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        id="file-upload"
                                        multiple 
                                        onChange={handleImageUpload} 
                                        className="hidden" 
                                    />
                                    <label htmlFor="file-upload" className="flex items-center justify-center gap-3 w-full p-4 bg-[var(--paper)] border-2 border-dashed border-[var(--paper-line)] rounded-2xl cursor-pointer hover:border-[var(--sky)] transition-all">
                                        {actionLoading ? (
                                            <Loader2 className="animate-spin text-[var(--sky)]" size={24} />
                                        ) : (
                                            <div className="flex items-center gap-3 text-[var(--ink-soft)] hover:text-[var(--sky)]">
                                                <ImageIcon size={24} />
                                                <span className="font-mono-label font-bold text-xs uppercase">
                                                    {formData.image && formData.image.length > 0 
                                                        ? `${formData.image.length} image(s) sélectionnée(s)` 
                                                        : "Importer des photos (5 Mo max)"}
                                                </span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Aperçu des images avec suppression */}
                                {Array.isArray(formData.image) && formData.image.length > 0 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                                        {formData.image.map((src, idx) => (
                                            <div key={idx} className="relative group/img aspect-square rounded-xl overflow-hidden border border-[var(--paper-line)]">
                                                <img src={src} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />

                                                {idx === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-[var(--ink)]/80 text-white text-[9px] font-mono-label font-bold uppercase px-1.5 py-0.5 rounded-md">
                                                        Couverture
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Retirer cette image"
                                                    aria-label="Retirer cette image"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-mono-label font-bold text-[var(--ink)] uppercase tracking-widest mb-2">
                                    <AlignLeft size={18} className="text-[var(--sky)]" /> Description
                                </label>
                                <textarea 
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="5"
                                    placeholder="Détails de l'intervention..."
                                    className="w-full p-4 bg-[var(--paper)] border-2 border-[var(--paper-line)] rounded-2xl text-[var(--ink)] focus:border-[var(--sky)] outline-none transition-all resize-none font-medium text-sm"
                                ></textarea>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border-2 transition-all w-full ${
                                    formData.is_published ? 'bg-[var(--sky-ice)] border-[var(--sky)]' : 'bg-[var(--paper)] border-[var(--paper-line)]'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${formData.is_published ? 'bg-[var(--sky)] text-white' : 'bg-white text-[var(--ink-soft)]'}`}>
                                            {formData.is_published ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </div>
                                        <span className={`font-mono-label font-bold text-xs uppercase ${formData.is_published ? 'text-[var(--sky-deep)]' : 'text-[var(--ink-soft)]'}`}>
                                            {formData.is_published ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleInputChange}
                                        className="w-6 h-6 accent-[var(--sky)] cursor-pointer"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving || actionLoading}
                                    className="w-full py-4 bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white rounded-2xl font-mono-label font-bold uppercase text-xs tracking-widest shadow-xl shadow-[var(--sky)]/30 hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                                    {editingId ? 'METTRE À JOUR' : 'ENREGISTRER'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Recherche + filtre */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative w-full md:max-w-sm">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un titre, un lieu..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-[var(--paper-line)] rounded-2xl text-sm font-medium text-[var(--ink)] focus:border-[var(--sky)] outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[var(--paper-line)] w-fit">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-mono-label font-bold uppercase tracking-wider transition-all ${
                                statusFilter === tab.id
                                    ? 'bg-[var(--sky)] text-white shadow'
                                    : 'text-[var(--ink-soft)] hover:bg-[var(--sky-ice)] hover:text-[var(--sky-deep)]'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-[0_4px_20px_rgba(11,79,134,0.06)] rounded-[2.5rem] overflow-hidden border border-[var(--paper-line)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[var(--paper)] text-[var(--ink-soft)] uppercase text-[11px] font-mono-label font-black tracking-widest border-b border-[var(--paper-line)]">
                                <th className="px-6 md:px-8 py-5 text-left">Aperçu</th>
                                <th className="px-6 md:px-8 py-5 text-left">Intervention</th>
                                <th className="px-6 md:px-8 py-5 text-left">Description</th>
                                <th className="px-6 md:px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[var(--paper-line)]">
                            {loading && !isFormOpen ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 border-4 border-[var(--paper-line)] border-t-[var(--sky)] rounded-full animate-spin"></div>
                                            <span className="font-mono-label font-bold text-[var(--ink-soft)] uppercase text-xs">
                                                Chargement...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInterventions.length > 0 ? (
                                filteredInterventions.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--paper)]/50 transition-all text-left">
                                        <td className="px-6 md:px-8 py-5">
                                            <div className="relative w-20 h-20 overflow-hidden rounded-2xl shadow-sm border border-[var(--paper-line)]">
                                                <img 
                                                    src={getCover(item)} 
                                                    className="w-full h-full object-cover"
                                                    alt={item.title}
                                                />
                                                {Array.isArray(item.image) && item.image.length > 1 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="text-white font-display font-extrabold text-sm">
                                                            +{item.image.length - 1}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 md:px-8 py-5">
                                            <div className="text-[var(--ink)] font-display font-extrabold text-base">
                                                {item.title}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[var(--sky)] text-xs font-mono-label font-bold mt-1 bg-[var(--sky-ice)] w-fit px-3 py-1 rounded-full border border-[var(--paper-line)]">
                                                <MapPin size={14} />
                                                {item.location || 'Non spécifié'}
                                            </div>
                                            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono-label font-bold uppercase tracking-wider border ${
                                                item.is_published
                                                    ? 'bg-[var(--leaf-ice)] text-[var(--leaf-deep)] border-[var(--leaf)]/25'
                                                    : 'bg-[var(--paper)] text-[var(--ink-soft)] border-[var(--paper-line)]'
                                            }`}>
                                                {item.is_published ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </td>

                                        <td className="px-6 md:px-8 py-5">
                                            <p className="text-[var(--ink-soft)] text-sm line-clamp-2 max-w-sm font-normal">
                                                {item.description || 'Aucune description.'}
                                            </p>
                                        </td>

                                        <td className="px-6 md:px-8 py-5">
                                            <div className="flex justify-center items-center gap-3">
                                                <button 
                                                    onClick={() => togglePublish(item.id, item.is_published)}
                                                    className={`p-3 rounded-2xl transition-all ${
                                                        item.is_published 
                                                        ? 'bg-[var(--sky)] text-white hover:bg-[var(--sky-deep)]' 
                                                        : 'bg-[var(--paper)] text-[var(--ink-soft)] hover:text-[var(--sky)] border border-[var(--paper-line)]'
                                                    }`}
                                                    title={item.is_published ? "Mettre en brouillon" : "Publier"}
                                                    aria-label={item.is_published ? "Mettre en brouillon" : "Publier"}
                                                >
                                                    <Send size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-3 bg-[var(--sky-ice)] text-[var(--sky)] hover:bg-[var(--sky)] hover:text-white rounded-2xl transition-all border border-[var(--paper-line)]"
                                                    title="Modifier"
                                                    aria-label="Modifier"
                                                >
                                                    <Edit3 size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => deleteIntervention(item.id)}
                                                    disabled={deletingId === item.id}
                                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-100 disabled:opacity-60"
                                                    title="Supprimer"
                                                    aria-label="Supprimer"
                                                >
                                                    {deletingId === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <LayoutList size={64} className="text-[var(--paper-line)]" />
                                            <div>
                                                <p className="font-display font-extrabold text-2xl text-[var(--ink)]">
                                                    {interventions.length === 0 ? 'Aucune donnée' : 'Aucun résultat'}
                                                </p>
                                                <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mt-1">
                                                    {interventions.length === 0
                                                        ? 'Ajoutez votre première intervention.'
                                                        : 'Modifiez votre recherche ou le filtre.'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="bg-[var(--paper)] px-6 md:px-8 py-4 border-t border-[var(--paper-line)] flex flex-col sm:flex-row gap-2 justify-between items-center">
                    <p className="text-xs font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                        {filteredInterventions.length === interventions.length
                            ? `TOTAL BASE DE DONNÉES: ${interventions.length} INTERVENTION(S)`
                            : `${filteredInterventions.length} SUR ${interventions.length} INTERVENTION(S)`}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--sky)] animate-pulse"></span>
                        <span className="text-xs font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                            Serveur Node.js actif
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterventionList;