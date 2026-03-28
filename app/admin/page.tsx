import { formatCurrency } from '@/lib/utils';

const STATS = [
  { label: 'Réservations totales', value: '48', change: '+12%', icon: '📋', color: '#C9A84C' },
  { label: 'En attente de révision', value: '5', change: '+3 aujourd\'hui', icon: '🔍', color: '#8B5CF6' },
  { label: 'Revenus du mois', value: '124 500 MAD', change: '+28%', icon: '💰', color: '#10B981' },
  { label: 'Taux d\'occupation', value: '73%', change: '+5%', icon: '📅', color: '#F59E0B' },
];

const RECENT_BOOKINGS = [
  { id: 'BK-004', client: 'Sarah Chraibi', campaign: 'Grand Opening Été 2025', pkg: 'Exclusif', amount: 8900, status: 'pending_review' },
  { id: 'BK-001', client: 'Karim Benali', campaign: 'Lancement Parfum Été', pkg: 'Impact', amount: 2800, status: 'pending_review' },
  { id: 'BK-002', client: 'Fatima Alaoui', campaign: 'Nouvelle Collection Automne', pkg: 'Premium', amount: 4900, status: 'approved' },
  { id: 'BK-003', client: 'Youssef Mansouri', campaign: 'Joyeux Anniversaire Papa!', pkg: 'Starter', amount: 1500, status: 'scheduled' },
  { id: 'BK-005', client: 'Omar El Fassi', campaign: 'Soldes Printemps -30%', pkg: 'Impact', amount: 2800, status: 'revision_requested' },
];

const STATUS_COLORS: Record<string, string> = {
  pending_review: '#8B5CF6',
  approved: '#10B981',
  scheduled: '#C9A84C',
  revision_requested: '#F97316',
  displayed: '#6EE7B7',
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'En révision',
  approved: 'Approuvé',
  scheduled: 'Planifié',
  revision_requested: 'Révision demandée',
  displayed: 'Diffusé',
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-black text-white">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans l&apos;administration MallScreen · Morocco Mall</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {STATS.map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-6 card-hover border border-amber-500/10">
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ background: `${stat.color}18`, color: stat.color }}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-8">
        {/* Recent bookings */}
        <div className="glass rounded-2xl p-6 border border-amber-500/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold">Réservations récentes</h2>
            <a href="/admin/bookings" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
              Voir tout →
            </a>
          </div>
          <div className="flex flex-col gap-1">
            {RECENT_BOOKINGS.map(b => (
              <a
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/3 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                  style={{ background: `${STATUS_COLORS[b.status]}18`, color: STATUS_COLORS[b.status] }}>
                  {b.pkg[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">{b.client}</span>
                    <span className="text-amber-500/60 font-mono text-xs">{b.id}</span>
                  </div>
                  <p className="text-gray-500 text-xs truncate">{b.campaign}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-white text-sm font-bold">{formatCurrency(b.amount)}</span>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${STATUS_COLORS[b.status]}15`, color: STATUS_COLORS[b.status] }}>
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick actions + status breakdown */}
        <div className="flex flex-col gap-5">
          {/* Status breakdown */}
          <div className="glass rounded-2xl p-6 border border-amber-500/10">
            <h3 className="text-white font-bold mb-5">Répartition des statuts</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'En révision', count: 5, color: '#8B5CF6', pct: 35 },
                { label: 'Approuvées', count: 12, color: '#10B981', pct: 55 },
                { label: 'Planifiées', count: 8, color: '#C9A84C', pct: 65 },
                { label: 'Diffusées', count: 23, color: '#6EE7B7', pct: 100 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{item.label}</span>
                    <span style={{ color: item.color }} className="font-bold">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass rounded-2xl p-6 border border-amber-500/10">
            <h3 className="text-white font-bold mb-5">Actions rapides</h3>
            <div className="flex flex-col gap-3">
              <a href="/admin/bookings?status=pending_review"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/8 transition-all group border border-amber-500/10 hover:border-amber-500/25">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/15">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">5 contenus à réviser</p>
                  <p className="text-gray-600 text-xs">Action requise</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a href="/admin/packages"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/8 transition-all group border border-amber-500/10 hover:border-amber-500/25">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/15">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Gérer les forfaits</p>
                  <p className="text-gray-600 text-xs">Modifier les prix et durées</p>
                </div>
                <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Revenue widget */}
          <div className="rounded-2xl p-6 border border-amber-500/20"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(0,0,0,0.4))' }}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Revenus ce mois</p>
            <p className="text-3xl font-black text-gold-gradient mb-1">124 500 MAD</p>
            <p className="text-green-400 text-sm">+28% vs mois dernier</p>
          </div>
        </div>
      </div>
    </div>
  );
}
