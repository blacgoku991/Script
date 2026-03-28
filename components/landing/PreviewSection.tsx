'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import MallScreenPreview from '@/components/preview/MallScreenPreview';
import Button from '@/components/ui/Button';

const DEMO_ASSETS = [
  { label: 'Campagne marque', color: '#C9A84C', gradient: 'linear-gradient(135deg, #C9A84C, #8B6914)' },
  { label: 'Message birthday', color: '#E91E8C', gradient: 'linear-gradient(135deg, #E91E8C, #9C27B0)' },
  { label: 'Promo boutique', color: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3, #00BCD4)' },
];

export default function PreviewSection() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [mode, setMode] = useState<'fit' | 'fill'>('fill');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedType, setUploadedType] = useState<'image' | 'video'>('image');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';

    setTimeout(() => {
      setUploadedUrl(url);
      setUploadedType(type);
      setIsUploading(false);
    }, 500);
  }

  return (
    <section id="preview" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Technologie exclusive</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Voyez votre contenu{' '}
            <span className="text-gold-gradient">avant de réserver</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Notre technologie de projection perspective vous permet de visualiser exactement
            comment votre contenu apparaîtra sur le gigantesque écran central du Morocco Mall.
          </p>
        </div>

        {/* Preview interactive zone */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Preview */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl opacity-20"
              style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent 70%)' }} />

            <div className="relative rounded-2xl overflow-hidden gold-border-glow">
              <MallScreenPreview
                mediaUrl={uploadedUrl}
                mediaType={uploadedType}
                contentMode={mode}
                showControls={true}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            {/* Upload zone */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center">1</span>
                Testez avec votre fichier
              </h3>

              <div
                className={`upload-zone rounded-xl p-8 text-center cursor-pointer ${isUploading ? 'active' : ''}`}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-amber-400 text-sm">Traitement...</p>
                  </div>
                ) : uploadedUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-400 text-sm font-medium">Fichier chargé !</p>
                    <p className="text-gray-500 text-xs">Cliquez pour changer</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-amber-400 text-sm font-medium">Glissez ou cliquez pour tester</p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG, MP4 · Aperçu instantané</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mode */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center">2</span>
                Mode d&apos;affichage
              </h3>
              <div className="flex gap-3">
                {(['fill', 'fit'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      mode === m
                        ? 'bg-amber-500 text-black'
                        : 'border border-amber-500/20 text-gray-400 hover:border-amber-500/40'
                    }`}
                  >
                    {m === 'fill' ? 'Remplissage' : 'Ajustement'}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-3">
                {mode === 'fill' ? 'Le contenu remplit tout l\'écran (peut rogner)' : 'Le contenu est entièrement visible (avec bordures)'}
              </p>
            </div>

            {/* CTA */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Prêt à réserver ?</h3>
              <p className="text-gray-500 text-sm mb-4">Continuez avec ce contenu ou uploadez le vôtre lors du processus de réservation.</p>
              <Link href="/booking">
                <Button variant="gold" className="w-full">
                  Réserver mon créneau
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
