import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Settings, Save, X, Loader2, ArrowLeft,
  User, Users, Mail, Lock, Camera, ShieldCheck, Eye, EyeOff,
  Search, RefreshCcw, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios';

const translations = {
  fr: {
    admin: "Espace administration", title: "Configuration",
    subtitle: "Gestion de l’équipe et sécurité administrateur",
    back: "Retour", members: "Membres de l’organisation",
    search: "Rechercher...", refresh: "Actualiser", add: "Ajouter",
    profile: "Profil", role: "Poste / Rôle", actions: "Actions",
    edit: "Modifier", delete: "Supprimer", close: "Fermer",
    noMember: "Aucun membre", noResult: "Aucun résultat",
    firstMember: "Ajoutez le premier membre de l’équipe.",
    changeSearch: "Modifiez votre recherche.",
    security: "Sécurité administrateur", currentAdmin: "Administrateur actuel",
    editEmail: "Modifier l’adresse email", newEmail: "Nouvel email",
    newPassword: "Nouveau mot de passe",
    passwordPlaceholder: "Laisser vide pour ne pas changer",
    confirmPassword: "Confirmer le mot de passe",
    confirmPlaceholder: "Retapez le mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    update: "Mettre à jour", loading: "Chargement...",
    adminUnavailable: "Le profil administrateur est indisponible.",
    emailMissing: "Email manquant", emailRequired: "L’email ne peut pas être vide.",
    invalidEmail: "Email invalide", checkEmail: "Vérifiez le format de l’adresse email.",
    noChanges: "Aucune modification", shortPassword: "Mot de passe trop court",
    minimum: "Minimum 6 caractères.", differentPasswords: "Mots de passe différents",
    passwordMismatch: "La confirmation ne correspond pas.",
    profileUpdated: "Profil mis à jour", error: "Erreur",
    updateError: "Erreur lors de la mise à jour.",
    teamError: "Chargement de l’équipe impossible",
    serverError: "Serveur injoignable", routeError: "Route /admin introuvable",
    missingRoute: "Le backend ne dispose pas de la route GET /api/admin.",
    adminError: "Profil administrateur indisponible",
    invalidFile: "Fichier invalide", chooseImage: "Veuillez choisir une image.",
    largeImage: "Image trop lourde", imageLimit: "La photo ne doit pas dépasser 5 Mo.",
    incomplete: "Champs incomplets", required: "Le nom et le poste sont obligatoires.",
    memberUpdated: "Membre modifié", memberAdded: "Membre ajouté",
    saveError: "Erreur lors de l’enregistrement.",
    deleteQuestion: "Supprimer", thisMember: "ce membre",
    deleteMessage: "Cette action est irréversible.",
    confirmDelete: "Oui, supprimer", cancel: "Annuler",
    memberDeleted: "Membre supprimé", deleteError: "Erreur lors de la suppression.",
    newMember: "Nouveau membre", editMember: "Modifier le membre",
    fullName: "Nom et prénom", namePlaceholder: "Nom complet",
    position: "Poste occupé", positionPlaceholder: "Poste",
    photo: "Photo de profil", photoLimit: "5 Mo maximum",
    preview: "Aperçu", changePhoto: "Changer la photo",
    choosePhoto: "Choisir une photo", confirm: "Confirmer",
    total: "Total", unavailable: "Non disponible"
  },
  mg: {
    admin: "Sehatra fitantanana", title: "Fikirana",
    subtitle: "Fitantanana ny ekipa sy ny fiarovana ny kaonty",
    back: "Hiverina", members: "Mpikambana ao amin’ny fikambanana",
    search: "Hitady...", refresh: "Havaozy", add: "Hanampy",
    profile: "Mombamomba", role: "Andraikitra", actions: "Safidy",
    edit: "Hanova", delete: "Hamafa", close: "Hidio",
    noMember: "Tsy misy mpikambana", noResult: "Tsy misy valiny",
    firstMember: "Ampidiro ny mpikambana voalohany.",
    changeSearch: "Ovay ny teny fikarohana.",
    security: "Fiarovana ny kaonty mpitantana", currentAdmin: "Mpitantana ankehitriny",
    editEmail: "Hanova ny adiresy email", newEmail: "Email vaovao",
    newPassword: "Tenimiafina vaovao",
    passwordPlaceholder: "Avelao ho foana raha tsy ovaina",
    confirmPassword: "Hamafiso ny tenimiafina",
    confirmPlaceholder: "Avereno ny tenimiafina",
    showPassword: "Asehoy ny tenimiafina",
    hidePassword: "Afeno ny tenimiafina",
    update: "Havaozy", loading: "Eo am-pakana tahiry...",
    adminUnavailable: "Tsy azo ny mombamomba ny mpitantana.",
    emailMissing: "Tsy misy email", emailRequired: "Tsy maintsy fenoina ny email.",
    invalidEmail: "Email tsy mety", checkEmail: "Hamarino ny endriky ny email.",
    noChanges: "Tsy misy fanovana", shortPassword: "Fohy loatra ny tenimiafina",
    minimum: "Litera na tarehintsoratra 6 farafahakeliny.",
    differentPasswords: "Tsy mitovy ny tenimiafina",
    passwordMismatch: "Tsy mifanaraka ny fanamafisana.",
    profileUpdated: "Vita ny fanavaozana ny kaonty", error: "Hadisoana",
    updateError: "Nisy olana tamin’ny fanavaozana.",
    teamError: "Tsy afaka naka ny lisitry ny ekipa",
    serverError: "Tsy tratra ny serveur", routeError: "Tsy hita ny route /admin",
    missingRoute: "Tsy misy ny route GET /api/admin ao amin’ny backend.",
    adminError: "Tsy azo ny mombamomba ny mpitantana",
    invalidFile: "Fichier tsy mety", chooseImage: "Misafidiana sary.",
    largeImage: "Sary lehibe loatra", imageLimit: "Tsy tokony hihoatra ny 5 Mo ny sary.",
    incomplete: "Tsy feno ny saha", required: "Tsy maintsy fenoina ny anarana sy andraikitra.",
    memberUpdated: "Vita ny fanovana", memberAdded: "Voampy ny mpikambana",
    saveError: "Nisy olana tamin’ny fitahirizana.",
    deleteQuestion: "Hamafa an’i", thisMember: "ity mpikambana ity",
    deleteMessage: "Tsy azo averina ity famafana ity.",
    confirmDelete: "Eny, fafao", cancel: "Ajanony",
    memberDeleted: "Voafafa ny mpikambana", deleteError: "Nisy olana tamin’ny famafana.",
    newMember: "Mpikambana vaovao", editMember: "Hanova mpikambana",
    fullName: "Anarana sy fanampin’anarana", namePlaceholder: "Anarana feno",
    position: "Andraikitra sahanina", positionPlaceholder: "Andraikitra",
    photo: "Sary famantarana", photoLimit: "5 Mo farany ambony",
    preview: "Topimaso", changePhoto: "Hanova sary",
    choosePhoto: "Hisafidy sary", confirm: "Hamafiso",
    total: "Fitambarany", unavailable: "Tsy azo"
  },
  en: {
    admin: "Administration", title: "Settings",
    subtitle: "Team management and administrator security",
    back: "Back", members: "Organization members",
    search: "Search...", refresh: "Refresh", add: "Add",
    profile: "Profile", role: "Position / Role", actions: "Actions",
    edit: "Edit", delete: "Delete", close: "Close",
    noMember: "No members", noResult: "No results",
    firstMember: "Add your first team member.",
    changeSearch: "Change your search.",
    security: "Administrator security", currentAdmin: "Current administrator",
    editEmail: "Change email address", newEmail: "New email",
    newPassword: "New password",
    passwordPlaceholder: "Leave blank to keep current password",
    confirmPassword: "Confirm password",
    confirmPlaceholder: "Retype your password",
    showPassword: "Show password", hidePassword: "Hide password",
    update: "Update", loading: "Loading...",
    adminUnavailable: "The administrator profile is unavailable.",
    emailMissing: "Missing email", emailRequired: "Email cannot be empty.",
    invalidEmail: "Invalid email", checkEmail: "Check the email address format.",
    noChanges: "No changes", shortPassword: "Password too short",
    minimum: "Minimum 6 characters.", differentPasswords: "Passwords do not match",
    passwordMismatch: "The confirmation does not match.",
    profileUpdated: "Profile updated", error: "Error",
    updateError: "An error occurred while updating.",
    teamError: "Unable to load the team",
    serverError: "Server unreachable", routeError: "Route /admin not found",
    missingRoute: "The backend does not provide GET /api/admin.",
    adminError: "Administrator profile unavailable",
    invalidFile: "Invalid file", chooseImage: "Please select an image.",
    largeImage: "Image too large", imageLimit: "The photo must not exceed 5 MB.",
    incomplete: "Incomplete fields", required: "Name and position are required.",
    memberUpdated: "Member updated", memberAdded: "Member added",
    saveError: "An error occurred while saving.",
    deleteQuestion: "Delete", thisMember: "this member",
    deleteMessage: "This action is irreversible.",
    confirmDelete: "Yes, delete", cancel: "Cancel",
    memberDeleted: "Member deleted", deleteError: "An error occurred while deleting.",
    newMember: "New member", editMember: "Edit member",
    fullName: "Full name", namePlaceholder: "Full name",
    position: "Position held", positionPlaceholder: "Position",
    photo: "Profile photo", photoLimit: "5 MB maximum",
    preview: "Preview", changePhoto: "Change photo",
    choosePhoto: "Choose a photo", confirm: "Confirm",
    total: "Total", unavailable: "Unavailable"
  },
  it: {
    admin: "Area amministrativa", title: "Configurazione",
    subtitle: "Gestione del team e sicurezza amministrativa",
    back: "Indietro", members: "Membri dell’organizzazione",
    search: "Cerca...", refresh: "Aggiorna", add: "Aggiungi",
    profile: "Profilo", role: "Posizione / Ruolo", actions: "Azioni",
    edit: "Modifica", delete: "Elimina", close: "Chiudi",
    noMember: "Nessun membro", noResult: "Nessun risultato",
    firstMember: "Aggiungi il primo membro del team.",
    changeSearch: "Modifica la ricerca.",
    security: "Sicurezza amministrativa", currentAdmin: "Amministratore attuale",
    editEmail: "Modifica indirizzo email", newEmail: "Nuova email",
    newPassword: "Nuova password",
    passwordPlaceholder: "Lascia vuoto per non modificare",
    confirmPassword: "Conferma password",
    confirmPlaceholder: "Ripeti la password",
    showPassword: "Mostra password", hidePassword: "Nascondi password",
    update: "Aggiorna", loading: "Caricamento...",
    adminUnavailable: "Il profilo amministratore non è disponibile.",
    emailMissing: "Email mancante", emailRequired: "L’email non può essere vuota.",
    invalidEmail: "Email non valida", checkEmail: "Verifica il formato dell’email.",
    noChanges: "Nessuna modifica", shortPassword: "Password troppo corta",
    minimum: "Minimo 6 caratteri.", differentPasswords: "Password differenti",
    passwordMismatch: "La conferma non corrisponde.",
    profileUpdated: "Profilo aggiornato", error: "Errore",
    updateError: "Errore durante l’aggiornamento.",
    teamError: "Impossibile caricare il team",
    serverError: "Server non raggiungibile", routeError: "Route /admin non trovata",
    missingRoute: "Il backend non dispone della route GET /api/admin.",
    adminError: "Profilo amministratore non disponibile",
    invalidFile: "File non valido", chooseImage: "Seleziona un’immagine.",
    largeImage: "Immagine troppo grande", imageLimit: "La foto non deve superare 5 MB.",
    incomplete: "Campi incompleti", required: "Nome e posizione sono obbligatori.",
    memberUpdated: "Membro modificato", memberAdded: "Membro aggiunto",
    saveError: "Errore durante il salvataggio.",
    deleteQuestion: "Eliminare", thisMember: "questo membro",
    deleteMessage: "Questa azione è irreversibile.",
    confirmDelete: "Sì, elimina", cancel: "Annulla",
    memberDeleted: "Membro eliminato", deleteError: "Errore durante l’eliminazione.",
    newMember: "Nuovo membro", editMember: "Modifica membro",
    fullName: "Nome e cognome", namePlaceholder: "Nome completo",
    position: "Posizione ricoperta", positionPlaceholder: "Posizione",
    photo: "Foto del profilo", photoLimit: "Massimo 5 MB",
    preview: "Anteprima", changePhoto: "Cambia foto",
    choosePhoto: "Scegli una foto", confirm: "Conferma",
    total: "Totale", unavailable: "Non disponibile"
  }
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

const confirmToast = ({ title, text, confirmText, cancelText }) =>
  Swal.fire({
    toast: true, position: 'top-end', icon: 'warning', title, text,
    showConfirmButton: true, showCancelButton: true,
    confirmButtonText: confirmText, cancelButtonText: cancelText,
    confirmButtonColor: '#DC2626', cancelButtonColor: '#64748B',
    reverseButtons: true, timer: undefined
  });

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: '', role: '', image: null };

