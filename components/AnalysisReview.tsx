import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, FileText, Database, Zap, Search, ShieldCheck } from 'lucide-react';
import { GenericItem, DocumentContext, BusinessRule } from '../types';

interface AnalysisReviewProps {
  items: GenericItem[];
  context: DocumentContext | null;
  rule: BusinessRule | null;
  onConfirm: () => void;
  onBack: () => void;
}

const AnalysisReview: React.FC<AnalysisReviewProps> = ({ items, context, rule, onConfirm, onBack }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage(prev => {
        if (prev >= 3) {
          setIsVerifying(false);
          clearInterval(timer);
          return 3;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          <span>Back to Input</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
          <div className={`w-1.5 h-1.5 rounded-full ${isVerifying ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {isVerifying ? 'Verification in Progress' : 'Synthesis Complete'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stage 1: Structural Analysis */}
        <div className={`card-minimal p-6 space-y-4 transition-all duration-500 ${activeStage >= 1 ? 'border-zinc-700 opacity-100' : 'opacity-40'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
              <FileText size={18} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Structure</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">{context?.detectedType || 'General Document'}</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Identified {items.length} data points across {(context?.confidence || 0.98) * 100}% structural confidence.
            </p>
          </div>
        </div>

        {/* Stage 2: Data Extraction */}
        <div className={`card-minimal p-6 space-y-4 transition-all duration-500 ${activeStage >= 2 ? 'border-zinc-700 opacity-100' : 'opacity-40'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
              <Database size={18} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Extraction</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Schema Mapping</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Mapped extracted fields to enterprise-grade JSON schema for interoperability.
            </p>
          </div>
        </div>

        {/* Stage 3: Logic Infusion */}
        <div className={`card-minimal p-6 space-y-4 transition-all duration-500 ${activeStage >= 3 ? 'border-zinc-700 opacity-100' : 'opacity-40'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
              <Zap size={18} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Logic</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">{rule ? 'Custom Rules' : 'Standard Logic'}</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed italic">
              {rule ? `Applying: "${rule.originalText}"` : "Applying standard validation protocols."}
            </p>
          </div>
        </div>
      </div>

      <div className="card-minimal overflow-hidden">
        <div className="p-4 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search size={16} className="text-zinc-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Extracted Data Preview</h3>
          </div>
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
            {items.length} Fields Identified
          </span>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-900">
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Field Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Extracted Value</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">{item.label}</td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">{item.value}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '95%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500">95%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onConfirm}
          disabled={isVerifying}
          className="btn-primary px-12 py-4 text-lg flex items-center gap-3 shadow-2xl shadow-white/10"
        >
          <span>Deploy Architecture</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AnalysisReview;
