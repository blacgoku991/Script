import { BookingStatus, Package, PackageName } from '@/types';

// We'll use a simple cn implementation without clsx if not installed
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') classes.push(input);
    else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

export function formatCurrency(amount: number, currency = 'MAD'): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    duration: 15,
    price: 1500,
    description: 'Idéal pour un message court et percutant',
    bestFor: 'Anniversaires & messages personnels',
    frequency: '4 diffusions par heure',
    features: [
      'Image ou courte vidéo',
      '15 secondes de visibilité',
      'Révision en 24h',
      'Confirmation par email',
    ],
  },
  {
    id: 'impact',
    name: 'Impact',
    duration: 30,
    price: 2800,
    description: 'Pour les campagnes mémorables et les promotions',
    bestFor: 'Promotions & événements',
    frequency: '4 diffusions par heure',
    featured: true,
    features: [
      'Image HD ou vidéo jusqu\'à 30s',
      '30 secondes de visibilité premium',
      'Révision prioritaire en 12h',
      'Confirmation + rappel SMS',
      'Rapport de diffusion',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    duration: 60,
    price: 4900,
    description: 'L\'expérience de diffusion ultime sur l\'écran géant',
    bestFor: 'Lancements produits & grandes marques',
    frequency: '4 diffusions par heure',
    features: [
      'Vidéo Full HD jusqu\'à 60s',
      '60 secondes d\'impact maximum',
      'Révision express en 6h',
      'Support dédié',
      'Rapport complet + analytics',
      'Certificat de diffusion',
    ],
  },
  {
    id: 'exclusive',
    name: 'Exclusif',
    duration: 120,
    price: 8900,
    description: 'Présence maximale pour les grandes campagnes',
    bestFor: 'Grandes marques & campagnes nationales',
    frequency: '8 diffusions par heure',
    features: [
      'Vidéo cinématique 4K jusqu\'à 2min',
      '120 secondes de diffusion continue',
      'Traitement VIP en 3h',
      'Account manager dédié',
      'Analytics en temps réel',
      'Certificat officiel de campagne',
      'Option: diffusion multi-journée',
    ],
  },
];

export function getPackageById(id: PackageName): Package | undefined {
  return PACKAGES.find(p => p.id === id);
}

export const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Brouillon', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
  uploaded: { label: 'Contenu envoyé', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  pending_payment: { label: 'Paiement en attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  paid: { label: 'Payé', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  pending_review: { label: 'En révision', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  approved: { label: 'Approuvé', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  revision_requested: { label: 'Révision demandée', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  rejected: { label: 'Refusé', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  scheduled: { label: 'Planifié', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)' },
  displayed: { label: 'Diffusé', color: '#6EE7B7', bg: 'rgba(110,231,183,0.1)' },
  cancelled: { label: 'Annulé', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)' },
  refunded: { label: 'Remboursé', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
};

export const CONTENT_RULES = [
  { icon: '📐', title: 'Formats acceptés', desc: 'JPG, PNG, WEBP (images) · MP4, MOV, WEBM (vidéos)' },
  { icon: '⚖️', title: 'Taille maximale', desc: '100 MB pour les vidéos · 20 MB pour les images' },
  { icon: '📺', title: 'Résolution recommandée', desc: '1080×1920 px (portrait) · 16:9 ou 9:16' },
  { icon: '⏱️', title: 'Durée maximale', desc: 'Selon le forfait choisi (15s / 30s / 60s / 120s)' },
  { icon: '🚫', title: 'Contenu interdit', desc: 'Violence, contenu explicite, discours haineux, informations trompeuses' },
  { icon: '©️', title: 'Droits d\'auteur', desc: 'Vous devez détenir les droits sur tout le contenu soumis' },
];

export function generateSlots(date: string): { time: string; available: boolean }[] {
  const slots = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      // Simulate some booked slots
      const random = Math.random();
      slots.push({
        time: `${hour}:${minute}`,
        available: random > 0.3,
      });
    }
  }
  return slots;
}

export function getUpcomingDates(days = 30): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
