import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="luxury-divider mb-28" />

      {/* Radial glow bg */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 mb-10">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium tracking-widest uppercase">
            Réservation ouverte · Disponibilités limitées
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
          <span className="text-white">Votre message</span>
          <br />
          <span className="text-gold-gradient shimmer">à l&apos;échelle du mall</span>
        </h2>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Rejoignez les marques, créateurs et particuliers qui ont déjà choisi l&apos;écran géant
          du Morocco Mall pour marquer les esprits. Réservez votre créneau dès maintenant.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-10 justify-center mb-14">
          {[
            { v: '500+', l: 'campagnes diffusées' },
            { v: '98%', l: 'clients satisfaits' },
            { v: '24h', l: 'délai d\'approbation' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-3xl font-black text-gold-gradient">{s.v}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/booking">
            <Button size="xl" variant="gold" className="shadow-2xl shadow-amber-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Réserver mon créneau
            </Button>
          </Link>
          <a href="mailto:contact@mallscreen.ma">
            <Button size="xl" variant="outline">
              Nous contacter
            </Button>
          </a>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Questions ? Écrivez-nous à{' '}
          <a href="mailto:contact@mallscreen.ma" className="text-amber-500/70 hover:text-amber-400 transition-colors">
            contact@mallscreen.ma
          </a>
        </p>
      </div>
    </section>
  );
}
