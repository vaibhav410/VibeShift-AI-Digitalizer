import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  Zap, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Info,
  Sliders,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GenericItem, BusinessRule, Project } from '../types';

interface WorkflowAgentProps {
  project: Project;
  items: GenericItem[];
  rule: BusinessRule | null;
  onUpdateItems: (newItems: GenericItem[]) => void;
  onUpdateRule: (newRule: BusinessRule | null) => void;
  onSimulateSubmissions: (count: number) => void;
}

export const WorkflowAgent: React.FC<WorkflowAgentProps> = ({
  project,
  items,
  rule,
  onUpdateItems,
  onUpdateRule,
  onSimulateSubmissions,
}) => {
  const [isAutonomousActive, setIsAutonomousActive] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    "🤖 [Agent] Initializing Autonomous Workflow Engine...",
    "🤖 [Agent] Scanning active form layouts & field density...",
    "🤖 [Agent] Loaded context: " + project.context.detectedType,
    "🤖 [Agent] Proactive suggestions generated for optimization."
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Periodic random background agent logging when autonomous mode is active
  useEffect(() => {
    if (!isAutonomousActive) return;

    const backgroundMessages = [
      "🤖 [Agent] Monitoring responsive layout viewport margins...",
      "🤖 [Agent] Checking data validation constraints for all forms...",
      "🤖 [Agent] Auditing Accessibility contrast guidelines (WCAG AA)...",
      "🤖 [Agent] Syncing schema configuration with local storage...",
      "🤖 [Agent] Analyzing user interaction metrics & drop-off thresholds...",
      "🤖 [Agent] Optimizing touch targets for mobile viewport (min 44px)...",
      "🤖 [Agent] Standby mode. Ready for automated commands."
    ];

    const timer = setInterval(() => {
      const randomLog = backgroundMessages[Math.floor(Math.random() * backgroundMessages.length)];
      setLogs(prev => [...prev, randomLog]);
    }, 12000);

    return () => clearInterval(timer);
  }, [isAutonomousActive]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `🤖 [Agent] ${msg}`]);
  };

  // 1. Suggestion: Apply fields dynamically based on context
  const getSuggestions = () => {
    const type = project.context.layoutType;
    if (type === 'form') {
      return [
        {
          id: 'hipaa_consent',
          label: "Inject HIPAA Consent Checkbox",
          desc: "Adds a mandatory legally-compliant HIPAA declaration toggle.",
          action: () => {
            const newItem: GenericItem = {
              id: 'hipaa_' + Math.random().toString(36).substr(2, 5),
              name: "Accept HIPAA Privacy Policy",
              label: "I consent to the Patient Privacy & HIPAA policy",
              value: "false",
              category: "Legal & Consent",
              type: "boolean",
              validationRule: "Mandatory verification check"
            };
            onUpdateItems([...items, newItem]);
            addLog("Injected legal field: 'Accept HIPAA Privacy Policy'");
          }
        },
        {
          id: 'phone_mask',
          label: "Standardize Phone Validation Input",
          desc: "Formats contact values into safe +1 (XXX) XXX-XXXX mask.",
          action: () => {
            const updatedItems = items.map(item => {
              if (item.name.toLowerCase().includes('phone') || item.name.toLowerCase().includes('contact')) {
                return { ...item, validationRule: "Phone Mask (Format: +1 (XXX) XXX-XXXX)" };
              }
              return item;
            });
            onUpdateItems(updatedItems);
            addLog("Standardized input validation rules for phone fields.");
          }
        },
        {
          id: 'copay_rule',
          label: "Set Prioritized High Care Level Alert",
          desc: "Auto-adds high emergency triggers based on allergies.",
          action: () => {
            const newRule: BusinessRule = {
              type: "threshold_action",
              threshold: 1,
              benefitValue: 0,
              originalText: "If severe allergies are disclosed, trigger high-priority patient triage status.",
              actionName: "Trigger Fast-Track Care Alert",
              description: "Triggered on patient allergy disclosures"
            };
            onUpdateRule(newRule);
            addLog("Configured prioritized care alert logic for emergency patient intakes.");
          }
        }
      ];
    } else if (type === 'catalog') {
      return [
        {
          id: 'volume_discount',
          label: "Add Volume Discount Rules",
          desc: "Setup discount triggers for orders exceeding $25.",
          action: () => {
            const newRule: BusinessRule = {
              type: "threshold_discount",
              threshold: 25,
              benefitValue: 15,
              originalText: "Orders over $25 receive a 15% discount instantly."
            };
            onUpdateRule(newRule);
            addLog("Created reactive retail discount rule: 15% discount for orders >= $25.");
          }
        },
        {
          id: 'stock_badge',
          label: "Activate Out-of-Stock Flags",
          desc: "Auto-renders red warn badges when item count drops below 15.",
          action: () => {
            const updatedItems = items.map(item => {
              if (item.type === 'currency' || item.category.toLowerCase().includes('beverages') || item.category.toLowerCase().includes('foods')) {
                return { ...item, stockCount: Math.floor(Math.random() * 12) + 5 }; // Low stock
              }
              return item;
            });
            onUpdateItems(updatedItems);
            addLog("Configured low stock warn indicators for high-demand items.");
          }
        },
        {
          id: 'tax_standard',
          label: "Apply Standard Retail Tax Rule",
          desc: "Binds standard 8.25% state retail tax to active menu.",
          action: () => {
            const updatedItems = items.map(item => {
              if (item.type === 'currency') {
                return { ...item, taxRate: "8.25% (Standard Retail)" };
              }
              return item;
            });
            onUpdateItems(updatedItems);
            addLog("Standardized tax rates at 8.25% on all retail transaction catalog items.");
          }
        }
      ];
    } else {
      // Checklist / Defaults
      return [
        {
          id: 'escalate_alert',
          label: "Config Operational Safety Alerts",
          desc: "Alert managers if more than 2 compliance checkpoints fail.",
          action: () => {
            const newRule: BusinessRule = {
              type: "threshold_action",
              threshold: 2,
              benefitValue: 0,
              originalText: "Failing more than 2 hygiene safety audits triggers manager escalation.",
              actionName: "Escalate Health Audit Error"
            };
            onUpdateRule(newRule);
            addLog("Linked real-time operational failure alerts to supervisor dispatch.");
          }
        },
        {
          id: 'severity_sorting',
          label: "Auto-Classify Items by Severity",
          desc: "Categorizes checklist items dynamically by critical importance levels.",
          action: () => {
            const updatedItems = items.map(item => {
              let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
              if (item.name.toLowerCase().includes('temp') || item.name.toLowerCase().includes('fire') || item.name.toLowerCase().includes('safety')) {
                severity = 'Critical';
              } else if (item.name.toLowerCase().includes('sanitize') || item.name.toLowerCase().includes('finance')) {
                severity = 'High';
              }
              return { ...item, severity };
            });
            onUpdateItems(updatedItems);
            addLog("Sorted operational nodes and assigned high-visibility hazard weights.");
          }
        },
        {
          id: 'photo_remediation',
          label: "Deploy Remediation Upload Forms",
          desc: "Requires image capture verification if checklist items fail.",
          action: () => {
            const updatedItems = items.map(item => {
              if (item.name.toLowerCase().includes('exit') || item.name.toLowerCase().includes('temp')) {
                return { 
                  ...item, 
                  remediationText: "Capture audit snapshot immediately and upload to compliance panel." 
                };
              }
              return item;
            });
            onUpdateItems(updatedItems);
            addLog("Deployed automated photo compliance requirements on critical hazards.");
          }
        }
      ];
    }
  };

  const handleApplySuggestion = (id: string, action: () => void) => {
    if (appliedSuggestions.includes(id)) return;
    action();
    setAppliedSuggestions(prev => [...prev, id]);
  };

  // 2. Automate: Auto-Tune Validations
  const handleAutoTuneValidations = () => {
    addLog("Analyzing form data structures...");
    setTimeout(() => {
      const tunedItems = items.map(item => {
        let rule = item.validationRule || "Standard Check";
        if (item.name.toLowerCase().includes('email')) {
          rule = "Standard Email Format (RFC 5322)";
        } else if (item.name.toLowerCase().includes('phone') || item.name.toLowerCase().includes('contact')) {
          rule = "Phone Mask (+1 (XXX) XXX-XXXX)";
        } else if (item.name.toLowerCase().includes('date') || item.name.toLowerCase().includes('birth')) {
          rule = "Past Date Constraint (MM/DD/YYYY)";
        } else if (item.type === 'number') {
          rule = "Numeric Boundary Range Check";
        } else if (item.type === 'currency') {
          rule = "Decimal Currency Float Validation";
        }
        return { ...item, validationRule: rule };
      });
      onUpdateItems(tunedItems);
      addLog("Successfully parsed and optimized validation rules for " + items.length + " fields!");
    }, 600);
  };

  // 3. Automate: Simulated responses
  const handleSimulateBtn = () => {
    setIsSimulating(true);
    addLog("Starting Automated Flow Simulator...");
    addLog("Generating realistic response telemetry matrices...");
    
    let currentCount = 0;
    const interval = setInterval(() => {
      currentCount++;
      addLog(`Generating submission ${currentCount}/5: Simulating user agent interaction...`);
      if (currentCount >= 5) {
        clearInterval(interval);
        setIsSimulating(false);
        onSimulateSubmissions(5);
        addLog("✅ Simulated submissions completed! 5 real-time responses successfully injected.");
      }
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      {/* State Badge Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bot size={18} className="text-teal-400" />
            Workflow Copilot
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Autonomous Agent Monitor</p>
        </div>
        <button 
          onClick={() => {
            setIsAutonomousActive(prev => !prev);
            addLog(isAutonomousActive ? "Monitoring paused by user." : "Monitoring restarted.");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[9px] font-bold uppercase tracking-widest ${
            isAutonomousActive 
              ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
              : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isAutonomousActive ? 'bg-teal-400 animate-pulse' : 'bg-zinc-600'}`} />
          {isAutonomousActive ? 'Agent Active' : 'Agent Paused'}
        </button>
      </div>

      {/* Autonomous Hacker Console */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider px-1">
          <span className="flex items-center gap-1">
            <Terminal size={12} />
            Background Agent Terminal
          </span>
          <button 
            onClick={() => setLogs(["🤖 [Agent] Terminal logs cleared."])} 
            className="hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="h-40 bg-zinc-950 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1.5 custom-scrollbar shadow-inner relative">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed whitespace-pre-wrap select-text">
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Automated Actions Controls */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Auto-Run Operations</h4>
        <div className="grid grid-cols-1 gap-2">
          {/* Validation Tuning */}
          <button
            onClick={handleAutoTuneValidations}
            className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-teal-500/20 rounded-xl transition-all flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 group-hover:scale-105 transition-transform">
                <Sliders size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Auto-Tune Validation Rules</p>
                <p className="text-[9px] text-zinc-500">Auto-inject complex input constraints on all fields.</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>

          {/* Submission Simulation */}
          <button
            onClick={handleSimulateBtn}
            disabled={isSimulating}
            className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-teal-500/20 rounded-xl transition-all flex items-center justify-between group text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-105 transition-transform">
                {isSimulating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Simulate Live Submissions</p>
                <p className="text-[9px] text-zinc-500">Generate 5 synthetic multi-user entries to populate charts.</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Proactive Suggestions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-1 px-1">
          <Sparkles size={12} className="text-teal-400" />
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Smart Context Recommendations</h4>
        </div>

        <div className="space-y-2">
          {getSuggestions().map((suggestion) => {
            const isApplied = appliedSuggestions.includes(suggestion.id);
            return (
              <div 
                key={suggestion.id}
                className={`p-3 rounded-xl border transition-all text-left relative overflow-hidden flex flex-col justify-between gap-3 ${
                  isApplied 
                    ? 'bg-emerald-500/[0.02] border-emerald-500/20 opacity-80' 
                    : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">{suggestion.label}</span>
                    {isApplied && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={8} /> Applied
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{suggestion.desc}</p>
                </div>
                
                {!isApplied && (
                  <button
                    onClick={() => handleApplySuggestion(suggestion.id, suggestion.action)}
                    className="self-end px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold uppercase tracking-widest text-[9px] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus size={10} />
                    <span>Apply Auto-Fix</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
