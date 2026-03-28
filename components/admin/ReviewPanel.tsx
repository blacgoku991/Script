'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import MallScreenPreview from '@/components/preview/MallScreenPreview';
import { formatCurrency, formatDate, PACKAGES } from '@/lib/utils';
import { Textarea } from '@/components/ui/Input';

// Mock booking detail (in production: fetch from API)
const MOCK_BOOKING = {
  id: 'BK-001',
  status: 'pending_review' as const,
  packageId: 'impact' as const,
  customer: {
    firstName: 'Karim', lastName: 'Benali',
    email: 'karim@example.com', phone: '+212661234567',
    campaignTitle: 'Lancement Parfum Été', companyName: 'Benali Parfums',
    message: 'Diffusion le vendredi soir idéalement.',
    invoiceRequested: true, agreeTerms: true, agreeContent: true,
  },
  paymentStatus: 'paid',
  paymentAmount: 2800,
  asset: {
    id: 'a1', type: 'image' as const,
    url: null, filename: 'parfum_ete_2025.jpg',
    fileSize: 2500000, mimeType: 'image/jpeg',
    width: 1080, height: 1920,
    createdAt: '2025-03-20T10:05:00Z',
  },
  slot: { id: 's1', date: '2025-04-05', startTime: '18:00', endTime: '18:01', isAvailable: false, isBlocked: false },
  createdAt: '2025-03-20T10:00:00Z',
  updatedAt: '2025-03-20T10:05:00Z',
};

const MODERATION_ITEMS = [
  'Contenu approprié (pas de violence, contenu explicite)',
  'Pas de discours haineux ou discriminatoire',
  'Pas de contenu trompeur ou frauduleux',
  'Droits d\'auteur respectés',
  'Format et résolution conformes',
  'Durée compatible avec le forfait',
  'Qualité visuelle suffisante pour diffusion',
  'Contenu en accord avec l\'image du Morocco Mall',
];

interface ReviewPanelProps {
  bookingId: string;
}

