import Link from 'next/link';
import ReviewPanel from '@/components/admin/ReviewPanel';

export const metadata = { title: 'Révision · Admin MallScreen' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingReviewPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/admin" className="text-gray-600 hover:text-gray-400 transition-colors">
          Dashboard
        </Link>
        <span className="text-gray-700">/</span>
        <Link href="/admin/bookings" className="text-gray-600 hover:text-gray-400 transition-colors">
          Réservations
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-amber-400 font-mono font-bold">{id}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            Révision de réservation
            <span className="font-mono text-amber-500 text-xl">{id}</span>
          </h1>
          <p className="text-gray-500 mt-1">Examinez le contenu et prenez une décision</p>
        </div>
        <Link href="/admin/bookings"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux réservations
        </Link>
      </div>

      <ReviewPanel bookingId={id} />
    </div>
  );
}
