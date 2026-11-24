import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  PlusCircle, LogOut, LayoutList, Trash2, Edit3, Send, RefreshCcw,
  Settings, MapPin, X, Save, Type, Image as ImageIcon, AlignLeft,
  Eye, EyeOff, Loader2, Search, ShieldCheck, AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import InterventionTranslations from '../components/InterventionTranslations';
import { getTranslations, completeTranslations, translationLabels } from '../utils/interventionTranslations';

const translations = {
  fr: {
    admin: "Espace administration", title: "Gestion des interventions",
    subtitle: "Gérez les interventions de l’ONG TSINJO AINA.",
    refresh: "Actualiser", settings: "Paramètres", close: "Fermer",
    new: "Nouvelle intervention", logout: "Déconnexion",
    editTitle: "Modifier l’intervention", addTitle: "Ajouter une intervention",
    projectTitle: "Titre du projet", titlePlaceholder: "Ex : Distribution de kits scolaires...",
    location: "Localisation", locationPlaceholder: "Ex : Antananarivo, Madagascar",
    images: "Images", upload: "Importer une ou plusieurs photos",
    uploadInfo: "Maximum 8 images · 5 Mo par image",
    addImages: "image(s) · en ajouter", cover: "Couverture",
    setCover: "Définir comme couverture", removeImage: "Retirer cette image",
    description: "Description", descriptionPlaceholder: "Détails de l’intervention...",
    published: "Publié", draft: "Brouillon", update: "Mettre à jour",
    save: "Enregistrer", search: "Rechercher un titre, un lieu...",
    all: "Toutes", publishedList: "Publiées", drafts: "Brouillons",
    preview: "Aperçu", intervention: "Intervention", actions: "Actions",
    loading: "Chargement...", unspecified: "Non spécifié",
    noDescription: "Aucune description.", unpublish: "Mettre en brouillon",
    publish: "Publier", edit: "Modifier", delete: "Supprimer",
    noData: "Aucune donnée", noResults: "Aucun résultat",
    firstIntervention: "Ajoutez votre première intervention.",
    changeSearch: "Modifiez votre recherche ou le filtre.",
    total: "Total", of: "sur", interventions: "Interventions",
    serverError: "Serveur injoignable",
    connectionError: "Impossible de joindre le serveur backend.",
    logoutQuestion: "Se déconnecter ?", logoutMessage: "Votre session sera fermée.",
    yes: "Oui", no: "Non", cancel: "Annuler", logoutSuccess: "Déconnexion réussie",
    deleteQuestion: "Supprimer cette intervention ?",
    deleteMessage: "Cette action est définitive.",
    confirmDelete: "Oui, supprimer", deleted: "Supprimé",
    deleteSuccess: "L’intervention a été retirée avec succès.",
    error: "Erreur", deleteError: "Erreur lors de la suppression.",
    publishSuccess: "Publication réussie", draftSuccess: "Mis en brouillon",
    updateError: "Erreur de mise à jour", incomplete: "Champs incomplets",
    required: "Titre, localisation et description sont obligatoires.",
    updateSuccess: "Modification réussie", saveSuccess: "Enregistré avec succès",
    technicalError: "Erreur technique", invalidFile: "Fichier invalide",
    onlyImages: "Veuillez sélectionner uniquement des fichiers images.",
    largeImage: "Image trop lourde", exceeds: "dépasse 5 Mo.",
    limit: "Limite atteinte", maxImages: "Maximum 8 images par intervention.",
    imagesAdded: "image(s) ajoutée(s)", imageError: "Impossible de charger les images.",
    sessionExpired: "Session expirée. Veuillez vous reconnecter.",
    languageRequired: "Veuillez sélectionner la langue originale.",
    translationProgress: "Traductions", originalLanguage: "Langue originale",
    unknownLanguage: "Non définie", reviewRequired: "Traductions à compléter",
    replaceQuestion: "Remplacer les traductions existantes ?",
    replaceMessage: "Les corrections manuelles seront remplacées.",
    titleTooLong: "Le titre ne doit pas dépasser 255 caractères."
  },
  mg: {
    admin: "Sehatra fitantanana", title: "Fitantanana ny asa tanterahina",
    subtitle: "Tantano ny asa tanterahin’ny ONG TSINJO AINA.",
    refresh: "Havaozy", settings: "Fikirana", close: "Hidio",
    new: "Asa vaovao", logout: "Hivoaka",
    editTitle: "Hanova ny asa", addTitle: "Hanampy asa vaovao",
    projectTitle: "Lohatenin’ny tetikasa", titlePlaceholder: "Ohatra: Fizarana fitaovam-pianarana...",
    location: "Toerana", locationPlaceholder: "Ohatra: Antananarivo, Madagasikara",
    images: "Sary", upload: "Hampiditra sary iray na maromaro",
    uploadInfo: "Sary 8 farany ambony · 5 Mo isaky ny sary",
    addImages: "sary · hanampy", cover: "Sary fototra",
    setCover: "Atao sary fototra", removeImage: "Esory ity sary ity",
    description: "Fanazavana", descriptionPlaceholder: "Antsipirihan’ny asa tanterahina...",
    published: "Navoaka", draft: "Volavola", update: "Havaozy",
    save: "Tehirizo", search: "Hitady lohateny na toerana...",
    all: "Rehetra", publishedList: "Navoaka", drafts: "Volavola",
    preview: "Sary", intervention: "Asa tanterahina", actions: "Safidy",
    loading: "Eo am-pakana tahiry...", unspecified: "Tsy voafaritra",
    noDescription: "Tsy misy fanazavana.", unpublish: "Avereno ho volavola",
    publish: "Avoahy", edit: "Hanova", delete: "Hamafa",
    noData: "Tsy misy tahiry", noResults: "Tsy misy valiny",
    firstIntervention: "Ampidiro ny asa voalohany.",
    changeSearch: "Ovay ny teny fikarohana na ny sivana.",
    total: "Fitambarany", of: "amin’ny", interventions: "Asa tanterahina",
    serverError: "Tsy tratra ny serveur",
    connectionError: "Tsy afaka mifandray amin’ny serveur backend.",
    logoutQuestion: "Hivoaka ve ianao?", logoutMessage: "Hikatona ny session-nao.",
    yes: "Eny", no: "Tsia", cancel: "Ajanony", logoutSuccess: "Tafavoaka soa aman-tsara",
    deleteQuestion: "Hamafa ity asa ity ve?",
    deleteMessage: "Tsy azo averina ity famafana ity.",
    confirmDelete: "Eny, fafao", deleted: "Voafafa",
    deleteSuccess: "Voafafa soa aman-tsara ilay asa.",
    error: "Hadisoana", deleteError: "Nisy olana tamin’ny famafana.",
    publishSuccess: "Navoaka soa aman-tsara", draftSuccess: "Naverina ho volavola",
    updateError: "Nisy olana tamin’ny fanavaozana", incomplete: "Tsy feno ny saha",
    required: "Tsy maintsy fenoina ny lohateny, toerana ary fanazavana.",
    updateSuccess: "Vita ny fanovana", saveSuccess: "Voatahiry soa aman-tsara",
    technicalError: "Olana ara-teknika", invalidFile: "Fichier tsy mety",
    onlyImages: "Sary ihany no azo ampidirina.",
    largeImage: "Sary lehibe loatra", exceeds: "mihoatra ny 5 Mo.",
    limit: "Tratra ny fetra", maxImages: "Sary 8 farany ambony isaky ny asa.",
    imagesAdded: "sary nampidirina", imageError: "Tsy afaka nampiditra ny sary.",
    sessionExpired: "Tapitra ny session. Midira indray.",
    languageRequired: "Safidio ny teny niaviana.",
    translationProgress: "Fandikana", originalLanguage: "Teny niaviana",
    unknownLanguage: "Tsy voafaritra", reviewRequired: "Mbola tsy feno ny fandikana",
    replaceQuestion: "Hosoloina ve ireo fandikana efa misy?",
    replaceMessage: "Hosoloina ireo fanitsiana natao tamin’ny tanana.",
    titleTooLong: "Tsy tokony hihoatra ny tarehintsoratra 255 ny lohateny."
  },
  en: {
    admin: "Administration", title: "Intervention management",
    subtitle: "Manage ONG TSINJO AINA interventions.",
    refresh: "Refresh", settings: "Settings", close: "Close",
    new: "New intervention", logout: "Sign out",
    editTitle: "Edit intervention", addTitle: "Add an intervention",
    projectTitle: "Project title", titlePlaceholder: "E.g. Distribution of school supplies...",
    location: "Location", locationPlaceholder: "E.g. Antananarivo, Madagascar",
    images: "Images", upload: "Upload one or more photos",
    uploadInfo: "Maximum 8 images · 5 MB per image",
    addImages: "image(s) · add more", cover: "Cover",
    setCover: "Set as cover", removeImage: "Remove this image",
    description: "Description", descriptionPlaceholder: "Intervention details...",
    published: "Published", draft: "Draft", update: "Update",
    save: "Save", search: "Search for a title or location...",
    all: "All", publishedList: "Published", drafts: "Drafts",
    preview: "Preview", intervention: "Intervention", actions: "Actions",
    loading: "Loading...", unspecified: "Not specified",
    noDescription: "No description.", unpublish: "Move to draft",
    publish: "Publish", edit: "Edit", delete: "Delete",
    noData: "No data", noResults: "No results",
    firstIntervention: "Add your first intervention.",
    changeSearch: "Change your search or filter.",
    total: "Total", of: "of", interventions: "Interventions",
    serverError: "Server unreachable",
    connectionError: "Unable to connect to the backend server.",
    logoutQuestion: "Sign out?", logoutMessage: "Your session will be closed.",
    yes: "Yes", no: "No", cancel: "Cancel", logoutSuccess: "Signed out successfully",
    deleteQuestion: "Delete this intervention?",
    deleteMessage: "This action is permanent.",
    confirmDelete: "Yes, delete", deleted: "Deleted",
    deleteSuccess: "The intervention was successfully removed.",
    error: "Error", deleteError: "An error occurred while deleting.",
    publishSuccess: "Published successfully", draftSuccess: "Moved to draft",
    updateError: "Update failed", incomplete: "Incomplete fields",
    required: "Title, location and description are required.",
    updateSuccess: "Updated successfully", saveSuccess: "Saved successfully",
    technicalError: "Technical error", invalidFile: "Invalid file",
    onlyImages: "Please select image files only.",
    largeImage: "Image too large", exceeds: "exceeds 5 MB.",
    limit: "Limit reached", maxImages: "Maximum 8 images per intervention.",
    imagesAdded: "image(s) added", imageError: "Unable to load images.",
    sessionExpired: "Session expired. Please sign in again.",
    languageRequired: "Please select the original language.",
    translationProgress: "Translations", originalLanguage: "Original language",
    unknownLanguage: "Not defined", reviewRequired: "Incomplete translations",
    replaceQuestion: "Replace existing translations?",
    replaceMessage: "Manual corrections will be replaced.",
    titleTooLong: "The title must not exceed 255 characters."
  },
  it: {
    admin: "Area amministrativa", title: "Gestione degli interventi",
    subtitle: "Gestisci gli interventi di ONG TSINJO AINA.",
    refresh: "Aggiorna", settings: "Impostazioni", close: "Chiudi",
    new: "Nuovo intervento", logout: "Disconnetti",
    editTitle: "Modifica intervento", addTitle: "Aggiungi un intervento",
    projectTitle: "Titolo del progetto", titlePlaceholder: "Es: Distribuzione di materiale scolastico...",
    location: "Località", locationPlaceholder: "Es: Antananarivo, Madagascar",
    images: "Immagini", upload: "Carica una o più foto",
    uploadInfo: "Massimo 8 immagini · 5 MB per immagine",
    addImages: "immagine/i · aggiungi", cover: "Copertina",
    setCover: "Imposta come copertina", removeImage: "Rimuovi questa immagine",
    description: "Descrizione", descriptionPlaceholder: "Dettagli dell’intervento...",
    published: "Pubblicato", draft: "Bozza", update: "Aggiorna",
    save: "Salva", search: "Cerca un titolo o una località...",
    all: "Tutti", publishedList: "Pubblicati", drafts: "Bozze",
    preview: "Anteprima", intervention: "Intervento", actions: "Azioni",
    loading: "Caricamento...", unspecified: "Non specificato",
    noDescription: "Nessuna descrizione.", unpublish: "Sposta in bozza",
    publish: "Pubblica", edit: "Modifica", delete: "Elimina",
    noData: "Nessun dato", noResults: "Nessun risultato",
    firstIntervention: "Aggiungi il tuo primo intervento.",
    changeSearch: "Modifica la ricerca o il filtro.",
    total: "Totale", of: "di", interventions: "Interventi",
    serverError: "Server non raggiungibile",
    connectionError: "Impossibile connettersi al server backend.",
    logoutQuestion: "Disconnettersi?", logoutMessage: "La sessione verrà chiusa.",
    yes: "Sì", no: "No", cancel: "Annulla", logoutSuccess: "Disconnessione riuscita",
    deleteQuestion: "Eliminare questo intervento?",
    deleteMessage: "Questa azione è definitiva.",
    confirmDelete: "Sì, elimina", deleted: "Eliminato",
    deleteSuccess: "L’intervento è stato rimosso con successo.",
    error: "Errore", deleteError: "Errore durante l’eliminazione.",
    publishSuccess: "Pubblicazione riuscita", draftSuccess: "Spostato in bozza",
    updateError: "Errore di aggiornamento", incomplete: "Campi incompleti",
    required: "Titolo, località e descrizione sono obbligatori.",
    updateSuccess: "Modifica riuscita", saveSuccess: "Salvato con successo",
    technicalError: "Errore tecnico", invalidFile: "File non valido",
    onlyImages: "Seleziona esclusivamente file immagine.",
    largeImage: "Immagine troppo grande", exceeds: "supera 5 MB.",
    limit: "Limite raggiunto", maxImages: "Massimo 8 immagini per intervento.",
    imagesAdded: "immagine/i aggiunta/e", imageError: "Impossibile caricare le immagini.",
    sessionExpired: "Sessione scaduta. Accedi nuovamente.",
    languageRequired: "Seleziona la lingua originale.",
    translationProgress: "Traduzioni", originalLanguage: "Lingua originale",
    unknownLanguage: "Non definita", reviewRequired: "Traduzioni incomplete",
    replaceQuestion: "Sostituire le traduzioni esistenti?",
    replaceMessage: "Le correzioni manuali verranno sostituite.",
    titleTooLong: "Il titolo non deve superare 255 caratteri."
  }
};

