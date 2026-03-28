import BookingTable from '@/components/admin/BookingTable';

export const metadata = { title: 'Réservations · Admin MallScreen' };

export default function BookingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Réservations</h1>
          <p className="text-gray-500 mt-1">Gérez toutes les réservations de diffusion</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV
        </button>
      </div>
      <BookingTable />
    </div>
  );
}
