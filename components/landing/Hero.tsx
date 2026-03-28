'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import MallScreenPreview from '@/components/preview/MallScreenPreview';

const DEMO_MESSAGES = [
  'Votre marque ici',
  'Joyeux Anniversaire!',
  'Lancement produit',
  'Mariage & Bonheur',
  'Promotion -50%',
];

export default function Hero() {
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex(i => (i + 1) % DEMO_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 gradient-radial opacity-40" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 mb-8">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
                Morocco Mall · Casablanca
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-white">Prenez le contrôle </span>
              <br />
              <span className="text-gold-gradient">de l&apos;écran géant</span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              Affichez votre message, votre marque ou votre campagne sur l&apos;écran iconique
              du Morocco Mall. Une visibilité maximale au cœur du centre commercial le plus
              fréquenté du Maroc.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start mb-10">
              {[
                { value: '120 000', label: 'visiteurs/jour' },
                { value: '15m', label: 'hauteur d\'écran' },
                { value: '4K', label: 'résolution ultra HD' },
              ].map(stat => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-gold-gradient">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/booking">
                <Button size="xl" variant="gold" className="shadow-2xl">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Réserver maintenant
                </Button>
              </Link>
              <a href="#preview">
                <Button size="xl" variant="outline">
                  Voir l&apos;aperçu
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-2xl opacity-30"
                style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.3) 0%, transparent 70%)' }} />

              {/* Preview wrapper */}
              <div className="relative rounded-2xl overflow-hidden gold-border shadow-2xl">
                <MallScreenPreview
                  mediaUrl={null}
                  mediaType="image"
                  showControls={false}
                />
                {/* Demo overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div
                      className="text-2xl md:text-3xl font-black text-white transition-all duration-500"
                      style={{ textShadow: '0 0 20px rgba(201,168,76,0.8)' }}
                    >
                      {DEMO_MESSAGES[demoIndex]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-dark rounded-full px-5 py-2 flex items-center gap-2 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-300 font-medium">Aperçu en temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-gray-600 uppercase tracking-widest">Découvrir</span>
        <svg className="w-4 h-4 text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
