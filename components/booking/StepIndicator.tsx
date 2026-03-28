'use client';

interface Step {
  number: number;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Forfait & Contenu', icon: '📤' },
  { number: 2, label: 'Aperçu', icon: '🎯' },
  { number: 3, label: 'Créneau', icon: '📅' },
  { number: 4, label: 'Informations', icon: '👤' },
  { number: 5, label: 'Paiement', icon: '💳' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isClickable = onStepClick && (isCompleted || step.number <= currentStep);

          return (
            <div key={step.number} className="flex items-center">
              {/* Step */}
              <div
                className={`flex flex-col items-center gap-2 ${isClickable ? 'cursor-pointer' : ''}`}
                onClick={() => isClickable && onStepClick?.(step.number)}
              >
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-amber-500 text-black'
                      : isActive
                      ? 'border-2 border-amber-500 text-amber-500 bg-amber-500/10'
                      : 'border border-gray-700 text-gray-600 bg-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label */}
                <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-amber-400' : isCompleted ? 'text-amber-500/60' : 'text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className={`w-16 lg:w-24 h-px mx-3 mb-5 transition-all duration-500 ${
                  currentStep > step.number ? 'bg-amber-500' : 'bg-gray-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-2">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted ? 'bg-amber-500 text-black' :
                  isActive ? 'border-2 border-amber-500 text-amber-500' :
                  'border border-gray-700 text-gray-700'
                }`}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${currentStep > step.number ? 'bg-amber-500' : 'bg-gray-800'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile current step label */}
      <div className="md:hidden text-center mt-3">
        <span className="text-amber-400 text-sm font-medium">
          Étape {currentStep}/{STEPS.length} · {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
}
