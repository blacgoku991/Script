'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingFlowState, Package, UploadedAsset, TimeSlot, CustomerInfo } from '@/types';

interface BookingStore extends BookingFlowState {
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPackage: (pkg: Package) => void;
  setAsset: (asset: UploadedAsset | null) => void;
  setSlot: (slot: TimeSlot | null) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setBookingId: (id: string) => void;
  setContentMode: (mode: 'fit' | 'fill') => void;
  reset: () => void;
}

const initialState: BookingFlowState = {
  currentStep: 1,
  selectedPackage: null,
  uploadedAsset: null,
  selectedSlot: null,
  customerInfo: {},
  bookingId: null,
  contentMode: 'fill',
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const current = get().currentStep;
        if (current < 5) {
          set({ currentStep: (current + 1) as 1 | 2 | 3 | 4 | 5 });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as 1 | 2 | 3 | 4 | 5 });
        }
      },

      setPackage: (pkg) => set({ selectedPackage: pkg }),
      setAsset: (asset) => set({ uploadedAsset: asset }),
      setSlot: (slot) => set({ selectedSlot: slot }),
      setCustomerInfo: (info) =>
        set((state) => ({ customerInfo: { ...state.customerInfo, ...info } })),
      setBookingId: (id) => set({ bookingId: id }),
      setContentMode: (mode) => set({ contentMode: mode }),

      reset: () => set(initialState),
    }),
    {
      name: 'morocco-mall-booking',
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedPackage: state.selectedPackage,
        uploadedAsset: state.uploadedAsset,
        selectedSlot: state.selectedSlot,
        customerInfo: state.customerInfo,
        bookingId: state.bookingId,
        contentMode: state.contentMode,
      }),
    }
  )
);
