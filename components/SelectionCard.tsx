import React from 'react';

interface SelectionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ label, selected, onClick, icon, image, description }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-start p-6 rounded-none transition-all duration-300 border border-gray-200 w-full text-left bg-white
        hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5
        ${selected
          ? 'border-slate-900 ring-1 ring-slate-900 bg-gray-50'
          : ''
        }
      `}
    >
      <div className="flex items-center justify-between w-full mb-3">
        {icon && (
          <div className={`transition-colors duration-300 ${selected ? 'text-slate-900' : 'text-gray-400 group-hover:text-slate-600'}`}>
            {icon}
          </div>
        )}
        {selected && (
           <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
        )}
      </div>

      <h3 className="text-xl font-serif font-medium text-slate-900 mb-1">{label}</h3>
      
      {description && (
        <p className="text-sm text-gray-500 font-light leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
};