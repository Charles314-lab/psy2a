/**
 * Configuration centrale du site PSY2A, source unique de vérité.
 * Réutilisée par le Header, le Footer et les pages (navigation, coordonnées,
 * réseaux, partenaires). Éviter de dupliquer ces valeurs ailleurs.
 *
 * NOTE : les champs marqués TODO doivent être renseignés depuis la page
 * Contact du site original (https://psy2a.ml/nous-contacter/).
 */

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  name: 'PSY2A',
  tagline: 'Toutes vos consultations en ligne',
  practitioner: 'Ibrahim HAÏDARA',
  /** Nom + titre affichés en deux lignes (fiche praticien, titres de page, pied de page). */
  practitionerName: 'Ibrahim HAÏDARA',
  practitionerTitle: 'Docteur en Psychologie',
  license:
    "Licence d'exploitation délivrée par l'Ordre des Médecins du Mali, N° 1068 / 2016 / CNOM",
  hours: 'Du lundi au samedi, uniquement sur rendez-vous',

  /** Coordonnées, France (le Dr exerce depuis la France, en téléconsultation). */
  contact: {
    phone: '(+33) 6 62 25 20 38',
    phoneHref: '+33662252038', // format lien tel:
    email: 'contact@psy2a.com',
    address: 'France',
  },

  /** Références professionnelles France (affichées dans les mentions légales). */
  registration: {
    siren: '995 147 105',
    siret: '995 147 105 00028',
    ape: '96.09Z',
    rpps: '10008658899',
    autorisation: "Autorisation d'exercice de psychologue (diplôme étranger), Agence Régionale de Santé",
  },

  social: {
    facebook: 'https://web.facebook.com/psy2a/',
    youtube: 'https://www.youtube.com/@psy2a1ercabinetdepsycholog43/videos',
    linkedin: 'https://www.linkedin.com/in/dr-ibrahim-ha%C3%AFdara-5700384/',
  },
} as const;

/** Navigation principale (Header) et pied de page (Footer). */
export const primaryNav: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Votre Psychologue', href: '/le-cabinet/' },
  { label: 'Les Consultations', href: '/consultations/' },
  { label: 'Contact', href: '/contact/' },
];

/** Publics pris en charge (section d'accueil). */
export const audiences = ['Enfants', 'Ados', 'Adultes', 'Couples'] as const;

/**
 * Partenaires « Ils nous font confiance ».
 * Les logos originaux sont à ré-héberger localement puis à optimiser (SVG/WebP).
 */
export interface Partner {
  name: string;
  region: 'mali' | 'france';
}

export const partners: Partner[] = [
  { name: 'CARE', region: 'mali' },
  { name: 'CICR (Croix-Rouge)', region: 'mali' },
  { name: 'Save the Children', region: 'mali' },
  { name: 'Ambassade du Canada', region: 'mali' },
  { name: 'Ambassade de France', region: 'mali' },
  { name: 'Ambassade de Suisse', region: 'mali' },
  { name: 'Orange Mali', region: 'mali' },
  { name: 'Administration penitentiaire de Seine-et-Marne', region: 'france' },
  { name: 'Protection Judiciaire de la Jeunesse (PJJ) de Haute-Vienne', region: 'france' },
  { name: "Aide Sociale a l'Enfance (ASE) d'Alsace", region: 'france' },
];
