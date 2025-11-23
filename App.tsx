
import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import { analyzeInteraction } from './services/geminiService';
import { InteractionAnalysis, AnalysisStatus, AnalysisMode, CustomDrugParams } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<InteractionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (
    drug: string, 
    protein: string, 
    mode: AnalysisMode, 
    customParams?: CustomDrugParams
  ) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeInteraction(drug, protein, mode, customParams);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
      setError("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 selection:bg-science-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Introduction */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center py-12 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              약물-단백질 상호작용 구조 예측
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              AI를 활용하여 타겟 단백질의 구조적 특징과 약물 결합 부위(Binding Pocket)를 심층 분석합니다.
            </p>
          </div>
        )}

        <InputSection 
          onAnalyze={handleAnalyze} 
          isLoading={status === AnalysisStatus.ANALYZING} 
        />

        {status === AnalysisStatus.ERROR && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && result && (
          <ResultCard data={result} />
        )}

        {/* Footer */}
        <footer className="pt-12 pb-6 text-center text-sm text-slate-600">
          <p>© {new Date().getFullYear()} BioStruct AI. Powered by Google Gemini 2.5 Flash / 3.0 Pro.</p>
          <p className="mt-2 text-xs">
            Disclaimer: This tool is for research purposes only and should not be used for clinical diagnosis.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
