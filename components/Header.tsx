import React from 'react';
import { Dna, Activity } from 'lucide-react';
import { APP_TITLE, APP_SUBTITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-science-500 to-dna-600 p-2 rounded-lg shadow-lg shadow-science-900/50">
            <Dna className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{APP_TITLE}</h1>
            <p className="text-xs text-slate-400 hidden sm:block">{APP_SUBTITLE}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-science-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Ready
          </span>
          <a 
            href="#" 
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Documentation"
          >
            <Activity className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;