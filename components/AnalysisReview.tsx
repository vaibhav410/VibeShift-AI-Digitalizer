
import React, { useEffect, useState } from 'react';
import { GenericItem, BusinessRule, DocumentContext } from '../types';
import { ArrowRight, Sparkles, FileText, Zap, BrainCircuit, ScanLine, Terminal, CheckCircle2, Search, Database, Fingerprint, Lock, Cpu, Server, LayoutTemplate } from 'lucide-react';

interface AnalysisReviewProps {
  extractedItems: GenericItem[];
  context: DocumentContext | null;
  rule: BusinessRule | null;
  onConfirm: () => void;
  onBack: () => void;
}

const AnalysisReview: React.FC<AnalysisReviewProps> = ({ extractedItems, context, rule, onConfirm, onBack }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Realistic Multi-LLM RAG simulation logs
    const logMessages = [
      `[INIT] VibeShift RAG Engine v4.2 initialized.`,
      `[SECURE] Establishing uplink to Vector Knowledge Base (HR, Finance, Legal)...`,
      `[INPUT] Multimodal Tensor Loading...`,
      `[CV] Visual Structure Analysis: 99.9% clarity.`,
      `[DECISION] Autonomous Architect Analyzing Intent...`,
      `[INTENT] Detected Pattern: '${context?.detectedType?.toUpperCase()}'.`,
      `[SELECT] Selecting optimal UX architecture: ${context?.layoutType?.toUpperCase()} MODE.`,
      `[DATA] Extracting ${extractedItems.length} entities specifically for ${context?.layoutType} layout.`,
      `[SYNTHESIS] Generating interactive components...`,
      `[LOGIC] Tokenizing business rules against compliance engine...`,
      `[SUCCESS] System Architecture Locked.`,
      `[READY] Awaiting Deployment.`
    ];

    const timers: any[] = [];
    let delay = 0;
    
    setLogs([]);
    setActiveStage(0);

    logMessages.forEach((msg, index) => {
      // Variable delay for realism
      delay += (index === 0 || index === logMessages.length - 1) ? 500 : 300; 
      
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        
        // Trigger visual stages based on log progress
        if (msg.includes('Autonomous Architect')) setActiveStage(1);
        if (msg.includes('Extracting')) setActiveStage(2);
        if (msg.includes('Tokenizing')) setActiveStage(3);
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [context, extractedItems.length, rule]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse">
           <BrainCircuit size={14} />
           <span>MULTI-LLM RAG ENGINE ACTIVE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
           Reasoning <span className="gradient-text">Revealed</span>
        </h1>
        <p className="text-slate-400 text-lg">VibeShift is cross-referencing your document with industry standards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* LEFT COLUMN: THE THINKING PROCESS (BLACKBOX REVEAL) */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* REASONING 1: AUTONOMOUS DECISION */}
            <div className={`glass-card rounded-2xl p-6 border transition-all duration-700 transform ${activeStage >= 1 ? 'border-emerald-500/50 bg-emerald-900/10 translate-x-0 opacity-100' : 'border-slate-800 -translate-x-4 opacity-50'}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors duration-500 ${activeStage >= 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 text-slate-500'}`}>
                            <LayoutTemplate size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Reasoning 01</h3>
                            <p className="text-xs text-slate-500">Autonomous Architecture Decision</p>
                        </div>
                    </div>
                    {activeStage >= 1 && <CheckCircle2 size={20} className="text-emerald-500 animate-in zoom-in spin-in-90 duration-300" />}
                </div>
                <div className="pl-12">
                    <div className="text-sm text-slate-400 mb-1">Document Pattern Identified:</div>
                    <div className="text-xl font-bold text-white tracking-tight mb-2">{context?.detectedType}</div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Decision Matrix Result</div>
                        <div className="flex items-center gap-2">
                           <span className="text-violet-400 font-mono text-sm">Target Layout:</span>
                           <span className="bg-violet-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                             {context?.layoutType} MODE
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 italic">
                           {context?.layoutType === 'form' && "Intent: Data Collection. Generating inputs."}
                           {context?.layoutType === 'catalog' && "Intent: Commerce. Generating product grid & cart."}
                           {context?.layoutType === 'checklist' && "Intent: Verification. Generating toggles."}
                        </p>
                    </div>
                </div>
            </div>

            {/* REASONING 2: ADAPTIVE FORM SYNTHESIS */}
            <div className={`glass-card rounded-2xl p-6 border transition-all duration-700 transform ${activeStage >= 2 ? 'border-sky-500/50 bg-sky-900/10 translate-x-0 opacity-100' : 'border-slate-800 -translate-x-4 opacity-50'}`}>
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors duration-500 ${activeStage >= 2 ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-slate-800 text-slate-500'}`}>
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Reasoning 02</h3>
                            <p className="text-xs text-slate-500">Component Synthesis Logic</p>
                        </div>
                    </div>
                    {activeStage >= 2 && <CheckCircle2 size={20} className="text-sky-500 animate-in zoom-in spin-in-90 duration-300" />}
                </div>
                <div className="pl-12">
                     <p className="text-sm text-slate-400 mb-2">Architecting <span className="text-sky-400 font-bold">{context?.layoutType === 'catalog' ? 'Product Cards' : 'Input Fields'}</span> for {extractedItems.length} verified data points.</p>
                     <div className="flex flex-wrap gap-2">
                        {extractedItems.slice(0, 4).map((item, i) => (
                             <span key={i} className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono font-medium flex items-center gap-1">
                                {item.type === 'currency' ? '💲' : item.type === 'number' ? '#' : 'Aa'} {item.name}
                             </span>
                        ))}
                        {extractedItems.length > 4 && <span className="px-2 py-1 text-xs text-slate-500">+{extractedItems.length - 4} more</span>}
                     </div>
                </div>
            </div>

            {/* REASONING 3: BUSINESS LOGIC */}
            <div className={`glass-card rounded-2xl p-6 border transition-all duration-700 transform ${activeStage >= 3 ? 'border-fuchsia-500/50 bg-fuchsia-900/10 translate-x-0 opacity-100' : 'border-slate-800 -translate-x-4 opacity-50'}`}>
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors duration-500 ${activeStage >= 3 ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]' : 'bg-slate-800 text-slate-500'}`}>
                            <Zap size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Reasoning 03</h3>
                            <p className="text-xs text-slate-500">Business Logic & RAG Validation</p>
                        </div>
                    </div>
                    {activeStage >= 3 && <CheckCircle2 size={20} className="text-fuchsia-500 animate-in zoom-in spin-in-90 duration-300" />}
                </div>
                <div className="pl-12">
                    {rule ? (
                         <div className="flex flex-col space-y-3">
                             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-sm text-slate-200 italic font-mono relative">
                                <span className="absolute -top-2 -left-2 bg-slate-800 text-[10px] px-1 rounded text-slate-500">RULE INPUT</span>
                                "{rule.originalText}"
                             </div>
                             <div className="flex items-center space-x-2 text-fuchsia-400 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 size={12} />
                                <span>Logic Type: {rule.type === 'threshold_action' ? 'COMPLIANCE TRIGGER' : 'AUTOMATED CALCULATION'}</span>
                             </div>
                         </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic">No custom rules. Applying standard industry validation protocols.</div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL & ACTIONS */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* VIBESHIFT VERIFICATION LOG */}
            <div className="glass-card rounded-2xl border border-slate-800 bg-[#050505] overflow-hidden shadow-2xl relative flex-1 min-h-[400px]">
                <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Terminal size={14} className="text-emerald-500" />
                        <span className="text-xs font-mono text-slate-400 font-bold">VibeShift Verification Log</span>
                    </div>
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                    </div>
                </div>
                <div className="p-4 font-mono text-xs md:text-sm h-full overflow-y-auto custom-scrollbar flex flex-col space-y-3 pb-12">
                    {logs.map((log, i) => {
                        const isSuccess = log.includes('[SUCCESS]') || log.includes('[READY]');
                        const isDecision = log.includes('[DECISION]') || log.includes('[SELECT]') || log.includes('[INTENT]');
                        const isLogic = log.includes('[LOGIC]') || log.includes('[SYNTHESIS]');

                        return (
                            <div key={i} className="flex items-start space-x-3 animate-in slide-in-from-left-2 duration-300">
                                <span className={`flex-shrink-0 mt-0.5 font-bold ${isSuccess ? 'text-emerald-500' : isDecision ? 'text-blue-400' : isLogic ? 'text-fuchsia-400' : 'text-slate-600'}`}>
                                    {isSuccess ? '✓' : isDecision ? '⚡' : isLogic ? '⚙' : '»'}
                                </span>
                                <span className={`${isSuccess ? 'text-emerald-400' : isDecision ? 'text-blue-300' : isLogic ? 'text-fuchsia-300' : 'text-slate-400'}`}>
                                    {log}
                                </span>
                            </div>
                        );
                    })}
                    <div className="animate-pulse text-emerald-500 font-bold">_</div>
                </div>
                {/* Visual Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-30 animate-scan pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col space-y-3 pt-2">
                <button 
                    onClick={onConfirm}
                    disabled={activeStage < 3}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-50 disabled:grayscale transition-all font-bold shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] flex items-center justify-center space-x-3 transform hover:-translate-y-1 active:scale-95 border border-violet-400/20 group"
                >
                    <Fingerprint size={20} className={activeStage < 3 ? 'animate-pulse' : ''} />
                    <span>{activeStage < 3 ? 'Optimizing UX...' : `Launch ${context?.layoutType === 'catalog' ? 'E-Commerce' : context?.layoutType === 'checklist' ? 'Tracking' : 'Data Entry'} App`}</span>
                    {activeStage >= 3 && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                 <button 
                    onClick={onBack}
                    className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm"
                >
                    Modify Inputs
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReview;
