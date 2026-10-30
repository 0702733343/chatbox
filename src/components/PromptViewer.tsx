import React, { useState } from 'react';
import { 
  PromptConfig, 
  PromptSection, 
  buildSystemPrompt, 
  promptSections, 
  getCodeSnippets 
} from '../data/promptTemplate';
import { 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  Layers, 
  Code, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

interface PromptViewerProps {
  config: PromptConfig;
  setConfig: React.Dispatch<React.SetStateAction<PromptConfig>>;
  onCopy: (text: string) => void;
  copied: boolean;
}

export const PromptViewer: React.FC<PromptViewerProps> = ({
  config,
  setConfig,
  onCopy,
  copied,
}) => {
  const [format, setFormat] = useState<'markdown' | 'xml' | 'ts' | 'python' | 'vertex'>('markdown');
  const [selectedSection, setSelectedSection] = useState<string | null>('machining');
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  const activePrompt = buildSystemPrompt(config, format === 'xml' ? 'xml' : 'markdown');
  const tokenEstimate = Math.round(activePrompt.length / 3.8);
  const codeSnippets = getCodeSnippets(activePrompt);

  const getDisplayContent = () => {
    switch (format) {
      case 'markdown':
        return activePrompt;
      case 'xml':
        return activePrompt;
      case 'ts':
        return codeSnippets.geminiNode;
      case 'python':
        return codeSnippets.geminiPython;
      case 'vertex':
        return JSON.stringify(codeSnippets.vertexConfig, null, 2);
    }
  };

  const downloadPrompt = () => {
    const ext = format === 'ts' ? 'ts' : format === 'python' ? 'py' : format === 'vertex' ? 'json' : format === 'xml' ? 'xml' : 'md';
    const blob = new Blob([getDisplayContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cymbal-manufacturing-system-prompt.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConfig = () => {
    setConfig({
      companyName: 'Cymbal Manufacturing',
      phoneNumber: '(333) 333-3333',
      primaryProduct: 'storage containers',
      secondaryCapability: 'custom machining based on request',
      typicalColors: ['blue', 'green'],
      occasionalColors: ['red'],
      toneStrictness: 'high_respect',
      antiGuessingLevel: 'strict',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Cymbal Manufacturing Virtual Agent System Prompt
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                v2.4 Production Spec
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Engineered specifically for storage container manufacturing with strict custom machining phone escalation to <strong className="text-slate-200">(333) 333-3333</strong>, verified blue/green/occasional-red color logic, respectful tone calibration, and zero-hallucination uncertainty handling.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showConfigDrawer
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showConfigDrawer ? 'Hide Parameter Tuner' : 'Tune Parameters'}</span>
            </button>
            <button
              onClick={downloadPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => onCopy(getDisplayContent())}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div>
            <span className="text-slate-500 mr-1.5">Estimated Tokens:</span>
            <span className="font-mono font-semibold text-slate-200">~{tokenEstimate} tokens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Target Model:</span>
            <span className="font-mono text-cyan-400 font-medium">gemini-3.8-flash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Recommended Temperature:</span>
            <span className="font-mono text-slate-300">0.2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Phone Rule:</span>
            <span className="font-mono text-emerald-400">{config.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Parameter Configuration Drawer (Collapsible) */}
      {showConfigDrawer && (
        <div className="bg-slate-900 border border-cyan-900/50 rounded-xl p-5 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Dynamic Prompt Variable Tuner</h2>
            </div>
            <button
              onClick={handleResetConfig}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Direct Phone Number</label>
              <input
                type="text"
                value={config.phoneNumber}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Product</label>
              <input
                type="text"
                value={config.primaryProduct}
                onChange={(e) => setConfig({ ...config, primaryProduct: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Secondary Capability</label>
              <input
                type="text"
                value={config.secondaryCapability}
                onChange={(e) => setConfig({ ...config, secondaryCapability: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Standard / Typical Colors</label>
              <input
                type="text"
                value={config.typicalColors.join(', ')}
                onChange={(e) => setConfig({ ...config, typicalColors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[11px] text-slate-500">Comma separated (e.g. blue, green)</span>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Occasional Colors</label>
              <input
                type="text"
                value={config.occasionalColors.join(', ')}
                onChange={(e) => setConfig({ ...config, occasionalColors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[11px] text-slate-500">Comma separated (e.g. red)</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workbench: Architecture Sections (Left) & Code Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modular Section Explorer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Prompt Architecture Modules
            </h2>
            <span className="text-xs text-slate-500">{promptSections.length} sections</span>
          </div>

          <div className="space-y-2.5">
            {promptSections.map((sec) => {
              const isSelected = selectedSection === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-200">
                      {sec.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {sec.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {sec.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Section Rationale Deep Dive */}
          {selectedSection && (
            <div className="bg-slate-900 border border-cyan-900/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prompt Engineering Rationale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {promptSections.find((s) => s.id === selectedSection)?.rationale}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Code & Prompt Preview Box (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Format Switcher Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2 rounded-t-xl border border-slate-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFormat('markdown')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  format === 'markdown'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Markdown (Standard)
              </button>
              <button
                onClick={() => setFormat('xml')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  format === 'xml'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                XML Tags (Anthropic/Gemini)
              </button>
              <button
                onClick={() => setFormat('ts')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  format === 'ts'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Node.js SDK
              </button>
              <button
                onClick={() => setFormat('python')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  format === 'python'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setFormat('vertex')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  format === 'vertex'
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vertex AI JSON
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCopy(getDisplayContent())}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Copy current view"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Content Terminal Container */}
          <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-b-xl overflow-hidden shadow-inner flex flex-col">
            <div className="overflow-y-auto max-h-[620px] p-5 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap selection:bg-cyan-500/30">
              {getDisplayContent()}
            </div>
          </div>

          {/* Prompt Guardrails Summary Footer */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Phone Escalation Guardrail
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Blue/Green/Red Color Nuance
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Anti-Guessing Uncertainty Gate
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              Ready for immediate production deployment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
