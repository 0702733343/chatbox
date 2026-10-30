import React, { useState } from 'react';
import { PromptConfig, buildSystemPrompt } from '../data/promptTemplate';
import { TestCase, benchmarkTests } from '../data/benchmarkTests';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  Plus, 
  Check, 
  HelpCircle, 
  Phone, 
  Palette, 
  HeartHandshake 
} from 'lucide-react';

interface BenchmarkRunnerProps {
  config: PromptConfig;
}

interface TestResult {
  testId: string;
  response: string;
  source: string;
  passed: boolean;
  score: number;
  checks: Array<{ name: string; passed: boolean; reason: string }>;
}

export const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({ config }) => {
  const [tests, setTests] = useState<TestCase[]>(benchmarkTests);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New test modal state
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState<'custom_machining' | 'colors' | 'uncertainty' | 'scope' | 'tone'>('custom_machining');
  const [newTestInput, setNewTestInput] = useState('');
  const [newTestExpected, setNewTestExpected] = useState('');

  const systemPrompt = buildSystemPrompt(config, 'markdown');

  const runSingleTest = async (testCase: TestCase) => {
    setRunningTestId(testCase.id);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCase,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation failed with status ${response.status}`);
      }

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        [testCase.id]: {
          testId: testCase.id,
          response: data.response,
          source: data.source,
          passed: data.evaluation?.passed ?? true,
          score: data.evaluation?.score ?? 100,
          checks: data.evaluation?.checks ?? [],
        },
      }));
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      setRunningTestId(null);
    }
  };

  const runAllTests = async () => {
    setIsBatchRunning(true);
    for (const test of tests) {
      await runSingleTest(test);
    }
    setIsBatchRunning(false);
  };

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestInput.trim()) return;

    const newTest: TestCase = {
      id: `custom_${Date.now()}`,
      name: newTestName.trim(),
      category: newTestCategory,
      input: newTestInput.trim(),
      expectedBehavior: newTestExpected.trim() || 'Evaluates prompt adherence according to Cymbal guidelines.',
      keyRequirements: ['Compliance with Cymbal Manufacturing virtual agent policies'],
    };

    setTests((prev) => [...prev, newTest]);
    setNewTestName('');
    setNewTestInput('');
    setNewTestExpected('');
    setShowAddModal(false);
  };

  // Metrics
  const totalCompleted = Object.keys(results).length;
  const totalPassed = Object.values(results).filter((r) => r.passed).length;
  const passRate = totalCompleted > 0 ? Math.round((totalPassed / totalCompleted) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Scoreboard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Constraint & Compliance Test Suite
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Verifies the LLM's adherence to all five user specifications: custom machining escalation to (333) 333-3333, color accuracy (blue/green standard, red occasional), zero-hallucination uncertainty handling, respectful tone, and manufacturing scope.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Test</span>
            </button>
            <button
              onClick={runAllTests}
              disabled={isBatchRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {isBatchRunning ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Tests...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run All {tests.length} Tests</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Scorecard Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-500 mr-2">Tests Evaluated:</span>
            <span className="font-mono font-semibold text-slate-200">
              {totalCompleted} / {tests.length}
            </span>
          </div>
          <div>
            <span className="text-slate-500 mr-2">Passing Tests:</span>
            <span className="font-mono font-semibold text-emerald-400">{totalPassed}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-2">Compliance Score:</span>
            <span className="font-mono font-semibold text-cyan-400">{passRate}%</span>
          </div>
          {totalCompleted === tests.length && totalPassed === tests.length && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>100% Constraints Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-4">
        {tests.map((test) => {
          const res = results[test.id];
          const isRunning = runningTestId === test.id;

          const getCategoryBadge = () => {
            switch (test.category) {
              case 'custom_machining':
                return { label: 'Custom Machining Escalation', icon: Phone, color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
              case 'colors':
                return { label: 'Container Colors Rule', icon: Palette, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
              case 'uncertainty':
                return { label: 'Anti-Hallucination & Uncertainty', icon: AlertTriangle, color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
              case 'tone':
                return { label: 'Respectful Tone Calibration', icon: HeartHandshake, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
              default:
                return { label: 'Manufacturing Scope', icon: HelpCircle, color: 'text-slate-400 bg-slate-900 border-slate-700' };
            }
          };

          const badge = getCategoryBadge();
          const Icon = badge.icon;

          return (
            <div
              key={test.id}
              className={`bg-slate-900 border rounded-xl p-5 transition-all shadow-sm ${
                res
                  ? res.passed
                    ? 'border-emerald-900/60 bg-slate-900/90'
                    : 'border-rose-900/60 bg-slate-900/90'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[11px] px-2 py-0.5 rounded border flex items-center gap-1 ${badge.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <h2 className="text-sm font-semibold text-white tracking-tight">{test.name}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {res && (
                    <div className="flex items-center gap-1.5">
                      {res.passed ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Passed ({res.score}%)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-rose-400">
                          <XCircle className="w-4 h-4" /> Needs Review ({res.score}%)
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => runSingleTest(test)}
                    disabled={isRunning || isBatchRunning}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isRunning ? (
                      <>
                        <RotateCw className="w-3 h-3 animate-spin text-cyan-400" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Test Input & Expected Spec */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <div className="text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Simulated Customer Prompt:</span>
                    <span className="font-mono text-[10px] text-slate-500">Test Input</span>
                  </div>
                  <div className="text-slate-200 font-mono text-xs">"{test.input}"</div>
                </div>

                <div className="text-slate-400 text-xs leading-relaxed pt-1">
                  <span className="text-slate-300 font-medium">Expected Guardrail Behavior:</span>{' '}
                  {test.expectedBehavior}
                </div>
              </div>

              {/* Test Result Execution Details */}
              {res && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <div>
                    <div className="text-slate-400 text-xs font-medium mb-1.5 flex items-center justify-between">
                      <span>Agent Generated Response:</span>
                      <span className="text-[10px] font-mono text-cyan-400">{res.source}</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {res.response}
                    </div>
                  </div>

                  {/* Assertion Breakdown Checklist */}
                  {res.checks && res.checks.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Rule Compliance Checklist:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {res.checks.map((c, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded border flex items-start gap-2 ${
                              c.passed
                                ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
                                : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                            }`}
                          >
                            {c.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-[11px]">{c.name}</div>
                              <div className="text-[10px] opacity-80">{c.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <h2 className="text-base font-semibold text-white mb-3">Add Custom Validation Test</h2>
            <form onSubmit={handleAddCustomTest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Extreme Machining Pressure Test"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Constraint Category</label>
                <select
                  value={newTestCategory}
                  onChange={(e: any) => setNewTestCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="custom_machining">Custom Machining Escalation</option>
                  <option value="colors">Container Colors Rule</option>
                  <option value="uncertainty">Anti-Hallucination & Uncertainty</option>
                  <option value="tone">Respectful Tone Calibration</option>
                  <option value="scope">Manufacturing Scope</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Simulated Customer Input</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Can you machine 100 titanium gears for me right now?"
                  value={newTestInput}
                  onChange={(e) => setNewTestInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Expected Guardrail Behavior</label>
                <input
                  type="text"
                  placeholder="e.g. Must state to call (333) 333-3333"
                  value={newTestExpected}
                  onChange={(e) => setNewTestExpected(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 text-xs font-medium"
                >
                  Add Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
