import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptViewer } from './components/PromptViewer';
import { LiveSimulator } from './components/LiveSimulator';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { PromptEngineeringGuide } from './components/PromptEngineeringGuide';
import { defaultPromptConfig, PromptConfig, buildSystemPrompt } from './data/promptTemplate';
import { Check, Copy, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'simulator' | 'benchmark' | 'guide'>('prompt');
  const [config, setConfig] = useState<PromptConfig>(defaultPromptConfig);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToastMessage('System prompt copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyDefaultPrompt = () => {
    const promptText = buildSystemPrompt(config, 'markdown');
    handleCopy(promptText);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyPrompt={handleCopyDefaultPrompt}
        copied={copied}
      />

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'prompt' && (
          <PromptViewer
            config={config}
            setConfig={setConfig}
            onCopy={handleCopy}
            copied={copied}
          />
        )}

        {activeTab === 'simulator' && (
          <LiveSimulator config={config} />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkRunner config={config} />
        )}

        {activeTab === 'guide' && (
          <PromptEngineeringGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Cymbal Manufacturing AI System Prompt Workbench</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Customer Line: <strong className="text-slate-300 font-mono">(333) 333-3333</strong></span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Designed for Google Gemini & Vertex AI Virtual Agents
          </div>
        </div>
      </footer>
    </div>
  );
}
