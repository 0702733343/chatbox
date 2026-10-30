import React from 'react';
import { Phone, Copy, Check, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'prompt' | 'simulator' | 'benchmark' | 'guide';
  setActiveTab: (tab: 'prompt' | 'simulator' | 'benchmark' | 'guide') => void;
  onCopyPrompt: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyPrompt,
  copied,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0">
              CM
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white tracking-tight truncate text-base">
                  Cymbal Manufacturing
                </span>
                <span className="text-xs text-cyan-400/90 font-mono hidden sm:inline">
                  LLM Agent Studio
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-2">
                <span>Storage Containers & Custom Machining</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-cyan-400 inline" /> (333) 333-3333
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'prompt'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              System Prompt
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Sandbox
            </button>
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'benchmark'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Constraint Tests
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'guide'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Engineering Guide
            </button>
          </nav>

          {/* Quick Copy CTA */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onCopyPrompt}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
              title="Copy Full Production System Prompt to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Prompt Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy System Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
