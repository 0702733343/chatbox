import React from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Palette, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  BookOpen 
} from 'lucide-react';

export const PromptEngineeringGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h1 className="text-base font-semibold text-white tracking-tight">
            Prompt Engineering Architectural Rationale & Deployment Guide
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Detailed technical documentation on how each requirement from Cymbal Manufacturing is operationalized into prompt structure, negative constraints, probabilistic calibrations, and few-shot exemplars to achieve maximum LLM adherence.
        </p>
      </div>

      {/* Core Architectural Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Custom Machining Escalation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Phone className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-white">1. Custom Machining Hard Escalation</h2>
          </div>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-300">The Problem:</strong> Modern LLMs exhibit an innate helpfulness bias (sycophancy). When a user presents engineering specs or asks "Can you machine 100 titanium brackets for me?", unconstrained models will attempt to take requirements, calculate tolerances, or fabricate pricing.
            </p>
            <p>
              <strong className="text-slate-300">The Engineering Solution:</strong> We implement a dual-layer protocol:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-mono text-[11px]">
              <li>Acknowledge capability: Cymbal does custom machining by request.</li>
              <li>Firm negative constraint: Do NOT take specs or quote in chat.</li>
              <li>Hard boundary: Direct user exclusively to call <span className="text-amber-400 font-semibold">(333) 333-3333</span>.</li>
            </ul>
          </div>
        </div>

        {/* Pillar 2: Color Nuance Calibration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Palette className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-white">2. Probabilistic Color Distribution</h2>
          </div>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-300">The Problem:</strong> The brief states: <em>"Our containers are typically blue or green, but they can occasionally be red."</em> If phrased as simple list enumeration ("available in blue, green, and red"), the agent treats red as equally available as standard colors, risking dissatisfied customers when red is out of stock.
            </p>
            <p>
              <strong className="text-slate-300">The Engineering Solution:</strong> We explicitly encode modal adverbs:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-mono text-[11px]">
              <li>Standard/typical baseline: <span className="text-cyan-400">Blue</span> and <span className="text-emerald-400">Green</span>.</li>
              <li>Occasional qualification: <span className="text-rose-400">Red</span> (subject to production batches).</li>
              <li>Out-of-palette guardrail: For unlisted colors, state standards and invite a phone call.</li>
            </ul>
          </div>
        </div>

        {/* Pillar 3: Uncertainty & Anti-Guessing Gate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <HelpCircle className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-white">3. Calibrated Uncertainty & Anti-Guessing</h2>
          </div>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-300">The Problem:</strong> Users frequently probe manufacturing bots with obscure technical questions (tensile limits, specific lot ratings, internal cost structures). LLMs are prone to hallucinating believable numbers.
            </p>
            <p>
              <strong className="text-slate-300">The Engineering Solution:</strong> The prompt explicitly commands:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-mono text-[11px]">
              <li>"Do not take too many guesses."</li>
              <li>Mandatory admission: "Must always admit when you don’t know."</li>
              <li>Graceful escalation to (333) 333-3333 for verified factory testing data.</li>
            </ul>
          </div>
        </div>

        {/* Pillar 4: Respectful Tone & Demeanor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-white">4. Respectful Demeanor Under Friction</h2>
          </div>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-300">The Problem:</strong> When customers are terse, aggressive, or frustrated, poorly prompted agents can become terse, defensively bureaucratic, or dismissive.
            </p>
            <p>
              <strong className="text-slate-300">The Engineering Solution:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-mono text-[11px]">
              <li>Instructs unconditional courtesy and humility.</li>
              <li>Preserves manufacturing pride without arrogance.</li>
              <li>Includes an in-context few-shot example demonstrating calm de-escalation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Production Deployment Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">Production Deployment Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
            <div className="font-semibold text-cyan-300">1. Google GenAI / Gemini API</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pass the prompt via the dedicated <code className="text-cyan-400">systemInstruction</code> configuration parameter. Set <code className="text-cyan-400">temperature: 0.2</code> to maximize deterministic adherence to constraints and minimize speculative variance.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
            <div className="font-semibold text-emerald-300">2. Vertex AI Agent Builder</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Import the XML-tagged format directly into the Agent Instruction field. Grounding datastores can be attached for standard container catalog specs, while custom machining remains strictly routed to the phone tool.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
            <div className="font-semibold text-amber-300">3. Dialogflow CX / Live Chat</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Use this system prompt as the Generative Fallback / Agent Assist prompt for customer support chats, ensuring phone routing to <span className="font-mono text-amber-400">(333) 333-3333</span> triggers automatically upon machining intent detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
