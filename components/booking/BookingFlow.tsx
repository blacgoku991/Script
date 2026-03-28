'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';
import StepIndicator from './StepIndicator';
import Step1PackageContent from './steps/Step1PackageContent';
import Step2Preview from './steps/Step2Preview';
import Step3Slot from './steps/Step3Slot';
import Step4Customer from './steps/Step4Customer';
import Step5Payment from './steps/Step5Payment';
import { PACKAGES } from '@/lib/utils';

export default function BookingFlow() {
  const { currentStep, setStep, setPackage } = useBookingStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg) {
      const found = PACKAGES.find(p => p.id === pkg);
      if (found) setPackage(found);
    }
  }, [searchParams, setPackage]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Réservez votre <span className="text-gold-gradient">diffusion</span>
          </h1>
          <p className="text-gray-500">Morocco Mall · Écran central · Casablanca</p>
        </div>

        <StepIndicator
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep) setStep(step as 1|2|3|4|5);
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-3xl p-6 md:p-10 border border-amber-500/10">
          {currentStep === 1 && <Step1PackageContent />}
          {currentStep === 2 && <Step2Preview />}
          {currentStep === 3 && <Step3Slot />}
          {currentStep === 4 && <Step4Customer />}
          {currentStep === 5 && <Step5Payment />}
        </div>
      </div>
    </div>
  );
}