export default function ReviewPanel({ bookingId }: ReviewPanelProps) {
  const router = useRouter();
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [adminNote, setAdminNote] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | 'revision' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const booking = MOCK_BOOKING; // In production: fetch by bookingId
  const pkg = PACKAGES.find(p => p.id === booking.packageId);
  const allChecked = Object.values(checklist).filter(Boolean).length === MODERATION_ITEMS.length;

  async function handleAction(act: 'approve' | 'reject' | 'revision') {
    setIsProcessing(true);
    // In production: call API endpoint
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    router.push('/admin/bookings');
  }

  return (
    <div className="grid xl:grid-cols-[1fr_400px] gap-8">
      {/* Left: Preview + Details */}
      <div className="flex flex-col gap-6">
        {/* Screen Preview */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Aperçu sur l&apos;écran</h3>
            <StatusBadge status={booking.status} />
          </div>
          <div className="rounded-xl overflow-hidden gold-border">
            <MallScreenPreview
              mediaUrl={null}
              mediaType={booking.asset.type}
              showControls={false}
            />
          </div>
          <div className="mt-3 text-center text-xs text-gray-600">
            Aperçu de la projection perspective sur l&apos;écran central
          </div>
        </div>

        {/* Content uploaded */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Contenu soumis</h3>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-xl bg-black/40 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
              {booking.asset.type === 'image' ? (
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-white font-medium">{booking.asset.filename}</p>
              <p className="text-gray-500 text-sm mt-1">
                {booking.asset.type === 'image' ? '🖼️ Image' : '🎬 Vidéo'} ·{' '}
                {(booking.asset.fileSize / 1024 / 1024).toFixed(1)} MB
              </p>
              {booking.asset.width && (
                <p className="text-gray-600 text-xs mt-1">
                  {booking.asset.width}×{booking.asset.height}px
                </p>
              )}
              <a href="#" className="text-amber-400 text-xs mt-2 inline-flex items-center gap-1 hover:text-amber-300">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger le fichier original
              </a>
            </div>
          </div>
        </div>

        {/* Moderation Checklist */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold mb-5">Checklist de modération</h3>
          <div className="flex flex-col gap-3">
            {MODERATION_ITEMS.map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist[i] || false}
                  onChange={e => setChecklist(prev => ({ ...prev, [i]: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className={`text-sm transition-colors ${checklist[i] ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-600">
            {Object.values(checklist).filter(Boolean).length}/{MODERATION_ITEMS.length} points validés
          </div>
        </div>

        {/* Internal note */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Note interne</h3>
          <Textarea
            placeholder="Note visible uniquement par l'équipe admin..."
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Right: Booking Info + Actions */}
      <div className="flex flex-col gap-5">
        {/* Booking header */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-amber-400 font-bold text-lg">{booking.id}</span>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-gray-500 text-xs">Créé le {formatDate(booking.createdAt)}</p>
        </div>

        {/* Customer */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Client</h3>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-white font-bold">{booking.customer.firstName} {booking.customer.lastName}</p>
            {booking.customer.companyName && (
              <p className="text-amber-500/70">{booking.customer.companyName}</p>
            )}
            <a href={`mailto:${booking.customer.email}`} className="text-amber-400 hover:underline">
              {booking.customer.email}
            </a>
            <p className="text-gray-400">{booking.customer.phone}</p>
            {booking.customer.message && (
              <div className="mt-3 p-3 rounded-lg bg-white/3 text-gray-400 text-xs italic border border-white/5">
                &ldquo;{booking.customer.message}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Package + Payment */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Forfait & Paiement</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Forfait</span>
              <span className="text-white font-medium">{pkg?.name} ({pkg?.duration}s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Montant</span>
              <span className="text-amber-400 font-bold">{formatCurrency(booking.paymentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paiement</span>
              <span className="text-green-400">✓ Payé</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Facture</span>
              <span className="text-gray-400">{booking.customer.invoiceRequested ? 'Demandée' : 'Non'}</span>
            </div>
          </div>
        </div>

        {/* Slot */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Créneau réservé</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="text-white">{formatDate(booking.slot.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Heure</span>
              <span className="text-white">{booking.slot.startTime} → {booking.slot.endTime}</span>
            </div>
          </div>
        </div>

        {/* Campaign */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">Campagne</h3>
          <p className="text-amber-400 font-medium">{booking.customer.campaignTitle}</p>
        </div>

        {/* Action Panel */}
        <div className="glass rounded-2xl p-6 border border-amber-500/15">
          <h3 className="text-white font-bold mb-5">Décision de modération</h3>

          {action === 'revision' && (
            <div className="mb-4">
              <Textarea
                label="Message pour le client"
                placeholder="Expliquez les modifications requises..."
                value={revisionNote}
                onChange={e => setRevisionNote(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              variant="success"
              className="w-full"
              disabled={!allChecked}
              loading={isProcessing && action === 'approve'}
              onClick={() => { setAction('approve'); handleAction('approve'); }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approuver
            </Button>

            <Button
              variant="outline"
              className="w-full border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
              loading={isProcessing && action === 'revision'}
              onClick={() => { setAction('revision'); }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {action === 'revision' ? 'Envoyer demande de révision' : 'Demander des modifications'}
            </Button>

            {action === 'revision' && revisionNote && (
              <Button variant="outline" className="w-full border-orange-500/40 text-orange-400"
                loading={isProcessing}
                onClick={() => handleAction('revision')}>
                Confirmer l&apos;envoi
              </Button>
            )}

            <Button
              variant="danger"
              className="w-full"
              loading={isProcessing && action === 'reject'}
              onClick={() => { setAction('reject'); handleAction('reject'); }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Refuser
            </Button>
          </div>

          {!allChecked && (
            <p className="text-xs text-gray-600 mt-3 text-center">
              Complétez la checklist pour approuver
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
