'use client';

const STEPS = [
  {
    number: '01',
    icon: '📤',
    title: 'Uploadez votre contenu',
    desc: 'Téléchargez votre image ou vidéo en haute qualité. Formats supportés : JPG, PNG, MP4, MOV.',
  },
  {
    number: '02',
    icon: '🎯',
    title: 'Visualisez en temps réel',
    desc: 'Voyez instantanément comment votre contenu apparaîtra sur l\'écran géant du Morocco Mall.',
  },
  {
    number: '03',
    icon: '📅',
    title: 'Choisissez votre créneau',
    desc: 'Sélectionnez la date et l\'heure de diffusion parmi les créneaux disponibles.',
  },
  {
    number: '04',
    icon: '💳',
    title: 'Payez en ligne',
    desc: 'Paiement sécurisé par carte bancaire. Votre réservation est immédiatement enregistrée.',
  },
  {
    number: '05',
    icon: '✅',
    title: 'Validation & diffusion',
    desc: 'Notre équipe examine votre contenu dans les 24h et confirme la diffusion par email.',
  },
  {
    number: '06',
    icon: '📺',
    title: 'À l\'affiche !',
    desc: 'Votre contenu est diffusé sur l\'écran géant devant des milliers de visiteurs.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Processus simple</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Comment ça marche ?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            De l&apos;upload à la diffusion en quelques minutes. Un processus fluide,
            transparent et entièrement en ligne.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative group card-hover"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="glass rounded-2xl p-8 h-full border border-amber-500/10 hover:border-amber-500/25 transition-colors duration-300">
                {/* Number */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-6xl font-black text-amber-500/10 group-hover:text-amber-500/20 transition-colors duration-300 leading-none">
                    {step.number}
                  </span>
                  <span className="text-3xl">{step.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>

                {/* Connector */}
                {i < STEPS.length - 1 && i % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-amber-500/20" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
