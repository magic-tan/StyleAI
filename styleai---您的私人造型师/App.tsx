import React, { useState } from 'react';
import { UserPreferences, Gender, BodyType, FashionStyle, OutfitRecommendation } from './types';
import { generateOutfitRecommendation, generateOutfitImage, editOutfitImage } from './services/geminiService';
import { Steps } from './components/Steps';
import { SelectionCard } from './components/SelectionCard';
import { RecommendationResult } from './components/RecommendationResult';
import { 
  User, Sparkles, ArrowRight, ArrowLeft, 
  Dumbbell, PersonStanding, Maximize, 
  Coffee, Briefcase, Zap, Watch, Circle, Building, Landmark, 
  Cpu, Disc, MountainSnow, Wine, GraduationCap, Hammer, Ghost
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: null,
    bodyType: null,
    style: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenderSelect = (gender: Gender) => {
    setPreferences((prev) => ({ ...prev, gender }));
  };

  const handleBodyTypeSelect = (bodyType: BodyType) => {
    setPreferences((prev) => ({ ...prev, bodyType }));
  };

  const handleStyleSelect = (style: FashionStyle) => {
    setPreferences((prev) => ({ ...prev, style }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(4); 

    try {
      const rec = await generateOutfitRecommendation(preferences);
      setRecommendation(rec);
      
      setIsGeneratingImage(true);
      const imageUrl = await generateOutfitImage(rec.visualPrompt);
      setGeneratedImageUrl(imageUrl);
      
    } catch (err: any) {
      setError(err.message || "服务繁忙，请稍后再试。");
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const handleEditImage = async (instruction: string) => {
    if (!generatedImageUrl) return;
    
    setIsEditingImage(true);
    try {
      const newImageUrl = await editOutfitImage(generatedImageUrl, instruction);
      setGeneratedImageUrl(newImageUrl);
    } catch (err: any) {
      alert("编辑失败: " + err.message);
    } finally {
      setIsEditingImage(false);
    }
  };

  const resetApp = () => {
    setCurrentStep(1);
    setPreferences({ gender: null, bodyType: null, style: null });
    setRecommendation(null);
    setGeneratedImageUrl('');
    setError(null);
  };

  const isStepValid = () => {
    if (currentStep === 1) return !!preferences.gender;
    if (currentStep === 2) return !!preferences.bodyType;
    if (currentStep === 3) return !!preferences.style;
    return false;
  };

  // Icon Mappings
  const getBodyTypeIcon = (type: BodyType) => {
    switch (type) {
      case BodyType.Slim: return <PersonStanding className="w-5 h-5 stroke-1" />;
      case BodyType.Average: return <User className="w-5 h-5 stroke-1" />;
      case BodyType.Athletic: return <Dumbbell className="w-5 h-5 stroke-1" />;
      case BodyType.PlusSize: return <Maximize className="w-5 h-5 stroke-1" />;
      default: return <User className="w-5 h-5 stroke-1" />;
    }
  };

  const getStyleIcon = (style: FashionStyle) => {
    switch (style) {
      case FashionStyle.Casual: return <Coffee className="w-5 h-5 stroke-1" />;
      case FashionStyle.Formal: return <Briefcase className="w-5 h-5 stroke-1" />;
      case FashionStyle.Streetwear: return <Zap className="w-5 h-5 stroke-1" />;
      case FashionStyle.Vintage: return <Watch className="w-5 h-5 stroke-1" />;
      case FashionStyle.Minimalist: return <Circle className="w-5 h-5 stroke-1" />;
      case FashionStyle.BusinessCasual: return <Building className="w-5 h-5 stroke-1" />;
      case FashionStyle.OldMoney: return <Landmark className="w-5 h-5 stroke-1" />;
      case FashionStyle.Cyberpunk: return <Cpu className="w-5 h-5 stroke-1" />;
      case FashionStyle.Y2K: return <Disc className="w-5 h-5 stroke-1" />;
      case FashionStyle.Gorpcore: return <MountainSnow className="w-5 h-5 stroke-1" />;
      case FashionStyle.FrenchChic: return <Wine className="w-5 h-5 stroke-1" />;
      case FashionStyle.IvyLeague: return <GraduationCap className="w-5 h-5 stroke-1" />;
      case FashionStyle.Workwear: return <Hammer className="w-5 h-5 stroke-1" />;
      case FashionStyle.Darkwear: return <Ghost className="w-5 h-5 stroke-1" />;
      default: return <Sparkles className="w-5 h-5 stroke-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-12 px-6 sm:px-8 font-sans">
      <header className="mb-16 text-center animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight mb-3">
          STYLE AI
        </h1>
        <div className="w-12 h-0.5 bg-slate-900 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          您的私人 AI 造型顾问
        </p>
      </header>

      <main className="w-full max-w-6xl">
        {currentStep < 4 && <Steps currentStep={currentStep} totalSteps={4} />}

        <div className="bg-white min-h-[600px] flex flex-col relative">
          
          {/* Step 1: Gender */}
          {currentStep === 1 && (
            <div className="animate-fade-in space-y-10 flex-1 flex flex-col justify-center items-center">
              <h2 className="text-3xl serif text-center text-slate-900">请选择您的性别</h2>
              <p className="text-gray-400 font-light text-center -mt-6">我们将根据性别提供基础剪裁建议</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
                <SelectionCard
                  label="男士 (GENTLEMAN)"
                  description="探索硬朗线条与绅士格调"
                  selected={preferences.gender === '男士'}
                  onClick={() => handleGenderSelect('男士')}
                  icon={<User className="w-6 h-6 stroke-1" />}
                />
                <SelectionCard
                  label="女士 (LADY)"
                  description="发掘优雅曲线与多变风格"
                  selected={preferences.gender === '女士'}
                  onClick={() => handleGenderSelect('女士')}
                  icon={<User className="w-6 h-6 stroke-1" />}
                />
              </div>
            </div>
          )}

          {/* Step 2: Body Type */}
          {currentStep === 2 && (
            <div className="animate-fade-in space-y-10 flex-1 flex flex-col justify-center items-center">
              <h2 className="text-3xl serif text-center text-slate-900">您的身材类型是？</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                {(Object.values(BodyType) as BodyType[]).map((type) => (
                  <SelectionCard
                    key={type}
                    label={type}
                    selected={preferences.bodyType === type}
                    onClick={() => handleBodyTypeSelect(type)}
                    icon={getBodyTypeIcon(type)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {currentStep === 3 && (
            <div className="animate-fade-in space-y-10 flex-1 flex flex-col justify-center items-center pb-10">
              <h2 className="text-3xl serif text-center text-slate-900">选择您偏好的风格</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                {(Object.values(FashionStyle) as FashionStyle[]).map((style) => (
                  <SelectionCard
                    key={style}
                    label={style.split(' ')[0]} // Only show Chinese name in title to keep it clean
                    description={style.split('(')[1]?.replace(')', '') || style} // English name as description
                    selected={preferences.style === style}
                    onClick={() => handleStyleSelect(style)}
                    icon={getStyleIcon(style)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Loading & Result */}
          {currentStep === 4 && isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-pulse">
               <div className="relative">
                 <div className="w-16 h-16 border border-gray-100 rounded-full flex items-center justify-center">
                   <div className="w-12 h-12 border-t-2 border-slate-900 rounded-full animate-spin"></div>
                 </div>
               </div>
               <div>
                 <h3 className="text-2xl serif text-slate-900">正在定制您的专属造型...</h3>
                 <p className="text-gray-400 mt-2 font-light">Style AI 正在分析潮流趋势</p>
               </div>
            </div>
          )}

          {currentStep === 4 && !isLoading && recommendation && (
            <RecommendationResult
              recommendation={recommendation}
              imageUrl={generatedImageUrl}
              isEditing={isEditingImage}
              onEditImage={handleEditImage}
              onReset={resetApp}
            />
          )}
          
          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="mt-16 flex justify-between items-center w-full max-w-4xl mx-auto px-4 pb-10">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-3 px-6 py-2 text-sm font-bold tracking-widest uppercase transition-colors ${
                  currentStep === 1
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'text-gray-400 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-4 px-10 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  !isStepValid()
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl'
                }`}
              >
                {currentStep === 3 ? '生成推荐 (Generate)' : '下一步 (Next)'}
                {currentStep === 3 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
          
          {error && (
             <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-800 px-6 py-3 border border-red-100 flex items-center shadow-lg text-sm font-medium z-50">
               {error}
             </div>
          )}
        </div>
      </main>
      
      <footer className="mt-20 border-t border-gray-100 pt-8 text-center pb-8">
         <p className="text-gray-300 text-xs tracking-widest uppercase">&copy; 2024 StyleAI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;