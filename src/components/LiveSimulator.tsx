import React, { useState, useRef, useEffect } from 'react';
import { PromptConfig, buildSystemPrompt } from '../data/promptTemplate';
import { 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  Palette, 
  HelpCircle, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  timestamp: string;
}

interface LiveSimulatorProps {
  config: PromptConfig;
}

const QUICK_PROMPTS = [
  {
    label: 'Container Colors Inquiry',
    text: 'What color options do your storage containers come in? Can I order them in yellow?',
    icon: Palette,
  },
  {
    label: 'Custom Machining Request',
    text: 'We need 40 custom stainless steel mounting plates machined to 0.05mm tolerance. Can you take our order?',
    icon: Phone,
  },
  {
    label: 'Anti-Guessing / Unknown Specs',
    text: 'What is the exact fracture shear point of container lot #902 produced last Thursday?',
    icon: HelpCircle,
  },
  {
    label: 'Hybrid Container & Machining',
    text: 'We want to buy 12 storage containers, but we also need custom drilled holes and machined hinges on all of them.',
    icon: Sparkles,
  },
  {
    label: 'General Container Question',
    text: 'Are Cymbal storage containers weather-resistant and stackable for warehouse storage?',
    icon: Bot,
  },
];

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ config }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello and thank you for contacting Cymbal Manufacturing! We build durable, high-quality storage containers primarily, typically available in blue or green, and occasionally in red. We are also pleased to offer custom machining upon request. How may I respectfully assist you today?`,
      source: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.2);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemPrompt = buildSystemPrompt(config, 'markdown');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || 'I apologize, but I could not process your request at this time.',
        source: data.source || 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Client-side fallback if network or server error
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `Thank you for contacting Cymbal Manufacturing. While our primary focus is building quality storage containers, we do offer custom machining upon request. For all custom machining inquiries, technical specifications, and project assessments, please call our team directly at (333) 333-3333. A member of our team will be glad to assist you.`,
        source: 'fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello and thank you for contacting Cymbal Manufacturing! We build durable, high-quality storage containers primarily, typically available in blue or green, and occasionally in red. We are also pleased to offer custom machining upon request. How may I respectfully assist you today?`,
        source: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Inspect last assistant response for rule compliance
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const analyzeResponse = (text: string) => {
    const lower = text.toLowerCase();
    const hasPhone = lower.includes('(333) 333-3333') || lower.includes('333-3333');
    const hasBlueGreen = lower.includes('blue') && lower.includes('green');
    const hasOccasionalRed = lower.includes('red');
    const admitsUncertainty = lower.includes("don't know") || lower.includes('do not know') || lower.includes('do not have') || lower.includes('uncertain');
    const hasCourtesy = lower.includes('thank you') || lower.includes('respectful') || lower.includes('pleased') || lower.includes('glad');

    return { hasPhone, hasBlueGreen, hasOccasionalRed, admitsUncertainty, hasCourtesy };
  };

  const analysis = lastAssistantMessage ? analyzeResponse(lastAssistantMessage.content) : null;

  return (
    <div className="space-y-6">
      {/* Sandbox Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            Live Agent Interactive Sandbox
          </h1>
          <p className="text-xs text-slate-400">
            Chat directly with the virtual agent running your Cymbal Manufacturing system prompt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Temp:</span>
            <span className="font-mono text-cyan-400">{temperature}</span>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-16 accent-cyan-500 cursor-pointer"
              title="LLM Temperature (Low recommended for deterministic rule following)"
            />
          </div>

          <button
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {showPromptPreview ? 'Hide Injected Prompt' : 'View Injected Prompt'}
          </button>

          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Collapsible Active Prompt Inspection */}
      {showPromptPreview && (
        <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-4 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1">
          <div className="text-cyan-400 font-bold mb-2 flex items-center justify-between">
            <span>INJECTED SYSTEM INSTRUCTION</span>
            <span className="text-[10px] text-slate-500">{systemPrompt.length} chars</span>
          </div>
          <div className="whitespace-pre-wrap">{systemPrompt}</div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[560px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  <div
                    className={`mt-2 pt-1.5 border-t text-[11px] flex items-center justify-between gap-3 ${
                      isUser
                        ? 'border-cyan-500/30 text-cyan-100'
                        : 'border-slate-900 text-slate-500'
                    }`}
                  >
                    <span>{isUser ? 'You' : 'Cymbal Virtual Agent'}</span>
                    <div className="flex items-center gap-1.5">
                      {msg.source && (
                        <span className="font-mono text-[10px]">
                          {msg.source}
                        </span>
                      )}
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs pl-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Cymbal Agent is synthesizing response according to prompt rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Verification Badges for Latest Output */}
        {analysis && (
          <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="text-slate-500 font-medium">Rule Compliance Verification:</span>
            {analysis.hasPhone && (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Directed to (333) 333-3333
              </span>
            )}
            {analysis.hasBlueGreen && (
              <span className="flex items-center gap-1 text-cyan-400">
                <CheckCircle2 className="w-3 h-3" /> Color rule (Blue/Green standard)
              </span>
            )}
            {analysis.hasOccasionalRed && (
              <span className="flex items-center gap-1 text-rose-400">
                <CheckCircle2 className="w-3 h-3" /> Red (Occasional run acknowledged)
              </span>
            )}
            {analysis.admitsUncertainty && (
              <span className="flex items-center gap-1 text-amber-400">
                <CheckCircle2 className="w-3 h-3" /> Admitted uncertainty without guessing
              </span>
            )}
            {analysis.hasCourtesy && (
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3 h-3" /> Respectful tone verified
              </span>
            )}
          </div>
        )}

        {/* Quick Starter Chips */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 py-2 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          <span className="text-slate-500 whitespace-nowrap text-[11px]">Quick Tests:</span>
          {QUICK_PROMPTS.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.text)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Ask about storage containers, custom machining, colors, or specifications..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
