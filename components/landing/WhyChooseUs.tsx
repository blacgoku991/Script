const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    title: 'Écran géant 4K',
    desc: 'Un écran de 15 mètres de haut en ultra haute définition, visible depuis tout l\'atrium du mall.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: '120 000 visiteurs/jour',
    desc: 'Le Morocco Mall accueille jusqu\'à 120 000 visiteurs quotidiens, une audience premium garantie.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1m-6 0h.01" />
      </svg>
    ),
    title: 'Aperçu instantané',
    desc: 'Visualisez votre contenu projeté en perspective sur l\'écran réel avant de valider votre réservation.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Paiement 100% sécurisé',
    desc: 'Transactions protégées par Stripe, le standard mondial du paiement en ligne.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Révision humaine',
    desc: 'Chaque contenu est examiné par notre équipe pour garantir qualité et conformité.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Suivi par email',
    desc: 'Notifications à chaque étape : paiement, révision, approbation, diffusion et rapport final.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 px-6 relative" style={{ background: 'rgba(201,168,76,0.02)' }}>
      <div className="luxury-divider mb-28" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Nos avantages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Pourquoi choisir MallScreen ?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Une plateforme pensée pour la performance, la simplicité et l&apos;impact visuel.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex gap-5 p-6 glass rounded-2xl card-hover group border border-amber-500/10 hover:border-amber-500/20 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-amber-500 group-hover:text-amber-400 transition-colors"
                style={{ background: 'rgba(201,168,76,0.08)' }}>
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
