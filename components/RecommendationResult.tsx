import React, { useState, useRef } from 'react';
import { OutfitRecommendation } from '../types';
import { RefreshCw, Wand2, Send, Download, ExternalLink, ShoppingBag } from 'lucide-react';

interface RecommendationResultProps {
  recommendation: OutfitRecommendation;
  imageUrl: string;
  isEditing: boolean;
  onEditImage: (instruction: string) => Promise<void>;
  onReset: () => void;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  recommendation,
  imageUrl,
  isEditing,
  onEditImage,
  onReset,
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const items = recommendation.items;
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onEditImage(editPrompt);
      setEditPrompt('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-fade-in-up w-full">
      {/* Left Column: Image & Editor */}
      <div className="lg:w-1/2 flex flex-col space-y-6">
        <div className="relative group overflow-hidden shadow-2xl bg-gray-100 aspect-[3/4] border border-gray-100">
          {imageUrl ? (
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Generated Outfit Model"
              className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isEditing ? 'blur-md scale-105' : 'scale-100'}`}
            />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3 bg-gray-50">
               <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-ping"></span>
               <span className="font-serif italic text-lg tracking-wide text-gray-500">Generating Look...</span>
             </div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/80 text-slate-900 px-6 py-3 border border-gray-200 flex items-center gap-3 backdrop-blur-md shadow-lg">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-serif text-sm tracking-widest uppercase">Updating</span>
              </div>
            </div>
          )}

           {/* Download Action */}
           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <button className="p-3 bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-colors shadow-lg rounded-full" title="保存图片">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Edit Input */}
        <div className="flex flex-col gap-2">
           <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">调整设计 (AI Edit)</label>
           <div className="relative">
              <form onSubmit={handleSubmitEdit} className="flex border-b border-gray-300 focus-within:border-slate-900 transition-colors py-2">
                <Wand2 className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="例如：把衬衫换成白色的..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-gray-300 text-sm"
                  disabled={isEditing}
                />
                <button
                  type="submit"
                  disabled={!editPrompt.trim() || isEditing}
                  className="ml-2 text-slate-900 hover:text-slate-600 disabled:opacity-30 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
           </div>
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="mb-10">
          <span className="inline-block w-8 h-0.5 bg-slate-900 mb-6"></span>
          <h2 className="text-4xl serif font-medium text-slate-900 mb-6 leading-tight">{recommendation.title}</h2>
          <p className="text-gray-600 leading-8 font-light text-justify">{recommendation.explanation}</p>
        </div>

        <div className="space-y-6 mb-12">
          <OutfitItemCard label="Top" category="上装" item={items.top} />
          <OutfitItemCard label="Bottom" category="下装" item={items.bottom} />
          <OutfitItemCard label="Shoes" category="鞋履" item={items.shoes} />
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            onClick={onReset}
            className="group flex items-center gap-2 text-sm font-bold tracking-widest text-slate-900 uppercase hover:opacity-60 transition-opacity"
          >
            <span className="w-4 h-4 border border-slate-900 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
               ←
            </span>
            重新设计 (Start Over)
          </button>
        </div>
      </div>
    </div>
  );
};

const OutfitItemCard: React.FC<{ label: string; category: string; item: { name: string; description: string; color: string } }> = ({ label, category, item }) => {
  // Construct Taobao Search URL
  const searchComplete = `${item.color} ${item.name}`;
  const taobaoUrl = `https://s.taobao.com/search?q=${encodeURIComponent(searchComplete)}`;

  return (
    <div className="group border-b border-gray-100 pb-6 last:border-0 hover:bg-gray-50/50 p-4 -mx-4 rounded-xl transition-colors duration-300">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-slate-900 uppercase bg-gray-100 px-2 py-0.5 rounded-sm">{category}</span>
          <span className="text-xs font-medium text-gray-500">{item.color}</span>
        </div>
        <a 
          href={taobaoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          在淘宝搜索
        </a>
      </div>
      
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-lg serif text-slate-900 font-medium mb-1">{item.name}</h4>
          <p className="text-sm text-gray-500 font-light leading-relaxed max-w-md">{item.description}</p>
        </div>
        
        {/* Mobile-only visible link for better UX on small screens where hover doesn't exist */}
        <a 
          href={taobaoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="lg:hidden p-2 bg-gray-100 text-slate-900 rounded-full"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};