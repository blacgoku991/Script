'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Step5Payment() {
  const router = useRouter();
  const {
    selectedPackage,
    uploadedAsset,
    selectedSlot,
    customerInfo,
    reset,
  } = useBookingStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handlePay() {
    if (!cardNumber || !expiry || !cvc || !cardName) {
      setError('Veuillez remplir tous les champs de paiement.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    // Simulate payment processing
    // In production: create PaymentIntent via API, use Stripe Elements
    await new Promise(r => setTimeout(r, 2500));

    // Simulate success
    const bookingId = `BK-${Date.now()}`;
    useBookingStore.setState({ bookingId });

    setIsProcessing(false);
    router.push(`/booking/confirmation?id=${bookingId}`);
  }

  const total = selectedPackage?.price || 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Paiement sécurisé</h2>
        <p className="text-gray-400">
          Votre paiement est traité par Stripe, le standard mondial de la sécurité bancaire en ligne.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Payment Form */}
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold">Carte bancaire</h3>
            <div className="flex gap-2">
              {['VISA', 'MC', 'AMEX'].map(brand => (
                <div key={brand} className="px-2 py-1 rounded text-xs font-bold text-gray-500 border border-gray-700">
                  {brand}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Card Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Numéro de carte <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full px-4 py-3.5 pr-12 rounded-lg text-sm text-white placeholder:text-gray-600 border border-amber-500/20 focus:outline-none focus:border-amber-500/60 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Nom sur la carte <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                placeholder="MOHAMMED EL ALAOUI"
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 rounded-lg text-sm text-white placeholder:text-gray-600 border border-amber-500/20 focus:outline-none focus:border-amber-500/60 transition-all uppercase"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Expiration <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="w-full px-4 py-3.5 rounded-lg text-sm text-white placeholder:text-gray-600 border border-amber-500/20 focus:outline-none focus:border-amber-500/60 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">
                  CVC <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-3.5 rounded-lg text-sm text-white placeholder:text-gray-600 border border-amber-500/20 focus:outline-none focus:border-amber-500/60 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm px-4 py-3 rounded-lg bg-red-500/10">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Pay button */}
            <Button
              variant="gold"
              size="lg"
              className="w-full mt-2"
              onClick={handlePay}
              loading={isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : `Payer ${formatCurrency(total)}`}
              {!isProcessing && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </Button>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SSL 256-bit
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Paiement Stripe
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                3D Secure
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Récapitulatif de commande
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <span className="text-amber-500 font-black">{selectedPackage?.duration}s</span>
                </div>
                <div>
                  <p className="text-white font-medium">Forfait {selectedPackage?.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{selectedPackage?.bestFor}</p>
                </div>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Client</span>
                <span className="text-gray-300">{customerInfo.firstName} {customerInfo.lastName}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Créneau</span>
                <span className="text-gray-300 text-right">
                  {selectedSlot && formatDate(selectedSlot.date)}
                  <br /><span className="text-xs">{selectedSlot?.startTime} → {selectedSlot?.endTime}</span>
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Contenu</span>
                <span className="text-gray-300 truncate max-w-[140px]">
                  {uploadedAsset?.type === 'video' ? '🎬' : '🖼️'} {uploadedAsset?.filename}
                </span>
              </div>

              <div className="luxury-divider my-2" />

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold">Sous-total</span>
                <span className="text-white">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="text-gray-600">Incluse</span>
              </div>

              <div className="mt-2 p-4 rounded-xl flex justify-between items-center"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-white font-bold">Total</span>
                <span className="text-amber-400 font-black text-2xl">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="glass rounded-2xl p-5">
            <h4 className="text-white font-semibold text-sm mb-4">Après le paiement</h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: '📧', text: 'Email de confirmation immédiat' },
                { icon: '🔍', text: 'Révision du contenu sous 24h' },
                { icon: '✅', text: 'Approbation et planification' },
                { icon: '📺', text: 'Diffusion à la date choisie' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span>{item.icon}</span>
                  <span className="text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={() => useBookingStore.getState().prevStep()}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Modifier mes informations
        </Button>
      </div>
    </div>
  );
}
