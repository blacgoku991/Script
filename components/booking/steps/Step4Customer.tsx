'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Step4Customer() {
  const { customerInfo, setCustomerInfo, nextStep, prevStep, selectedPackage } = useBookingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPremium = selectedPackage?.id === 'premium' || selectedPackage?.id === 'exclusive';

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!customerInfo.firstName?.trim()) e.firstName = 'Prénom requis';
    if (!customerInfo.lastName?.trim()) e.lastName = 'Nom requis';
    if (!customerInfo.email?.trim()) e.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) e.email = 'Email invalide';
    if (!customerInfo.phone?.trim()) e.phone = 'Téléphone requis';
    if (!customerInfo.campaignTitle?.trim()) e.campaignTitle = 'Titre de campagne requis';
    if (!customerInfo.agreeTerms) e.agreeTerms = 'Vous devez accepter les conditions';
    if (!customerInfo.agreeContent) e.agreeContent = 'Vous devez certifier vos droits';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) nextStep();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Vos informations</h2>
        <p className="text-gray-400">Ces informations sont utilisées pour la réservation et les communications.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="flex flex-col gap-6">
          {/* Personal info */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Informations personnelles
            </h3>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  placeholder="Mohammed"
                  required
                  value={customerInfo.firstName || ''}
                  onChange={e => setCustomerInfo({ firstName: e.target.value })}
                  error={errors.firstName}
                />
                <Input
                  label="Nom"
                  placeholder="El Alaoui"
                  required
                  value={customerInfo.lastName || ''}
                  onChange={e => setCustomerInfo({ lastName: e.target.value })}
                  error={errors.lastName}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="contact@exemple.ma"
                required
                value={customerInfo.email || ''}
                onChange={e => setCustomerInfo({ email: e.target.value })}
                error={errors.email}
              />

              <Input
                label="Téléphone"
                type="tel"
                placeholder="+212 6XX XXX XXX"
                required
                value={customerInfo.phone || ''}
                onChange={e => setCustomerInfo({ phone: e.target.value })}
                error={errors.phone}
              />
            </div>
          </div>

          {/* Campaign info */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Informations de la campagne
            </h3>

            <div className="flex flex-col gap-4">
              <Input
                label="Titre de la campagne"
                placeholder="Ex: Lancement Parfum Été 2025"
                required
                value={customerInfo.campaignTitle || ''}
                onChange={e => setCustomerInfo({ campaignTitle: e.target.value })}
                error={errors.campaignTitle}
              />

              <Input
                label="Nom de l'entreprise / marque"
                placeholder="Votre entreprise (optionnel)"
                value={customerInfo.companyName || ''}
                onChange={e => setCustomerInfo({ companyName: e.target.value })}
              />

              <Textarea
                label="Notes ou instructions"
                placeholder="Précisions sur votre campagne, demandes particulières..."
                rows={3}
                value={customerInfo.message || ''}
                onChange={e => setCustomerInfo({ message: e.target.value })}
              />
            </div>
          </div>

          {/* Billing (premium) */}
          {isPremium && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                Facturation
                <span className="text-amber-500 text-xs font-normal">(optionnel)</span>
              </h3>
              <div className="flex flex-col gap-4">
                <Input
                  label="Numéro de TVA / ICE"
                  placeholder="MA-ICE-XXXXXXXXX"
                  value={customerInfo.vatNumber || ''}
                  onChange={e => setCustomerInfo({ vatNumber: e.target.value })}
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customerInfo.invoiceRequested || false}
                    onChange={e => setCustomerInfo({ invoiceRequested: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-gray-300 text-sm">Demander une facture officielle</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Summary + Legal */}
        <div className="flex flex-col gap-4">
          {/* Order summary */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Récapitulatif</h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Forfait</span>
                <span className="text-white font-medium">
                  {useBookingStore.getState().selectedPackage?.name} ({useBookingStore.getState().selectedPackage?.duration}s)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Créneau</span>
                <span className="text-white font-medium">
                  {useBookingStore.getState().selectedSlot?.date} · {useBookingStore.getState().selectedSlot?.startTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Contenu</span>
                <span className="text-white font-medium truncate max-w-[160px]">
                  {useBookingStore.getState().uploadedAsset?.filename}
                </span>
              </div>
              <div className="luxury-divider my-1" />
              <div className="flex justify-between text-base">
                <span className="text-gray-300 font-semibold">Total</span>
                <span className="text-amber-400 font-black text-xl">
                  {useBookingStore.getState().selectedPackage?.price?.toLocaleString('fr-MA')} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Legal checkboxes */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Validation légale</h3>

            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customerInfo.agreeTerms || false}
                  onChange={e => setCustomerInfo({ agreeTerms: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm leading-relaxed">
                  J&apos;accepte les{' '}
                  <a href="#" className="text-amber-400 hover:underline">conditions générales d&apos;utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-amber-400 hover:underline">politique de contenu</a>
                  {' '}de MallScreen.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-400 text-xs ml-7">{errors.agreeTerms}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customerInfo.agreeContent || false}
                  onChange={e => setCustomerInfo({ agreeContent: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Je certifie détenir tous les droits sur le contenu soumis et que celui-ci
                  respecte les règles de contenu de la plateforme.
                </span>
              </label>
              {errors.agreeContent && <p className="text-red-400 text-xs ml-7">{errors.agreeContent}</p>}
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-gray-500 text-xs">Vos données sont protégées. Paiement sécurisé par Stripe.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Button>
        <Button variant="gold" size="lg" onClick={handleNext}>
          Procéder au paiement
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
