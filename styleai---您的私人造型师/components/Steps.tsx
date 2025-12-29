import React from 'react';

interface StepsProps {
  currentStep: number;
  totalSteps: number;
}

export const Steps: React.FC<StepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full max-w-xs mx-auto mb-12">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum <= currentStep;
          
          return (
            <div key={stepNum} className="flex flex-col items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? 'bg-slate-900 scale-125'
                    : 'bg-gray-300'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};