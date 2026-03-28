'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import MallScreenPreview from '@/components/preview/MallScreenPreview';
import Button from '@/components/ui/Button';
import { formatCurrency, formatFileSize } from '@/lib/utils';

export default function Step2Preview() {
  const { uploadedAsset, selectedPackage, contentMode, setContentMode, nextStep, prevStep } = useBookingStore();

  const [showTips, setShowTips] = useState(true);

  if (!uploadedAsset || !selectedPackage) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Aucun contenu sélectionné. Veuillez revenir à l&apos;étape précédente.</p>
        <Button variant="outline" onClick={prevStep} className="mt-4">Retour</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Aperçu sur l&apos;écran géant</h2>
        <p className="text-gray-400">
          Voici exactement comment votre contenu apparaîtra sur l&apos;écran central du Morocco Mall.
          La projection perspective imite les conditions réelles de diffusion.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Preview */}
        <div className="relative">
          {/* Ambient glow */}
          <div className="absolute -inset-3 rounded-3xl opacity-15"
            style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent 70%)' }} />

          <div className="relative rounded-2xl overflow-hidden gold-border-glow shadow-2xl">
            <MallScreenPreview
              mediaUrl={uploadedAsset.url}
              mediaType={uploadedAsset.type}
              contentMode={contentMode}
              showControls={true}
            />
          </div>

          {/* Mode toggle overlay */}
          <div className="absolute top-3 left-3 flex gap-2">
            {(['fill', 'fit'] as const).map(m => (
              <button
                key={m}
                onClick={() => setContentMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all backdrop-blur-sm ${
                  contentMode === m
                    ? 'bg-amber-500 text-black'
                    : 'bg-black/60 border border-amber-500/30 text-gray-300 hover:text-amber-400'
                }`}
              >
                {m === 'fill' ? 'Remplissage' : 'Ajustement'}
              </button>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          {/* Asset info */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Votre contenu</h3>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                {uploadedAsset.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uploadedAsset.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <video src={uploadedAsset.url} className="w-full h-full object-cover" muted />
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium truncate max-w-[180px]">{uploadedAsset.filename}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {uploadedAsset.type === 'video' ? '🎬 Vidéo' : '🖼️ Image'}
                </p>
                <p className="text-gray-600 text-xs">
                  {formatFileSize(uploadedAsset.fileSize)}
                  {uploadedAsset.duration && ` · ${Math.round(uploadedAsset.duration)}s`}
                </p>
              </div>
            </div>

            {uploadedAsset.width && (
              <div className="flex justify-between text-xs py-2 border-t border-white/5">
                <span className="text-gray-500">Résolution</span>
                <span className="text-gray-300">{uploadedAsset.width}×{uploadedAsset.height}px</span>
              </div>
            )}
          </div>

          {/* Package info */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Forfait sélectionné</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-black text-2xl">{selectedPackage.duration}s</span>
              <span className="text-white font-bold">{selectedPackage.name}</span>
            </div>
            <p className="text-gray-500 text-xs mb-3">{selectedPackage.bestFor}</p>
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <span className="text-gray-400 text-sm">Prix total</span>
              <span className="text-white font-black text-lg">{formatCurrency(selectedPackage.price)}</span>
            </div>
          </div>

          {/* Tips */}
          {showTips && (
            <div className="rounded-2xl p-5 relative"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <button
                onClick={() => setShowTips(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-400"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 className="text-amber-400 font-semibold text-sm mb-3">💡 Conseils de rendu</h4>
              <ul className="flex flex-col gap-2 text-xs text-gray-400">
                <li>• Le mode <strong className="text-gray-300">Remplissage</strong> maximise l&apos;impact visuel</li>
                <li>• Le mode <strong className="text-gray-300">Ajustement</strong> préserve toute votre image</li>
                <li>• Le format portrait 9:16 est idéal pour l&apos;écran</li>
                <li>• Les couleurs vives sont plus visibles à distance</li>
              </ul>
            </div>
          )}

          {/* Approval notice */}
          <div className="rounded-xl p-4 flex gap-3"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-400/80 text-xs leading-relaxed">
              Votre contenu sera examiné par notre équipe après paiement. Approbation sous 6 à 24h.
            </p>
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
        <Button variant="gold" size="lg" onClick={nextStep}>
          Choisir mon créneau
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