const LANGUAGES = ['mg', 'fr', 'en', 'it'];
const LANGUAGE_FLAGS = { mg: '🇲🇬', fr: '🇫🇷', en: '🇬🇧', it: '🇮🇹' };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 8;

const EMPTY_FORM = {
  title: '', location: '', description: '', image: [],
  is_published: false, source_language: '', translations: {}
};

const Toast = Swal.mixin({
  toast: true, position: 'top-end', showConfirmButton: false,
  timer: 2500, timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const notify = (icon, title, text) => Toast.fire({
  icon, title, text, timer: icon === 'error' ? 4500 : 2500
});

const confirmToast = ({ title, text, icon = 'question', confirmText, cancelText, confirmColor = '#176B46' }) =>
  Swal.fire({
    toast: true, position: 'top-end', icon, title, text,
    showConfirmButton: true, showCancelButton: true,
    confirmButtonText: confirmText, cancelButtonText: cancelText,
    confirmButtonColor: confirmColor, cancelButtonColor: '#64748B',
    reverseButtons: true, timer: undefined
  });

const parseList = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== 'string') return [];
  const v = value.trim();
  if (v.startsWith('[')) {
    try {
      const arr = JSON.parse(v);
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch { return [v]; }
  }
  return v ? [v] : [];
};

const parseImages = item => [...new Set([...parseList(item.image), ...parseList(item.image_url)])];

const serializeImages = images => {
  const list = parseList(images);
  return list.length === 0 ? '' : list.length === 1 ? list[0] : JSON.stringify(list);
};

const compressImage = (file, maxSize = 1280, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const original = reader.result;
      if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
        resolve(original);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(original);
      img.onload = () => {
        try {
          const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
          const width = Math.round(img.width * ratio);
          const height = Math.round(img.height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed.length < original.length ? compressed : original);
        } catch { resolve(original); }
      };
      img.src = original;
    };
    reader.readAsDataURL(file);
  });

