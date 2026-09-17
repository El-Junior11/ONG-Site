import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { 
    PlusCircle, LogOut, LayoutList, Trash2, Edit3, Send, 
    RefreshCcw, Settings, MapPin, X, Save, Type, 
    Image as ImageIcon, AlignLeft, Eye, EyeOff, Loader2,
    Info
} from 'lucide-react';
import api from '../api/axios';

const InterventionList = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const navigate = useNavigate();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        image: [],
        is_published: false
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/interventions');
            setInterventions(response.data);
        } catch (err) {
            console.error("Erreur de chargement Backend:", err);
            Swal.fire('Erreur', 'Impossible de joindre le serveur backend', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            text: "Votre session sera fermée.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1C86C9',
            cancelButtonColor: '#45566E',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        });

        if (result.isConfirmed) {
            navigate('/login');
        }
    };

    const deleteIntervention = async (id) => {
        const result = await Swal.fire({
            title: 'Confirmation de suppression',
            text: "Attention, cette action est définitive !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            setActionLoading(true);
            try {
                await api.delete(`/interventions/${id}`);
                setInterventions(interventions.filter(item => item.id !== id));
                Swal.fire({
                    title: 'Supprimé !',
                    text: "L'intervention a été retirée avec succès.",
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (err) {
                Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const togglePublish = async (id, currentStatus) => {
        try {
            await api.patch(`/interventions/${id}/publish`, {
                is_published: !currentStatus
            });

            setInterventions(interventions.map(item => {
                if (item.id === id) {
                    return { ...item, is_published: !currentStatus };
                }
                return item;
            }));

            Swal.fire({
                title: !currentStatus ? 'Publication réussie !' : 'Mis en brouillon',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (err) {
            Swal.fire('Erreur', 'Erreur de mise à jour', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
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
        setFormData({ 
            title: '', 
            location: '', 
            description: '', 
            image: [], 
            is_published: false 
        });
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const firstImage = Array.isArray(formData.image) && formData.image.length > 0
                ? formData.image[0]
                : (formData.image || '');

            const payload = {
                title: formData.title,
                location: formData.location,
                description: formData.description,
                is_published: formData.is_published,
                image_url: firstImage
            };

            if (editingId) {
                await api.put(`/interventions/${editingId}`, payload);
            } else {
                await api.post('/interventions', payload);
            }

            await loadData();

            Swal.fire({ 
                title: editingId ? 'Modification réussie' : 'Enregistré avec succès !', 
                icon: 'success', 
                timer: 1500, 
                showConfirmButton: false 
            });

            resetForm();
        } catch (err) {
            Swal.fire(
                'Erreur technique',
                err.response?.data?.erreur || err.message,
                'error'
            );
        } finally {
            setLoading(false);
        } 
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
    
        const allAreImages = files.every(file => file.type.startsWith('image/'));

        if (!allAreImages) {
            Swal.fire('Erreur', 'Veuillez sélectionner uniquement des fichiers images.', 'error');
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
    
            Swal.fire({
                title: 'Succès',
                text: `${files.length} image(s) ajoutée(s) !`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
    
        } catch (error) {
            Swal.fire('Erreur', 'Impossible de charger les images', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[var(--paper)] min-h-screen font-body text-[var(--ink)]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(11,79,134,0.06)] border border-[var(--paper-line)] gap-6">
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
                    <button onClick={loadData} className="p-3 text-[var(--ink-soft)] hover:text-[var(--sky)] hover:bg-white rounded-2xl transition-all" title="Actualiser">
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
                <div className="mb-10 bg-white p-8 rounded-[2.5rem] shadow-[0_12px_32px_rgba(11,79,134,0.1)] border border-[var(--paper-line)]">
                    <div className="flex items-center gap-3 mb-8 text-left">
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
                                                        : "Importer des photos"}
                                                </span>
                                            </div>
                                        )}
                                    </label>
                                </div>
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
                                    disabled={actionLoading}
                                    className="w-full py-4 bg-gradient-to-r from-[var(--sky)] to-[var(--sky-bright)] text-white rounded-2xl font-mono-label font-bold uppercase text-xs tracking-widest shadow-xl shadow-[var(--sky)]/30 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                                    {editingId ? 'METTRE À JOUR' : 'ENREGISTRER'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-[0_4px_20px_rgba(11,79,134,0.06)] rounded-[2.5rem] overflow-hidden border border-[var(--paper-line)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[var(--paper)] text-[var(--ink-soft)] uppercase text-[11px] font-mono-label font-black tracking-widest border-b border-[var(--paper-line)]">
                                <th className="px-8 py-6 text-left">Aperçu</th>
                                <th className="px-8 py-6 text-left">Intervention</th>
                                <th className="px-8 py-6 text-left">Description</th>
                                <th className="px-8 py-6 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[var(--paper-line)]">
                            {loading && !isFormOpen ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 border-4 border-[var(--paper-line)] border-t-[var(--sky)] rounded-full animate-spin"></div>
                                            <span className="font-mono-label font-bold text-[var(--ink-soft)] uppercase text-xs">
                                                Chargement...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : interventions.length > 0 ? (
                                interventions.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--paper)]/50 transition-all text-left">
                                        <td className="px-8 py-6">
                                            <div className="relative w-20 h-20 overflow-hidden rounded-2xl shadow-sm border border-[var(--paper-line)]">
                                                <img 
                                                    src={
                                                        (item.image && Array.isArray(item.image) && item.image.length > 0)
                                                        ? item.image[0]
                                                        : (item.image_url ? item.image_url : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=300&h=300&fit=crop")
                                                    } 
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

                                        <td className="px-8 py-6">
                                            <div className="text-[var(--ink)] font-display font-extrabold text-base">
                                                {item.title}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[var(--sky)] text-xs font-mono-label font-bold mt-1 bg-[var(--sky-ice)] w-fit px-3 py-1 rounded-full border border-[var(--paper-line)]">
                                                <MapPin size={14} />
                                                {item.location || 'Non spécifié'}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6">
                                            <p className="text-[var(--ink-soft)] text-sm line-clamp-2 max-w-sm font-normal">
                                                {item.description || 'Aucune description.'}
                                            </p>
                                        </td>

                                        <td className="px-8 py-6">
                                            <div className="flex justify-center items-center gap-3">
                                                <button 
                                                    onClick={() => togglePublish(item.id, item.is_published)}
                                                    className={`p-3 rounded-2xl transition-all ${
                                                        item.is_published 
                                                        ? 'bg-[var(--sky)] text-white hover:bg-[var(--sky-deep)]' 
                                                        : 'bg-[var(--paper)] text-[var(--ink-soft)] hover:text-[var(--sky)] border border-[var(--paper-line)]'
                                                    }`}
                                                    title={item.is_published ? "Mettre en brouillon" : "Publier"}
                                                >
                                                    <Send size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-3 bg-[var(--sky-ice)] text-[var(--sky)] hover:bg-[var(--sky)] hover:text-white rounded-2xl transition-all border border-[var(--paper-line)]"
                                                    title="Modifier"
                                                >
                                                    <Edit3 size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => deleteIntervention(item.id)}
                                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-100"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <LayoutList size={64} className="text-[var(--paper-line)]" />
                                            <div>
                                                <p className="font-display font-extrabold text-2xl text-[var(--ink)]">
                                                    Aucune donnée
                                                </p>
                                                <p className="text-[var(--ink-soft)] font-mono-label text-xs uppercase mt-1">
                                                    Ajoutez votre première intervention.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="bg-[var(--paper)] px-8 py-4 border-t border-[var(--paper-line)] flex justify-between items-center">
                    <p className="text-xs font-mono-label font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                        TOTAL BASE DE DONNÉES: {interventions.length} INTERVENTION(S)
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