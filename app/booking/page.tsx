import { Suspense } from 'react';
import BookingFlow from '@/components/booking/BookingFlow';

export const metadata = {
  title: 'Réserver · MallScreen',
  description: 'Réservez votre créneau de diffusion sur l\'écran géant du Morocco Mall',
};

function BookingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookingFlow />
    </Suspense>
  );
}
