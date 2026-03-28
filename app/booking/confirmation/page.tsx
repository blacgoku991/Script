'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || 'BK-XXXXX';
  const { selectedPackage, selectedSlot, customerInfo, uploadedAsset, reset } = useBookingStore();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-16">
      {/* Confetti-like glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent 70%)' }} />
      </div>

      <div className="relative max-w-xl w-full">
        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 pulse-gold"
            style={{ background: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.4)' }}>
            <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Réservation confirmée !
          </h1>
          <p className="text-gray-400 text-lg">
            Votre paiement a été accepté. Votre contenu est maintenant en attente de révision.
          </p>
        </div>

        {/* Booking details card */}
        <div className="glass rounded-3xl p-8 mb-6 border border-amber-500/20">
          {/* Reference */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Référence de réservation</p>
            <div className="text-3xl font-mono font-black text-gold-gradient">{bookingId}</div>
            <p className="text-gray-600 text-xs mt-2">Conservez cette référence pour le suivi</p>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 text-sm">
            {customerInfo.firstName && (
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Client</span>
                <span className="text-white">{customerInfo.firstName} {customerInfo.lastName}</span>
              </div>
            )}
            {selectedPackage && (
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Forfait</span>
                <span className="text-white">{selectedPackage.name} · {selectedPackage.duration}s</span>
              </div>
            )}
            {selectedSlot && (
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Créneau</span>
                <span className="text-white">{formatDate(selectedSlot.date)} · {selectedSlot.startTime}</span>
              </div>
            )}
            {uploadedAsset && (
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Contenu</span>
                <span className="text-white truncate max-w-[200px]">{uploadedAsset.filename}</span>
              </div>
            )}
            {selectedPackage && (
              <div className="flex justify-between py-2">
                <span className="text-gray-400 font-semibold">Total payé</span>
                <span className="text-amber-400 font-black text-lg">{formatCurrency(selectedPackage.price)}</span>
              </div>
            )}
          </div>
        </div>

        {/* What happens next */}
        <div className="glass rounded-2xl p-6 mb-8 border border-amber-500/10">
          <h3 className="text-white font-bold mb-5">Les prochaines étapes</h3>
          <div className="flex flex-col gap-4">
            {[
              { step: '1', icon: '📧', title: 'Email de confirmation', desc: 'Un email de confirmation vous a été envoyé à l\'adresse fournie.' },
              { step: '2', icon: '🔍', title: 'Révision du contenu', desc: 'Notre équipe examine votre contenu dans les 6 à 24 heures.' },
              { step: '3', icon: '✅', title: 'Approbation & Planification', desc: 'Vous recevrez un email de confirmation de diffusion.' },
              { step: '4', icon: '📺', title: 'Diffusion en direct', desc: 'Votre contenu sera diffusé à l\'heure choisie au Morocco Mall.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
                  {item.step}
                </div>
                <div>
                  <p className="text-white text-sm font-medium flex items-center gap-2">
                    <span>{item.icon}</span> {item.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1" onClick={reset}>
            <Button variant="outline" className="w-full">
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Link href="/booking" className="flex-1">
            <Button variant="gold" className="w-full">
              Nouvelle réservation
            </Button>
          </Link>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Des questions ? Contactez-nous à{' '}
          <a href="mailto:contact@mallscreen.ma" className="text-amber-500/70 hover:text-amber-400">
            contact@mallscreen.ma
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
