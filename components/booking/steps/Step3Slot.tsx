'use client';

import { useState, useMemo } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { TimeSlot } from '@/types';
import Button from '@/components/ui/Button';
import { getUpcomingDates, formatDate } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30',
];

// Simulated booked slots
const BOOKED_TIMES: Record<string, string[]> = {
  // In production, this would come from the database
};

function generateSlotAvailability(date: string, time: string): boolean {
  const key = `${date}-${time}`;
  // Deterministic pseudo-random based on date+time
  const hash = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % 4 !== 0; // ~75% available
}

export default function Step3Slot() {
  const { selectedSlot, setSlot, nextStep, prevStep, selectedPackage } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = useMemo(() => getUpcomingDates(30), []);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return TIME_SLOTS.map(time => ({
      time,
      available: generateSlotAvailability(selectedDate, time),
    }));
  }, [selectedDate]);

  function selectSlot(time: string) {
    if (!selectedDate) return;
    const available = generateSlotAvailability(selectedDate, time);
    if (!available) return;

    setSelectedTime(time);
    const [h, m] = time.split(':').map(Number);
    const dur = selectedPackage?.duration || 30;
    const endH = Math.floor((h * 60 + m + dur) / 60);
    const endM = (h * 60 + m + dur) % 60;
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    setSlot({
      id: `slot_${selectedDate}_${time}`,
      date: selectedDate,
      startTime: time,
      endTime,
      isAvailable: true,
      isBlocked: false,
    });
  }

  const canProceed = selectedSlot !== null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Choisissez votre créneau</h2>
        <p className="text-gray-400">Sélectionnez la date et l&apos;heure de diffusion de votre contenu.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
        {/* Date Picker */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center">1</span>
            Sélectionnez une date
          </h3>

          <div className="glass rounded-2xl p-4">
            {/* Month header */}
            <div className="text-center mb-4">
              <p className="text-amber-400 font-bold text-sm uppercase tracking-wider">
                {new Date().toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                <div key={d} className="text-center text-xs text-gray-600 font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Date buttons - simplified calendar view */}
            <div className="flex flex-col gap-1">
              {/* Upcoming dates as a scroll list */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                {dates.map(date => {
                  const d = new Date(date);
                  const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('fr-FR', { month: 'short' });
                  const isSelected = selectedDate === date;

                  return (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null); setSlot(null); }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold'
                          : 'hover:bg-white/5 text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="text-sm capitalize">{dayName}</span>
                      <span className="font-semibold">{dayNum} {monthName}</span>
                      <span className={`text-xs ${isSelected ? 'text-black/60' : 'text-gray-600'}`}>
                        {Math.floor(Math.random() * 8 + 8)} créneaux
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center">2</span>
            Sélectionnez l&apos;heure
            {selectedDate && (
              <span className="text-gray-500 text-xs font-normal">
                · {formatDate(selectedDate)}
              </span>
            )}
          </h3>

          {!selectedDate ? (
            <div className="glass rounded-2xl p-12 text-center">
              <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">Sélectionnez d&apos;abord une date</p>
            </div>
          ) : (
            <div className="glass rounded-2xl p-4">
              {/* Legend */}
              <div className="flex gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm border border-amber-500/40" />
                  <span className="text-gray-500">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-500" />
                  <span className="text-gray-500">Sélectionné</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-500/20" />
                  <span className="text-gray-500">Réservé</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {slots.map(({ time, available }) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      disabled={!available}
                      onClick={() => selectSlot(time)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        !available
                          ? 'bg-red-500/10 text-red-500/30 cursor-not-allowed border border-red-500/10'
                          : isSelected
                          ? 'bg-amber-500 text-black font-bold border border-amber-500'
                          : 'border border-amber-500/20 text-gray-300 hover:border-amber-500/50 hover:text-amber-400'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {selectedSlot && (
        <div className="rounded-2xl p-6 flex items-center gap-5"
          style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.12)' }}>
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-amber-400 font-bold">Créneau sélectionné</p>
            <p className="text-white text-sm mt-0.5">
              {formatDate(selectedSlot.date)} · {selectedSlot.startTime} → {selectedSlot.endTime}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Forfait {selectedPackage?.name} · {selectedPackage?.duration}s · {selectedPackage?.frequency}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Button>
        <Button variant="gold" size="lg" disabled={!canProceed} onClick={nextStep}>
          Mes informations
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
