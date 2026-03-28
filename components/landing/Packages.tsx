'use client';

import Link from 'next/link';
import { PACKAGES } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function Packages() {
  return (
    <section id="packages" className="py-28 px-6 relative">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Tarification claire</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Nos forfaits de diffusion
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choisissez la durée qui correspond à votre besoin.
            Chaque forfait inclut la révision du contenu et la confirmation de diffusion.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl overflow-hidden card-hover flex flex-col ${
                pkg.featured
                  ? 'border border-amber-500/50 shadow-2xl'
                  : 'border border-amber-500/15'
              }`}
              style={{
                background: pkg.featured
                  ? 'linear-gradient(160deg, rgba(201,168,76,0.08) 0%, rgba(0,0,0,0.5) 100%)'
                  : 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Most popular badge */}
              {pkg.featured && (
                <div className="absolute top-0 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1 text-xs font-bold tracking-widest uppercase"
                    style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C97A)' }}>
                    <span style={{ color: '#0A0A0A' }}>Le plus populaire</span>
                  </div>
                </div>
              )}

              <div className={`p-8 flex flex-col flex-1 ${pkg.featured ? 'pt-10' : ''}`}>
                {/* Duration badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-amber-500 font-black text-4xl">
                    {pkg.duration}
                    <span className="text-2xl">s</span>
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-amber-500/70 uppercase tracking-wider mb-4">{pkg.bestFor}</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{pkg.description}</p>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-black text-white">
                    {formatCurrency(pkg.price)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pkg.frequency}</div>
                </div>

                {/* CTA */}
                <Link href={`/booking?package=${pkg.id}`}>
                  <Button
                    variant={pkg.featured ? 'gold' : 'outline'}
                    className="w-full"
                  >
                    Réserver ce forfait
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-sm mt-10">
          Tous les prix sont en dirham marocain (MAD) TTC · TVA incluse · Remboursement possible en cas de refus de contenu
        </p>
      </div>
    </section>
  );
}
