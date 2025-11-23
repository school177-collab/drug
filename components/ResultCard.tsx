import React, { useEffect, useRef } from 'react';
import { InteractionAnalysis } from '../types';
import { Target, Database, GitCommit, Box, Activity, Layers, Zap } from 'lucide-react';

interface ResultCardProps {
  data: InteractionAnalysis;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.pdbId && viewerRef.current) {
      // 3Dmol.js initialization logic
      // Note: We access $3Dmol via window since it's loaded via script tag
      const $3Dmol = (window as any).$3Dmol;
      
      if ($3Dmol) {
        const element = viewerRef.current;
        // Clear previous viewer if any
        element.innerHTML = '';
        
        const config = { backgroundColor: '#1e293b' }; // Slate-800 equivalent
        const viewer = $3Dmol.createViewer(element, config);

        // Fetch PDB
        $3Dmol.download(`pdb:${data.pdbId}`, viewer, { doAtomLoading: false }, function() {
          
          // 1. Protein Style (Cartoon Spectrum)
          viewer.setStyle({hetflag: false}, {cartoon: {color: 'spectrum'}});
          
          // 2. Ligand/Drug Style (Stick Green) - Visually distinct
          viewer.setStyle({hetflag: true}, {stick: {colorscheme: 'greenCarbon', radius: 0.5}});
          
          // 3. Highlight Binding Site Residues (Red Stick & Sphere)
          // Extract numbers from strings like "Thr315" -> 315
          const residueNumbers = data.residuesInvolved
            .map(r => parseInt(r.replace(/\D/g, '')))
            .filter(n => !isNaN(n));

          if (residueNumbers.length > 0) {
            viewer.addStyle({resi: residueNumbers}, {
              stick: {color: 'red', radius: 0.3},
              sphere: {color: 'red', scale: 0.3, opacity: 0.6}
            });
            viewer.addLabel("Binding Site", {fontSize: 12, position: {x:0, y:0, z:0}, backgroundColor: 'black', fontColor:'white'});
          }

          viewer.zoomTo();
          viewer.render();
        });
      }
    }
  }, [data.pdbId, data.residuesInvolved]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header / Summary */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Database className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{data.proteinName}</h2>
              <p className="text-science-400 text-sm font-medium mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {data.proteinFunction}
              </p>
            </div>
            {data.pdbId && (
              <span className="px-3 py-1 rounded-md bg-science-900/50 border border-science-500/30 text-science-300 text-xs font-mono">
                PDB ID: {data.pdbId}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 text-sm">
              Target: <span className="text-white font-semibold">{data.proteinName}</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-green-900/30 border border-green-700/50 text-green-300 text-sm">
              Drug: <span className="font-semibold">{data.drugName}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Binding Site Analysis */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-400" />
            결합 부위 (Binding Site) 분석
          </h3>
          <p className="text-slate-300 leading-relaxed mb-6 flex-grow">
            {data.bindingSiteDescription}
          </p>
          
          <div className="mt-auto">
            <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">주요 결합 잔기 (Key Residues)</h4>
            <div className="flex flex-wrap gap-2">
              {data.residuesInvolved.map((residue, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono font-medium">
                  {residue}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Structure Viewer */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm h-[500px] flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-science-400" />
            3D 구조 시각화 ({data.pdbId ? data.pdbId : '예측'})
          </h3>
          
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
             {data.pdbId ? (
                <>
                  <div ref={viewerRef} className="w-full h-full relative z-10" />
                  <div className="absolute bottom-4 left-4 z-20 space-y-1 bg-slate-900/80 p-2 rounded text-xs text-slate-300 backdrop-blur pointer-events-none">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></div> Protein (Cartoon)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Drug (Green Stick)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Binding Site (Red)</div>
                  </div>
                </>
             ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="text-center p-6">
                        <Box className="w-16 h-16 text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-400">PDB 구조 데이터를 찾을 수 없어<br/>3D 시각화를 제공할 수 없습니다.</p>
                        <p className="text-slate-500 text-sm mt-2">"{data.structuralChanges}"</p>
                    </div>
                </div>
             )}
          </div>
          <div className="mt-4 flex justify-between items-center">
             <div>
                 <h4 className="text-xs text-slate-500 mb-1">PREDICTED AFFINITY</h4>
                 <p className="text-lg font-bold text-emerald-400">{data.bindingAffinityPrediction}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Recommended Active Sites */}
      {data.alternativeBindingSites && data.alternativeBindingSites.length > 0 && (
        <div className="bg-slate-800/30 border border-science-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            추가 활성 조절 가능 부위 (Recommended Active Sites)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.alternativeBindingSites.map((site, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-science-500/50 transition-colors">
                <h4 className="text-science-300 font-semibold mb-2">{site.siteName}</h4>
                <p className="text-slate-400 text-sm mb-3 h-10 overflow-hidden text-ellipsis line-clamp-2">{site.description}</p>
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-bold">Mechanism</span>
                  <p className="text-slate-300 text-sm mt-1">{site.mechanism}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Significance */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-indigo-400" />
          임상적/생물학적 의의
        </h3>
        <p className="text-indigo-100/80 leading-relaxed">
          {data.clinicalSignificance}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;