const getCover = item => parseImages(item)[0] ||
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=300&h=300&fit=crop';

const getLocalizedTitle = (item, lang) =>
  item.translations?.[lang]?.title?.trim() || item.title || '';

const getLocalizedDescription = (item, lang) =>
  item.translations?.[lang]?.description?.trim() || item.description || '';

const getTranslationCount = item => LANGUAGES.filter(lang =>
  item.translations?.[lang]?.title?.trim() &&
  item.translations?.[lang]?.description?.trim()
).length;

const inputClass = 'w-full rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] px-4 py-3 text-sm text-[#203528] outline-none transition focus:border-[#176B46] focus:ring-2 focus:ring-[#176B46]/10 disabled:opacity-60';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-medium text-[#203528]';
const iconButton = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] text-[#14532D] transition hover:bg-[#176B46] hover:text-white disabled:opacity-50';

const InterventionList = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'fr').split('-')[0];
  const tr = translations[lang] || translations.fr;
  const translationTr = translationLabels(lang);
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const busy = saving || translating || actionLoading || deletingId !== null || publishingId !== null;

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const current = translations[(i18n.resolvedLanguage || 'fr').split('-')[0]] || translations.fr;
    notify('warning', current.sessionExpired);
    navigate('/login', { replace: true });
  }, [i18n, navigate]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError(false);
    try {
      const response = await api.get('/interventions/admin');
      setInterventions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleSessionExpired();
        return;
      }
      console.error(err);
      setLoadError(true);
      const current = translations[(i18n.resolvedLanguage || 'fr').split('-')[0]] || translations.fr;
      notify('error', current.serverError, current.connectionError);
    } finally { setLoading(false); }
  }, [i18n, handleSessionExpired]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
      return;
    }
    const timer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData, navigate]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(false);
  }, []);

  useEffect(() => {
    if (!isFormOpen) return;
    const onKey = e => {
      if (e.key === 'Escape' && !busy) resetForm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFormOpen, busy, resetForm]);

  const filteredInterventions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return interventions.filter(item => {
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'published' && item.is_published) ||
        (statusFilter === 'draft' && !item.is_published);

      const searchable = [
        item.title, item.location, item.description,
        ...Object.values(item.translations || {}).flatMap(t => [t.title, t.description])
      ].filter(Boolean).join(' ').toLowerCase();

      return matchStatus && (!q || searchable.includes(q));
    });
  }, [interventions, search, statusFilter]);

  const counts = useMemo(() => ({
    all: interventions.length,
    published: interventions.filter(i => i.is_published).length,
    draft: interventions.filter(i => !i.is_published).length
  }), [interventions]);

  const handleLogout = async () => {
    if (busy) return;
    const result = await confirmToast({
      title: tr.logoutQuestion, text: tr.logoutMessage,
      confirmText: tr.yes, cancelText: tr.no
    });
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      notify('success', tr.logoutSuccess);
      navigate('/login', { replace: true });
    }
  };

  const deleteIntervention = async id => {
    if (busy) return;
    const result = await confirmToast({
      title: tr.deleteQuestion, text: tr.deleteMessage, icon: 'warning',
      confirmText: tr.confirmDelete, cancelText: tr.cancel, confirmColor: '#DC2626'
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await api.delete(`/interventions/${id}`);
      setInterventions(prev => prev.filter(item => item.id !== id));
      if (editingId === id) resetForm();
      notify('success', tr.deleted, tr.deleteSuccess);
    } catch (err) {
      if (err.response?.status === 401) return handleSessionExpired();
      console.error(err);
      notify('error', tr.error, tr.deleteError);
    } finally { setDeletingId(null); }
  };

  const togglePublish = async (id, currentStatus) => {
    if (busy) return;
    const current = interventions.find(item => item.id === id);
    if (!current) return;
    const nextStatus = !currentStatus;

    if (nextStatus && (!LANGUAGES.includes(current.source_language) || getTranslationCount(current) !== 4)) {
      notify('warning', tr.incomplete, translationTr.required);
      handleEdit(current);
      return;
    }

    setPublishingId(id);
    try {
      await api.patch(`/interventions/${id}/publish`, { is_published: nextStatus });
      setInterventions(prev => prev.map(item =>
        item.id === id ? { ...item, is_published: nextStatus } : item
      ));
      if (editingId === id) {
        setFormData(prev => ({ ...prev, is_published: nextStatus }));
      }
      notify('success', nextStatus ? tr.publishSuccess : tr.draftSuccess);
    } catch (err) {
      if (err.response?.status === 401) return handleSessionExpired();
      console.error(err);
      notify('error', tr.updateError, err.response?.data?.erreur);
    } finally { setPublishingId(null); }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    if (busy) return;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(['title', 'description'].includes(name) && prev[name] !== value
        ? { translations: {} } : {})
    }));
  };

  const handleTranslate = async () => {
    if (busy) return;
    const { title, description, source_language } = formData;

    if (!title.trim() || !description.trim()) {
      notify('warning', tr.incomplete, tr.required);
      return;
    }
    if (!LANGUAGES.includes(source_language)) {
      notify('warning', tr.incomplete, tr.languageRequired);
      return;
    }
    if (title.trim().length > 255) {
      notify('warning', tr.incomplete, tr.titleTooLong);
      return;
    }

    setTranslating(true);
    try {
      const hasTranslations = Object.entries(formData.translations || {}).some(([code, item]) =>
        code !== source_language && (item.title?.trim() || item.description?.trim())
      );

      if (hasTranslations) {
        const result = await confirmToast({
          title: tr.replaceQuestion, text: tr.replaceMessage,
          confirmText: tr.yes, cancelText: tr.cancel
        });
        if (!result.isConfirmed) return;
      }

      const { data } = await api.post('/interventions/translate', {
        title: title.trim(), description: description.trim(), source_language
      });

      if (!data.translations || typeof data.translations !== 'object') {
        throw new Error('Invalid translations response');
      }

      setFormData(prev => ({
        ...prev, translations: data.translations
      }));
      notify('success', translationTr.success);
    } catch (err) {
      if (err.response?.status === 401) return handleSessionExpired();
      console.error(err);
      notify('error', tr.error, translationTr.error);
    } finally { setTranslating(false); }
  };

  const handleEdit = item => {
    if (busy) return;
    setEditingId(item.id);
    setFormData({
      title: item.title || '', location: item.location || '',
      description: item.description || '', image: parseImages(item),
      is_published: item.is_published || false,
      source_language: item.source_language || '',
      translations: item.translations || {}
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  const removeImage = index => {
    if (busy) return;
    setFormData(prev => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
  };

  const makeCover = index => {
    if (busy) return;
    setFormData(prev => {
      const list = [...prev.image];
      const [picked] = list.splice(index, 1);
      return { ...prev, image: [picked, ...list] };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (busy) return;

    const title = formData.title.trim();
    const location = formData.location.trim();
    const description = formData.description.trim();

    if (!title || !location || !description) {
      notify('warning', tr.incomplete, tr.required);
      return;
    }
    if (title.length > 255) {
      notify('warning', tr.incomplete, tr.titleTooLong);
      return;
    }
    if (!LANGUAGES.includes(formData.source_language)) {
      notify('warning', tr.incomplete, tr.languageRequired);
      return;
    }

    const normalizedForm = { ...formData, title, description };
    const preparedTranslations = getTranslations(normalizedForm);

    setSaving(true);
    try {
      const payload = {
        title, location, description,
        source_language: formData.source_language,
        translations: preparedTranslations,
        is_published: formData.is_published,
        image_url: serializeImages(formData.image)
      };

      if (editingId) await api.put(`/interventions/${editingId}`, payload);
      else await api.post('/interventions', payload);

      await loadData(true);
      notify('success', editingId ? tr.updateSuccess : tr.saveSuccess);
      resetForm();
    } catch (err) {
      if (err.response?.status === 401) return handleSessionExpired();
      console.error(err);
      notify('error', tr.technicalError, err.response?.data?.erreur);
    } finally { setSaving(false); }
  };

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length || busy) return;

    if (!files.every(file => file.type.startsWith('image/'))) {
      notify('error', tr.invalidFile, tr.onlyImages);
      return;
    }

    const tooBig = files.find(file => file.size > MAX_IMAGE_SIZE);
    if (tooBig) {
      notify('warning', tr.largeImage, `"${tooBig.name}" ${tr.exceeds}`);
      return;
    }

    const remaining = MAX_IMAGES - formData.image.length;
    if (remaining <= 0) {
      notify('warning', tr.limit, tr.maxImages);
      return;
    }

    const selected = files.slice(0, remaining);
    setActionLoading(true);
    try {
      const processed = await Promise.all(selected.map(file => compressImage(file)));
      setFormData(prev => ({ ...prev, image: [...prev.image, ...processed] }));
      notify(selected.length < files.length ? 'warning' : 'success',
        `${selected.length} ${tr.imagesAdded}`,
        selected.length < files.length ? tr.maxImages : undefined);
    } catch {
      notify('error', tr.error, tr.imageError);
    } finally { setActionLoading(false); }
  };

  const filterTabs = [
    { id: 'all', label: tr.all, count: counts.all, icon: LayoutList, color: 'bg-[#176B46] text-white' },
    { id: 'published', label: tr.publishedList, count: counts.published, icon: Eye, color: 'bg-[#DCE9D3] text-[#14532D]' },
    { id: 'draft', label: tr.drafts, count: counts.draft, icon: EyeOff, color: 'bg-[#F5EBC8] text-[#92701B]' }
  ];

  const animation = {
    initial: reduced ? false : { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.45 }
  };

  const renderActions = item => (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => togglePublish(item.id, item.is_published)} disabled={busy}
        title={item.is_published ? tr.unpublish : tr.publish}
        aria-label={item.is_published ? tr.unpublish : tr.publish}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition disabled:opacity-50 ${item.is_published ? 'bg-[#176B46] text-white hover:bg-[#103F30]' : 'bg-[#DCE9D3] text-[#14532D] hover:bg-[#176B46] hover:text-white'}`}>
        {publishingId === item.id ? <Loader2 size={18} className="animate-spin"/> :
          item.is_published ? <Eye size={18}/> : <Send size={18}/>}
      </button>
      <button onClick={() => handleEdit(item)} disabled={busy} title={tr.edit} aria-label={tr.edit}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5EAF8] text-[#000099] transition hover:bg-[#000099] hover:text-white disabled:opacity-50">
        <Edit3 size={18}/>
      </button>
      <button onClick={() => deleteIntervention(item.id)} disabled={busy} title={tr.delete} aria-label={tr.delete}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50">
        {deletingId === item.id ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>}
      </button>
    </div>
  );

  const renderStatus = item => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${item.is_published ? 'bg-[#DCE9D3] text-[#14532D]' : 'bg-[#F5EBC8] text-[#92701B]'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"/>
      {item.is_published ? tr.published : tr.draft}
    </span>
  );

  const renderLanguages = item => {
    const count = getTranslationCount(item);
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {LANGUAGES.map(code => {
          const completed = Boolean(item.translations?.[code]?.title?.trim() &&
            item.translations?.[code]?.description?.trim());
          return (
            <span key={code} title={`${code.toUpperCase()} — ${completed ? '✓' : '—'}`}
              className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${completed ? 'border-[#A8C39B] bg-[#DCE9D3] text-[#14532D]' : 'border-[#D6DDD2] bg-[#F0F5E9] text-[#94A3B8]'}`}>
              {LANGUAGE_FLAGS[code]} {code.toUpperCase()}
            </span>
          );
        })}
        <span className={`text-[11px] font-semibold ${count === 4 ? 'text-[#176B46]' : 'text-[#92701B]'}`}
          title={count === 4 ? tr.translationProgress : tr.reviewRequired}>
          {count}/4
        </span>
      </div>
    );
  };

  const renderImage = item => (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#CDDCC4] bg-[#DCE9D3]">
      <img src={getCover(item)} alt={getLocalizedTitle(item, lang)} loading="lazy" className="h-full w-full object-cover"/>
      {parseImages(item).length > 1 && (
        <span className="absolute bottom-1 right-1 rounded-md bg-black/65 px-2 py-1 text-xs text-white">
          +{parseImages(item).length - 1}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E8F0DF] text-[#203528]">
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:px-14">

        {/* En-tête */}
        <motion.header {...animation} className="relative mb-5 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#103F30] to-[#176B46] p-5 text-white shadow-lg md:p-7">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[40px] border-white/5"/>
          <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <LayoutList size={28}/>
              </div>
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[#E5C43B]">
                  <ShieldCheck size={14}/>{tr.admin}
                </p>
                <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">{tr.title}</h1>
                <p className="mt-1 text-xs text-white/85 sm:text-sm">{tr.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => loadData()} disabled={loading || busy} title={tr.refresh} aria-label={tr.refresh}
                className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20 disabled:opacity-50">
                <RefreshCcw size={20} className={loading ? 'animate-spin' : ''}/>
              </button>
              <Link to="/settings" title={tr.settings} aria-label={tr.settings}
                onClick={e => { if (busy) e.preventDefault(); }}
                className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20">
                <Settings size={20}/>
              </Link>
              <button disabled={busy} onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-[#E5C43B] px-4 py-3 text-sm font-semibold text-[#103F30] transition hover:bg-white disabled:opacity-50">
                {isFormOpen ? <X size={20}/> : <PlusCircle size={20}/>}
                {isFormOpen ? tr.close : tr.new}
              </button>
              <button onClick={handleLogout} disabled={busy} title={tr.logout} aria-label={tr.logout}
                className="rounded-xl bg-red-500/20 p-3 text-white transition hover:bg-red-600 disabled:opacity-50">
                <LogOut size={20}/>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Statistiques et filtres */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {filterTabs.map((tab, index) => {
            const Icon = tab.icon;
            const active = statusFilter === tab.id;
            return (
              <motion.button key={tab.id} {...animation}
                transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : index * 0.08 }}
                whileHover={reduced ? undefined : { y: -3 }}
                type="button" onClick={() => setStatusFilter(tab.id)} aria-pressed={active}
                className={`flex items-center gap-4 rounded-[20px] border p-4 text-left shadow-sm transition-colors ${active ? 'border-[#176B46] bg-[#DCE9D3]' : 'border-[#CDDCC4] bg-[#F0F5E9]'}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tab.color}`}>
                  <Icon size={23}/>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">{tab.label}</p>
                  <p className="text-2xl font-semibold text-[#14532D]">{tab.count}</p>
                </div>
                {active && <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#176B46]"/>}
              </motion.button>
            );
          })}
        </div>

        {/* Formulaire multilingue */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.section {...animation}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              className="mb-5 rounded-[24px] border border-[#CDDCC4] bg-[#F0F5E9] p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#CDDCC4] pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#DCE9D3] p-3 text-[#176B46]">
                    {editingId ? <Edit3 size={22}/> : <PlusCircle size={22}/>}
                  </div>
                  <h2 className="text-lg font-semibold text-[#14532D] md:text-xl">
                    {editingId ? tr.editTitle : tr.addTitle}
                  </h2>
                </div>
                <button type="button" onClick={resetForm} disabled={busy}
                  className={iconButton} aria-label={tr.close}>
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="min-w-0 space-y-4">
                  <div>
                    <label htmlFor="intervention-title" className={labelClass}>
                      <Type size={17} className="text-[#176B46]"/>{tr.projectTitle}
                    </label>
                    <input id="intervention-title" required name="title" maxLength={255}
                      value={formData.title} disabled={busy} onChange={handleInputChange}
                      placeholder={tr.titlePlaceholder} className={inputClass}/>
                  </div>

                  <div>
                    <label htmlFor="intervention-location" className={labelClass}>
                      <MapPin size={17} className="text-[#176B46]"/>{tr.location}
                    </label>
                    <input id="intervention-location" required name="location"
                      value={formData.location} disabled={busy} onChange={handleInputChange}
                      placeholder={tr.locationPlaceholder} className={inputClass}/>
                  </div>

                  <div>
                    <label htmlFor="intervention-description" className={labelClass}>
                      <AlignLeft size={17} className="text-[#176B46]"/>{tr.description}
                    </label>
                    <textarea id="intervention-description" required name="description"
                      value={formData.description} disabled={busy} onChange={handleInputChange}
                      rows={7} placeholder={tr.descriptionPlaceholder}
                      className={`${inputClass} min-h-40 resize-y leading-relaxed`}/>
                  </div>

                  {/* Gestion des images */}
                  <div>
                    <label htmlFor="file-upload" className={labelClass}>
                      <ImageIcon size={17} className="text-[#176B46]"/>{tr.images}
                    </label>
                    <input type="file" accept="image/*" id="file-upload" multiple
                      onChange={handleImageUpload} disabled={busy} className="sr-only peer"/>
                    <label htmlFor="file-upload"
                      className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#A8C39B] bg-[#E8F0DF] p-4 text-center text-sm text-[#14532D] transition hover:border-[#176B46] hover:bg-[#DCE9D3] peer-focus-visible:ring-2 peer-focus-visible:ring-[#176B46] peer-disabled:opacity-50">
                      {actionLoading ? <Loader2 size={25} className="animate-spin"/> : <ImageIcon size={26}/>}
                      <span className="font-medium">
                        {formData.image.length ? `${formData.image.length}/${MAX_IMAGES} ${tr.addImages}` : tr.upload}
                      </span>
                      <span className="text-xs text-[#64748B]">{tr.uploadInfo}</span>
                    </label>

                    {formData.image.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                        {formData.image.map((src, idx) => (
                          <div key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-[#CDDCC4]">
                            <img src={src} alt={`${tr.preview} ${idx + 1}`} className="h-full w-full object-cover"/>
                            {idx === 0 ? (
                              <span className="absolute bottom-1 left-1 rounded-md bg-[#14532D] px-1.5 py-1 text-[10px] text-white">
                                {tr.cover}
                              </span>
                            ) : (
                              <button type="button" onClick={() => makeCover(idx)} title={tr.setCover} disabled={busy}
                                className="absolute bottom-1 left-1 rounded-md bg-white/90 px-1.5 py-1 text-[10px] font-medium text-[#14532D]">
                                {tr.cover}
                              </button>
                            )}
                            <button type="button" onClick={() => removeImage(idx)} disabled={busy}
                              title={tr.removeImage} aria-label={tr.removeImage}
                              className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-600 shadow transition hover:bg-red-600 hover:text-white">
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Traductions et publication */}
                <div className="flex min-w-0 flex-col gap-4">
                  <InterventionTranslations
                    key={editingId ?? 'new'}
                    form={formData}
                    setForm={setFormData}
                    lang={lang}
                    busy={busy}
                    translating={translating}
                    onTranslate={handleTranslate}
                  />

                  {formData.is_published && !completeTranslations(formData) && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                      <AlertCircle size={18} className="shrink-0"/>
                      <span>{translationTr.automaticSave}</span>
                    </div>
                  )}

                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] p-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-[#14532D]">
                      {formData.is_published ? <Eye size={21}/> : <EyeOff size={21}/>}
                      {formData.is_published ? tr.published : tr.draft}
                    </div>
                    <input type="checkbox" name="is_published" checked={formData.is_published}
                      disabled={busy} onChange={handleInputChange} className="peer sr-only"/>
                    <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#A8B6A2] transition peer-checked:bg-[#176B46] peer-focus-visible:ring-2 peer-focus-visible:ring-[#176B46] peer-disabled:opacity-50 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"/>
                  </label>

                  <button type="submit" disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B46] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103F30] disabled:cursor-not-allowed disabled:opacity-50">
                    {saving ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                    {saving && !completeTranslations(formData) ? translationTr.translating : editingId ? tr.update : tr.save}
                  </button>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Liste des interventions */}
        <motion.section {...animation}
          className="overflow-hidden rounded-[24px] border border-[#CDDCC4] bg-[#F0F5E9] shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#CDDCC4] p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-center gap-3">
              <LayoutList size={22} className="text-[#176B46]"/>
              <h2 className="text-lg font-semibold text-[#14532D]">{tr.interventions}</h2>
              <span className="rounded-full bg-[#DCE9D3] px-3 py-1 text-xs font-semibold text-[#14532D]">
                {filteredInterventions.length}
              </span>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#176B46]"/>
              <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={tr.search} aria-label={tr.search} className={`${inputClass} pl-11`}/>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 size={35} className="mx-auto mb-3 animate-spin text-[#176B46]"/>
              <span className="text-sm text-[#374151]">{tr.loading}</span>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <AlertCircle size={34} className="text-red-500"/>
              <h3 className="font-semibold text-[#14532D]">{tr.serverError}</h3>
              <p className="text-sm text-[#374151]">{tr.connectionError}</p>
              <button onClick={() => loadData()} disabled={busy}
                className="flex items-center gap-2 rounded-xl bg-[#176B46] px-4 py-2.5 text-sm text-white disabled:opacity-50">
                <RefreshCcw size={17}/>{tr.refresh}
              </button>
            </div>
          ) : filteredInterventions.length ? (
            <>
              {/* Tableau desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-[#DCE9D3] text-sm font-medium text-[#14532D]">
                    <tr>
                      <th className="px-5 py-4">{tr.preview}</th>
                      <th className="px-5 py-4">{tr.intervention}</th>
                      <th className="px-5 py-4">{tr.description}</th>
                      <th className="px-5 py-4 text-center">{tr.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CDDCC4]">
                    {filteredInterventions.map(item => (
                      <tr key={item.id} className="transition-colors hover:bg-[#E8F0DF]">
                        <td className="w-28 px-5 py-4">{renderImage(item)}</td>
                        <td className="min-w-52 px-5 py-4">
                          <h3 className="break-words text-sm font-semibold text-[#203528] lg:text-base">
                            {getLocalizedTitle(item, lang)}
                          </h3>
                          <p className="mb-2 mt-1 flex items-center gap-1.5 text-xs text-[#176B46]">
                            <MapPin size={14} className="shrink-0"/>{item.location || tr.unspecified}
                          </p>
                          {renderStatus(item)}
                          {renderLanguages(item)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="line-clamp-2 max-w-lg break-words text-sm leading-relaxed text-[#374151]">
                            {getLocalizedDescription(item, lang) || tr.noDescription}
                          </p>
                          <p className="mt-2 text-[11px] text-[#64748B]">
                            {tr.originalLanguage}: {item.source_language
                              ? `${LANGUAGE_FLAGS[item.source_language] || ''} ${item.source_language.toUpperCase()}`
                              : tr.unknownLanguage}
                          </p>
                        </td>
                        <td className="px-5 py-4">{renderActions(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cartes mobiles */}
              <div className="divide-y divide-[#CDDCC4] md:hidden">
                {filteredInterventions.map(item => (
                  <article key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {renderImage(item)}
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold text-[#203528]">
                          {getLocalizedTitle(item, lang)}
                        </h3>
                        <p className="mb-2 mt-1 flex items-center gap-1.5 text-xs text-[#176B46]">
                          <MapPin size={14} className="shrink-0"/>{item.location || tr.unspecified}
                        </p>
                        {renderStatus(item)}
                        {renderLanguages(item)}
                      </div>
                    </div>
                    <p className="my-3 line-clamp-3 break-words text-justify text-sm leading-relaxed text-[#374151]">
                      {getLocalizedDescription(item, lang) || tr.noDescription}
                    </p>
                    <p className="mb-3 text-xs text-[#64748B]">
                      {tr.originalLanguage}: {item.source_language
                        ? `${LANGUAGE_FLAGS[item.source_language] || ''} ${item.source_language.toUpperCase()}`
                        : tr.unknownLanguage}
                    </p>
                    <div className="flex justify-end border-t border-[#CDDCC4] pt-3">
                      {renderActions(item)}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCE9D3] text-[#176B46]">
                <LayoutList size={30}/>
              </div>
              <h3 className="text-lg font-semibold text-[#14532D]">
                {interventions.length ? tr.noResults : tr.noData}
              </h3>
              <p className="mt-1 text-sm text-[#374151]">
                {interventions.length ? tr.changeSearch : tr.firstIntervention}
              </p>
            </div>
          )}

          {/* Pied de tableau */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#CDDCC4] bg-[#E8F0DF] px-5 py-4 text-xs text-[#374151]">
            <p>
              {filteredInterventions.length === interventions.length
                ? `${tr.total} : ${interventions.length}`
                : `${filteredInterventions.length} ${tr.of} ${interventions.length}`}
            </p>
            <span className="flex items-center gap-2 font-medium text-[#14532D]">
              <ShieldCheck size={16}/> ONG TSINJO AINA
            </span>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default InterventionList;