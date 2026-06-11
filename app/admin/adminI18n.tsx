'use client'

/**
 * Lightweight EN/FR i18n for the admin panel (separate from the public
 * site's next-intl setup). Language is persisted in localStorage and
 * toggled from the sidebar. Default: French — the panel is for Élisheva.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type AdminLang = 'en' | 'fr'

const STRINGS = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    dresses: 'Dresses',
    enquiries: 'Enquiries',
    classes: 'Classes',
    social: 'Social Media',
    logout: 'Log out',
    // Dashboard
    totalDresses: 'Total Dresses',
    activeDresses: 'Active Dresses',
    newEnquiries: 'New Enquiries',
    addDress: '+ Add dress',
    viewEnquiries: 'View enquiries',
    // Dress list
    loading: 'Loading…',
    noDresses: 'No dresses yet',
    active: 'Active',
    hidden: 'Hidden',
    edit: 'Edit',
    del: 'Delete',
    confirmDelete: 'Delete this dress?',
    // Dress form
    addDressTitle: 'Add Dress',
    editDressTitle: 'Edit Dress',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    category: 'Category',
    availability: 'Availability',
    catEvening: 'Evening',
    catWedding: 'Wedding',
    availSale: 'Sale',
    availRental: 'Rental',
    availBoth: 'Sale & Rental',
    salePrice: 'Sale price (₪)',
    rentalPrice: 'Rental price (₪)',
    featured: 'Featured',
    activeToggle: 'Active',
    photos: 'Photos',
    addPhotos: '+ Add photos',
    uploadingPhotos: 'Uploading…',
    save: 'Save',
    saving: 'Saving…',
    cancel: 'Cancel',
    saveError: 'Failed to save. Please try again.',
    autoTranslateHint:
      'Fill in French only — English and Hebrew are translated automatically when you save.',
    // Enquiries
    noEnquiries: 'No enquiries yet',
    statusNew: 'New',
    statusRead: 'Read',
    statusReplied: 'Replied',
    // Login
    email: 'Email',
    password: 'Password',
    login: 'Log in',
    invalidCredentials: 'Invalid credentials',
  },
  fr: {
    // Nav
    dashboard: 'Tableau de bord',
    dresses: 'Robes',
    enquiries: 'Demandes',
    classes: 'Cours',
    social: 'Réseaux sociaux',
    logout: 'Se déconnecter',
    // Dashboard
    totalDresses: 'Robes au total',
    activeDresses: 'Robes actives',
    newEnquiries: 'Nouvelles demandes',
    addDress: '+ Ajouter une robe',
    viewEnquiries: 'Voir les demandes',
    // Dress list
    loading: 'Chargement…',
    noDresses: 'Aucune robe pour le moment',
    active: 'Active',
    hidden: 'Masquée',
    edit: 'Modifier',
    del: 'Supprimer',
    confirmDelete: 'Supprimer cette robe ?',
    // Dress form
    addDressTitle: 'Ajouter une robe',
    editDressTitle: 'Modifier la robe',
    titleLabel: 'Titre',
    descriptionLabel: 'Description',
    category: 'Catégorie',
    availability: 'Disponibilité',
    catEvening: 'Soirée',
    catWedding: 'Mariée',
    availSale: 'Vente',
    availRental: 'Location',
    availBoth: 'Vente & Location',
    salePrice: 'Prix de vente (₪)',
    rentalPrice: 'Prix de location (₪)',
    featured: 'En vedette',
    activeToggle: 'Active',
    photos: 'Photos',
    addPhotos: '+ Ajouter des photos',
    uploadingPhotos: 'Envoi…',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    cancel: 'Annuler',
    saveError: "Échec de l'enregistrement. Veuillez réessayer.",
    autoTranslateHint:
      "Remplissez uniquement en français — l'anglais et l'hébreu sont traduits automatiquement à l'enregistrement.",
    // Enquiries
    noEnquiries: 'Aucune demande pour le moment',
    statusNew: 'Nouvelle',
    statusRead: 'Lue',
    statusReplied: 'Répondue',
    // Login
    email: 'Email',
    password: 'Mot de passe',
    login: 'Se connecter',
    invalidCredentials: 'Identifiants invalides',
  },
} as const

export type AdminStringKey = keyof (typeof STRINGS)['en']

interface AdminLangContextValue {
  lang: AdminLang
  setLang: (lang: AdminLang) => void
  t: (key: AdminStringKey) => string
}

const AdminLangContext = createContext<AdminLangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => STRINGS.fr[key],
})

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>('fr')

  // Load saved choice after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem('admin-lang')
    if (saved === 'en' || saved === 'fr') setLangState(saved)
  }, [])

  function setLang(next: AdminLang) {
    setLangState(next)
    localStorage.setItem('admin-lang', next)
  }

  const t = (key: AdminStringKey) => STRINGS[lang][key]

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AdminLangContext.Provider>
  )
}

export function useAdminT() {
  return useContext(AdminLangContext)
}

/** Translated page heading — usable from server components. */
export function AdminTitle({ k }: { k: AdminStringKey }) {
  const { t } = useAdminT()
  return (
    <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">{t(k)}</h1>
  )
}
