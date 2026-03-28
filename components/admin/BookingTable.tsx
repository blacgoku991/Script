'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Booking, BookingStatus } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, STATUS_CONFIG } from '@/lib/utils';

// Mock bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    status: 'pending_review',
    packageId: 'impact',
    customer: { firstName: 'Karim', lastName: 'Benali', email: 'karim@example.com', phone: '+212661234567', campaignTitle: 'Lancement Parfum Été', invoiceRequested: false, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 2800,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:05:00Z',
  },
  {
    id: 'BK-002',
    status: 'approved',
    packageId: 'premium',
    customer: { firstName: 'Fatima', lastName: 'Alaoui', email: 'f.alaoui@brand.ma', phone: '+212662345678', companyName: 'Alaoui Brand', campaignTitle: 'Nouvelle Collection Automne', invoiceRequested: true, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 4900,
    createdAt: '2025-03-19T14:30:00Z',
    updatedAt: '2025-03-19T16:00:00Z',
  },
  {
    id: 'BK-003',
    status: 'scheduled',
    packageId: 'starter',
    customer: { firstName: 'Youssef', lastName: 'Mansouri', email: 'y.mansouri@gmail.com', phone: '+212663456789', campaignTitle: 'Joyeux Anniversaire Papa!', invoiceRequested: false, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 1500,
    createdAt: '2025-03-18T09:00:00Z',
    updatedAt: '2025-03-18T11:00:00Z',
  },
  {
    id: 'BK-004',
    status: 'pending_review',
    packageId: 'exclusive',
    customer: { firstName: 'Sarah', lastName: 'Chraibi', email: 's.chraibi@luxebrand.ma', phone: '+212664567890', companyName: 'LuxeBrand Maroc', campaignTitle: 'Grand Opening - Été 2025', invoiceRequested: true, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 8900,
    createdAt: '2025-03-20T08:00:00Z',
    updatedAt: '2025-03-20T08:30:00Z',
  },
  {
    id: 'BK-005',
    status: 'revision_requested',
    packageId: 'impact',
    customer: { firstName: 'Omar', lastName: 'El Fassi', email: 'omar.elfassi@store.ma', phone: '+212665678901', companyName: 'El Fassi Store', campaignTitle: 'Soldes Printemps -30%', invoiceRequested: false, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 2800,
    createdAt: '2025-03-17T15:00:00Z',
    updatedAt: '2025-03-17T17:00:00Z',
  },
  {
    id: 'BK-006',
    status: 'displayed',
    packageId: 'premium',
    customer: { firstName: 'Nadia', lastName: 'Bakkali', email: 'n.bakkali@events.ma', phone: '+212666789012', companyName: 'Nadia Events', campaignTitle: 'Gala de Charité 2025', invoiceRequested: true, agreeTerms: true, agreeContent: true },
    paymentStatus: 'paid',
    paymentAmount: 4900,
    createdAt: '2025-03-15T12:00:00Z',
    updatedAt: '2025-03-15T20:00:00Z',
  },
];

const STATUS_FILTER_OPTIONS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending_review', label: 'En révision' },
  { value: 'approved', label: 'Approuvés' },
  { value: 'scheduled', label: 'Planifiés' },
  { value: 'paid', label: 'Payés' },
  { value: 'revision_requested', label: 'Révision demandée' },
  { value: 'rejected', label: 'Refusés' },
  { value: 'displayed', label: 'Diffusés' },
];

export default function BookingTable() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customer.firstName.toLowerCase().includes(q) ||
        b.customer.lastName.toLowerCase().includes(q) ||
        b.customer.email.toLowerCase().includes(q) ||
        (b.customer.companyName?.toLowerCase().includes(q) ?? false) ||
        b.customer.campaignTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, email, campagne..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 border border-amber-500/20 focus:outline-none focus:border-amber-500/50 transition-all"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as BookingStatus | 'all')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === opt.value
                  ? 'bg-amber-500 text-black'
                  : 'border border-amber-500/20 text-gray-500 hover:text-amber-400 hover:border-amber-500/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-amber-500/10">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.04)' }}>
              {['Référence', 'Client', 'Forfait', 'Montant', 'Créneau', 'Statut', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking, i) => (
              <tr
                key={booking.id}
                className={`border-t border-amber-500/5 transition-colors hover:bg-amber-500/3 ${i % 2 === 0 ? '' : ''}`}
              >
                <td className="px-5 py-4">
                  <span className="font-mono text-amber-400 text-sm font-bold">{booking.id}</span>
                  <p className="text-gray-600 text-xs mt-0.5">{formatDate(booking.createdAt)}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-white text-sm font-medium">{booking.customer.firstName} {booking.customer.lastName}</p>
                  <p className="text-gray-500 text-xs">{booking.customer.email}</p>
                  {booking.customer.companyName && (
                    <p className="text-amber-500/60 text-xs">{booking.customer.companyName}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-gray-300 text-sm capitalize">{booking.packageId}</span>
                  <p className="text-gray-600 text-xs">{booking.customer.campaignTitle}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white font-bold">{formatCurrency(booking.paymentAmount || 0)}</span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-400 text-sm">—</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Voir
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-xs text-right">{filtered.length} résultat(s)</p>
    </div>
  );
}