const getMemberId = member => member?.id ?? member?._id;
const getAvatar = member => member?.img || member?.image || member?.image_url || '';
const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.erreur || fallback;

const inputClass = 'w-full min-w-0 rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] px-4 py-3 text-sm text-[#203528] outline-none transition focus:border-[#176B46] focus:ring-2 focus:ring-[#176B46]/10';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-medium text-[#203528]';
const cardClass = 'min-w-0 overflow-hidden rounded-[24px] border border-[#CDDCC4] bg-[#F0F5E9] shadow-sm';
const primaryButton = 'flex items-center justify-center gap-2 rounded-xl bg-[#176B46] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#103F30] disabled:cursor-not-allowed disabled:opacity-50';
const iconButton = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] text-[#14532D] transition hover:bg-[#176B46] hover:text-white disabled:opacity-50';

const Avatar = ({ src, name, className = 'h-12 w-12' }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const initials = (name || '').trim().split(/\s+/).slice(0, 2)
    .map(word => word.charAt(0).toUpperCase()).join('');

  return (
    <div className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#CDDCC4] bg-[#DCE9D3] font-semibold text-[#14532D]`}>
      {src && failedSrc !== src ? (
        <img src={src} alt={name || ''} className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}/>
      ) : initials || <User size={24}/>}
    </div>
  );
};

