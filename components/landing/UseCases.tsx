'use client';

const USE_CASES = [
  {
    icon: '🏢',
    title: 'Marques & Entreprises',
    desc: 'Campagnes publicitaires premium, lancement de produits, notoriété de marque à Casablanca.',
    tags: ['Pub institutionnelle', 'Lancement produit', 'Image de marque'],
  },
  {
    icon: '🎂',
    title: 'Anniversaires',
    desc: 'Offrez un cadeau unique et mémorable : un message d\'anniversaire sur l\'écran géant du mall.',
    tags: ['Message personnel', 'Surprise', 'Cadeau original'],
  },
  {
    icon: '💍',
    title: 'Mariages & Fiançailles',
    desc: 'Demandes en mariage, félicitations, messages pour les mariés devant leurs proches.',
    tags: ['Demande en mariage', 'Félicitations', 'Message de couple'],
  },
  {
    icon: '🎉',
    title: 'Événements',
    desc: 'Promotions d\'événements, concerts, expositions, soirées privées ou publiques.',
    tags: ['Promotion événement', 'Concert', 'Soirée'],
  },
  {
    icon: '🛍️',
    title: 'Boutiques du Mall',
    desc: 'Promotions flash, soldes, nouvelles collections pour les boutiques présentes dans le mall.',
    tags: ['Soldes', 'Nouvelle collection', 'Promotion'],
  },
  {
    icon: '🎯',
    title: 'Campagnes personnelles',
    desc: 'Messages de motivation, art visuel, projets personnels ou collectifs à fort impact.',
    tags: ['Art visuel', 'Message public', 'Projet créatif'],
  },
];

export default function UseCases() {
  return (
    <section className="py-28 px-6 relative">
      <div className="luxury-divider mb-28" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <span className="text-amber-500 text-xs font-medium tracking-widest uppercase">Cas d&apos;usage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Pour quels besoins ?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            L&apos;écran géant du Morocco Mall s&apos;adapte à toutes vos ambitions,
            personnelles ou professionnelles.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="glass rounded-2xl p-7 card-hover group border border-amber-500/10 hover:border-amber-500/25 transition-colors duration-300">
              <div className="text-4xl mb-5">{uc.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {uc.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{uc.desc}</p>
              <div className="flex flex-wrap gap-2">
                {uc.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs"
                    style={{ background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.7)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