const PasswordField = ({ id, label, value, onChange, placeholder, visible, toggle, tr }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      <Lock size={17} className="text-[#176B46]"/>{label}
    </label>
    <div className="relative">
      <input id={id} type={visible ? 'text' : 'password'} value={value}
        onChange={onChange} placeholder={placeholder} autoComplete="new-password"
        className={`${inputClass} pr-12`}/>
      <button type="button" onClick={toggle}
        aria-label={visible ? tr.hidePassword : tr.showPassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#64748B] transition hover:text-[#176B46]">
        {visible ? <EyeOff size={19}/> : <Eye size={19}/>}
      </button>
    </div>
  </div>
);

const AdminProfile = ({ adminUser, setAdminUser, adminError, adminLoading, fetchAdmin, tr }) => {
  const [newEmail, setNewEmail] = useState(adminUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setNewEmail(adminUser?.email || ''), 0);
    return () => clearTimeout(timer);
  }, [adminUser]);

  const emailChanged = newEmail.trim() !== (adminUser?.email || '');
  const hasChanges = emailChanged || newPassword.length > 0;

  const handleUpdateProfile = async e => {
    e.preventDefault();
    if (loading || adminError || adminLoading || !adminUser) return;
    const email = newEmail.trim();

    if (!email) return notify('warning', tr.emailMissing, tr.emailRequired);
    if (!EMAIL_REGEX.test(email)) return notify('warning', tr.invalidEmail, tr.checkEmail);
    if (!hasChanges) return notify('info', tr.noChanges);

    if (newPassword) {
      if (newPassword.length < MIN_PASSWORD_LENGTH)
        return notify('warning', tr.shortPassword, tr.minimum);
      if (newPassword !== confirmPassword)
        return notify('warning', tr.differentPasswords, tr.passwordMismatch);
    }

    setLoading(true);
    try {
      const payload = { email, ...(newPassword && { password: newPassword }) };
      const response = await api.put('/admin', payload);
      setAdminUser(response.data);
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      notify('success', tr.profileUpdated);
    } catch (error) {
      notify('error', tr.error, getErrorMessage(error, tr.updateError));
    } finally { setLoading(false); }
  };

  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-3 border-b border-[#CDDCC4] p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCE9D3] text-[#176B46]">
            <ShieldCheck size={23}/>
          </div>
          <h2 className="text-base font-semibold text-[#14532D]">{tr.security}</h2>
        </div>
        <button type="button" onClick={fetchAdmin} disabled={adminLoading || loading}
          title={tr.refresh} aria-label={tr.refresh} className={iconButton}>
          <RefreshCcw size={17} className={adminLoading ? 'animate-spin' : ''}/>
        </button>
      </div>

      <div className="p-5 md:p-6">
        {adminError && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle size={19} className="mt-0.5 shrink-0"/>
            <p>{tr.adminUnavailable}</p>
          </div>
        )}

        <div className="mb-5">
          <p className={labelClass}>{tr.currentAdmin}</p>
          <div className="flex items-center gap-3 rounded-xl border border-[#CDDCC4] bg-[#DCE9D3] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B46] text-white">
              <User size={22}/>
            </div>
            <span className="min-w-0 break-all text-sm font-medium text-[#14532D]">
              {adminLoading ? tr.loading : adminUser?.email || tr.unavailable}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className={labelClass}>
              <Mail size={17} className="text-[#176B46]"/>{tr.editEmail}
            </label>
            <input id="admin-email" type="email" value={newEmail} required
              onChange={e => setNewEmail(e.target.value)} placeholder={tr.newEmail}
              autoComplete="email" className={inputClass}/>
          </div>

          <PasswordField id="admin-password" label={tr.newPassword}
            value={newPassword} onChange={e => setNewPassword(e.target.value)}
            placeholder={tr.passwordPlaceholder} visible={showPassword}
            toggle={() => setShowPassword(prev => !prev)} tr={tr}/>

          {newPassword && (
            <PasswordField id="admin-password-confirm" label={tr.confirmPassword}
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder={tr.confirmPlaceholder} visible={showPassword}
              toggle={() => setShowPassword(prev => !prev)} tr={tr}/>
          )}

          <button type="submit" className={`${primaryButton} w-full`}
            disabled={loading || !hasChanges || adminError || adminLoading || !adminUser}>
            {loading ? <Loader2 size={19} className="animate-spin"/> : <Save size={19}/>}
            {tr.update}
          </button>
        </form>
      </div>
    </section>
  );
};

const Parametres = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || 'fr').split('-')[0];
  const tr = translations[lang] || translations.fr;
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamError, setTeamError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminError, setAdminError] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTeam = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setTeamError(false);
    try {
      const response = await api.get('/team');
      setTeam(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setTeamError(true);
      const t = translations[(i18n.resolvedLanguage || 'fr').split('-')[0]] || translations.fr;
      notify('error', t.teamError, getErrorMessage(err, t.serverError));
    } finally { setLoading(false); }
  }, [i18n]);

  const fetchAdmin = useCallback(async () => {
    setAdminLoading(true);
    setAdminError(false);
    try {
      const response = await api.get('/admin');
      setAdminUser(response.data);
    } catch (err) {
      console.error(err);
      setAdminError(true);
      const t = translations[(i18n.resolvedLanguage || 'fr').split('-')[0]] || translations.fr;
      if (err.response?.status === 404) notify('warning', t.routeError, t.missingRoute);
      else notify('error', t.adminError, getErrorMessage(err, t.serverError));
    } finally { setAdminLoading(false); }
  }, [i18n]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmin();
      fetchTeam();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAdmin, fetchTeam]);

  useEffect(() => {
    if (!formData.image) return;
    const url = URL.createObjectURL(formData.image);
    const timer = setTimeout(() => setPreviewUrl(url), 0);
    return () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
    };
  }, [formData.image]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setPreviewUrl('');
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = e => {
      if (e.key === 'Escape' && !uploading) closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isModalOpen, uploading, closeModal]);

  const filteredTeam = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter(member => !q ||
      (member.name || '').toLowerCase().includes(q) ||
      (member.role || '').toLowerCase().includes(q));
  }, [team, search]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEdit = member => {
    setEditingItem(member);
    setFormData({ name: member.name || '', role: member.role || '', image: null });
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const handlePhotoChange = e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/'))
      return notify('error', tr.invalidFile, tr.chooseImage);
    if (file.size > MAX_IMAGE_SIZE)
      return notify('warning', tr.largeImage, tr.imageLimit);
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleImageConvert = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (uploading) return;
    const name = formData.name.trim();
    const role = formData.role.trim();

    if (!name || !role)
      return notify('warning', tr.incomplete, tr.required);

    const targetId = getMemberId(editingItem);
    if (editingItem && targetId == null)
      return notify('error', tr.error, tr.saveError);

    setUploading(true);
    try {
      let imageUrl = getAvatar(editingItem);
      if (formData.image) imageUrl = await handleImageConvert(formData.image);
      const payload = { name, role, img: imageUrl };

      if (editingItem) await api.put(`/team/${targetId}`, payload);
      else await api.post('/team', payload);

      await fetchTeam(true);
      notify('success', editingItem ? tr.memberUpdated : tr.memberAdded);
      closeModal();
    } catch (err) {
      notify('error', tr.error, getErrorMessage(err, tr.saveError));
    } finally { setUploading(false); }
  };

  const handleDelete = async member => {
    const id = getMemberId(member);
    if (id == null || deletingId !== null) return;

    const result = await confirmToast({
      title: `${tr.deleteQuestion} ${member.name || tr.thisMember} ?`,
      text: tr.deleteMessage,
      confirmText: tr.confirmDelete, cancelText: tr.cancel
    });

    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await api.delete(`/team/${id}`);
      setTeam(prev => prev.filter(m => getMemberId(m) !== id));
      notify('success', tr.memberDeleted);
    } catch (err) {
      notify('error', tr.error, getErrorMessage(err, tr.deleteError));
    } finally { setDeletingId(null); }
  };

  const modalPhoto = formData.image ? previewUrl : getAvatar(editingItem);

  const animation = {
    initial: reduced ? false : { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.45 }
  };

  const renderActions = member => (
    <div className="flex items-center justify-end gap-2">
      <button type="button" onClick={() => openEdit(member)}
        title={tr.edit} aria-label={tr.edit}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5EAF8] text-[#000099] transition hover:bg-[#000099] hover:text-white">
        <Edit size={17}/>
      </button>
      <button type="button" onClick={() => handleDelete(member)}
        disabled={deletingId !== null} title={tr.delete} aria-label={tr.delete}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50">
        {deletingId === getMemberId(member) ?
          <Loader2 size={17} className="animate-spin"/> : <Trash2 size={17}/>}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E8F0DF] text-[#203528]">
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-8 lg:px-14">

        {/* En-tête */}
        <motion.header {...animation}
          className="relative mb-5 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#103F30] to-[#176B46] p-5 text-white shadow-lg md:p-7">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[40px] border-white/5"/>
          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Settings size={28}/>
              </div>
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[#E5C43B]">
                  <ShieldCheck size={14}/>{tr.admin}
                </p>
                <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">{tr.title}</h1>
                <p className="mt-1 text-xs text-white/85 sm:text-sm">{tr.subtitle}</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate(-1)}
              className="group flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-medium transition hover:bg-white hover:text-[#14532D]">
              <ArrowLeft size={19} className="transition-transform group-hover:-translate-x-1"/>
              {tr.back}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">

          {/* Gestion des membres */}
          <motion.section {...animation} className={cardClass}>
            <div className="flex flex-col gap-4 border-b border-[#CDDCC4] p-4 md:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCE9D3] text-[#176B46]">
                  <Users size={24}/>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-[#14532D] md:text-lg">
                    {tr.members}
                  </h2>
                  <p className="mt-1 text-xs text-[#64748B]">{tr.total} : {team.length}</p>
                </div>
                <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#176B46] px-2 text-lg font-semibold text-white">
                  {team.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[140px] flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#176B46]"/>
                  <input type="search" value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={tr.search} aria-label={tr.search}
                    className={`${inputClass} pl-11`}/>
                </div>
                <button type="button" onClick={() => fetchTeam()} disabled={loading}
                  title={tr.refresh} aria-label={tr.refresh} className={iconButton}>
                  <RefreshCcw size={18} className={loading ? 'animate-spin' : ''}/>
                </button>
                <button type="button" onClick={openCreate} className={primaryButton}>
                  <Plus size={19}/>{tr.add}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <Loader2 size={35} className="mx-auto mb-3 animate-spin text-[#176B46]"/>
                <p className="text-sm text-[#374151]">{tr.loading}</p>
              </div>
            ) : teamError ? (
              <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <AlertCircle size={35} className="text-red-500"/>
                <h3 className="font-semibold text-[#14532D]">{tr.teamError}</h3>
                <p className="text-sm text-[#64748B]">{tr.serverError}</p>
                <button type="button" onClick={() => fetchTeam()} className={primaryButton}>
                  <RefreshCcw size={17}/>{tr.refresh}
                </button>
              </div>
            ) : filteredTeam.length > 0 ? (
              <>
                {/* Tableau desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[500px] text-left">
                    <thead className="bg-[#DCE9D3] text-sm text-[#14532D]">
                      <tr>
                        <th className="px-5 py-4 font-medium">{tr.profile}</th>
                        <th className="px-5 py-4 font-medium">{tr.role}</th>
                        <th className="px-5 py-4 text-right font-medium">{tr.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CDDCC4]">
                      {filteredTeam.map(member => (
                        <tr key={getMemberId(member)}
                          className="transition-colors hover:bg-[#E8F0DF]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar src={getAvatar(member)} name={member.name}/>
                              <span className="break-words text-sm font-semibold text-[#203528]">
                                {member.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-block break-words rounded-lg bg-[#DCE9D3] px-3 py-1.5 text-xs font-medium text-[#14532D]">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">{renderActions(member)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Liste mobile */}
                <div className="divide-y divide-[#CDDCC4] md:hidden">
                  {filteredTeam.map(member => (
                    <article key={getMemberId(member)} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={getAvatar(member)} name={member.name}
                          className="h-14 w-14"/>
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-semibold text-[#203528]">
                            {member.name}
                          </h3>
                          <p className="mt-1 break-words text-xs font-medium text-[#176B46]">
                            {member.role}
                          </p>
                        </div>
                        {renderActions(member)}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCE9D3] text-[#176B46]">
                  <Users size={30}/>
                </div>
                <h3 className="text-lg font-semibold text-[#14532D]">
                  {team.length ? tr.noResult : tr.noMember}
                </h3>
                <p className="mt-1 text-sm text-[#374151]">
                  {team.length ? tr.changeSearch : tr.firstMember}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#CDDCC4] bg-[#E8F0DF] px-5 py-4 text-xs text-[#374151]">
              <span>{filteredTeam.length} / {team.length}</span>
              <span className="flex items-center gap-2 font-medium text-[#14532D]">
                <ShieldCheck size={16}/> ONG TSINJO AINA
              </span>
            </div>
          </motion.section>

          {/* Sécurité administrateur */}
          <motion.div {...animation}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.1 }}>
            <AdminProfile adminUser={adminUser} setAdminUser={setAdminUser}
              adminError={adminError} adminLoading={adminLoading}
              fetchAdmin={fetchAdmin} tr={tr}/>
          </motion.div>
        </div>
      </div>

      {/* Fenêtre d'ajout et de modification */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={() => !uploading && closeModal()}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#103F30]/55 p-4 backdrop-blur-sm">

            <motion.div role="dialog" aria-modal="true" aria-labelledby="member-modal-title"
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              onClick={e => e.stopPropagation()}
              className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-[#CDDCC4] bg-[#F0F5E9] shadow-2xl">

              <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#103F30] to-[#176B46] p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    {editingItem ? <Edit size={21}/> : <Plus size={24}/>}
                  </div>
                  <h3 id="member-modal-title" className="text-lg font-semibold">
                    {editingItem ? tr.editMember : tr.newMember}
                  </h3>
                </div>
                <button type="button" onClick={closeModal} disabled={uploading}
                  aria-label={tr.close}
                  className="rounded-xl bg-white/10 p-2.5 transition hover:bg-white/25 disabled:opacity-50">
                  <X size={21}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-5 md:p-6">

                <div className="flex flex-col items-center gap-3">
                  <Avatar src={modalPhoto} name={formData.name}
                    className="h-24 w-24 text-2xl"/>

                  <input id="member-photo" type="file" accept="image/*"
                    onChange={handlePhotoChange} disabled={uploading}
                    className="peer sr-only"/>

                  <label htmlFor="member-photo"
                    className="flex max-w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#A8C39B] bg-[#E8F0DF] px-4 py-3 text-sm font-medium text-[#176B46] transition hover:bg-[#DCE9D3] peer-focus-visible:ring-2 peer-focus-visible:ring-[#176B46]">
                    <Camera size={19} className="shrink-0"/>
                    <span className="truncate">
                      {formData.image?.name || (editingItem ? tr.changePhoto : tr.choosePhoto)}
                    </span>
                  </label>
                  <p className="text-xs text-[#64748B]">{tr.photo} · {tr.photoLimit}</p>
                </div>

                <div>
                  <label htmlFor="member-name" className={labelClass}>
                    <User size={17} className="text-[#176B46]"/>{tr.fullName}
                  </label>
                  <input id="member-name" type="text" required
                    placeholder={tr.namePlaceholder} value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClass}/>
                </div>

                <div>
                  <label htmlFor="member-role" className={labelClass}>
                    <Users size={17} className="text-[#176B46]"/>{tr.position}
                  </label>
                  <input id="member-role" type="text" required
                    placeholder={tr.positionPlaceholder} value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className={inputClass}/>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#CDDCC4] pt-4">
                  <button type="button" onClick={closeModal} disabled={uploading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#CDDCC4] bg-[#E8F0DF] px-3 py-3 text-sm font-medium text-[#14532D] transition hover:bg-[#DCE9D3] disabled:opacity-50">
                    <X size={18}/>{tr.cancel}
                  </button>
                  <button type="submit" disabled={uploading} className={primaryButton}>
                    {uploading ? <Loader2 size={19} className="animate-spin"/> : <Save size={19}/>}
                    {tr.confirm}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Parametres;