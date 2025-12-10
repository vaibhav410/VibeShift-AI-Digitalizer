
import React, { useState, useMemo, useEffect } from 'react';
import { GenericItem, BusinessRule, DocumentContext } from '../types';
import { Check, ArrowLeft, ArrowRight, Layers, Smartphone, FileCheck, Circle, Save, CreditCard, Calendar, Type as TypeIcon, Hash, AlertTriangle, ShieldCheck, Database, Server, Wifi, ShoppingCart, Plus, Minus, ListTodo, ClipboardCheck, ScanLine, Share2, Code2, Download, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GeneratedFormProps {
  items: GenericItem[];
  context: DocumentContext | null;
  rule: BusinessRule | null;
  onReset: () => void;
}

const GeneratedForm: React.FC<GeneratedFormProps> = ({ items, context, rule, onReset }) => {
  // STATE FOR FORM MODE
  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  
  // STATE FOR CATALOG MODE
  const [cart, setCart] = useState<Record<string, number>>({}); // Item ID -> Quantity

  // STATE FOR CHECKLIST MODE
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [showCode, setShowCode] = useState(false); // New: Toggle source code view

  // Get the current URL for the QR code so mobile devices open this exact app
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://vibeshift.ai';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentAppUrl)}&margin=10&bgcolor=ffffff&color=000000`;

  const layout = context?.layoutType || 'form';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setIsLocalhost(true);
    }
  }, []);

  useMemo(() => {
    // Initialize Form Values
    const initial: Record<string, string | number> = {};
    items.forEach(item => {
      initial[item.id] = item.value || "";
    });
    setFormValues(initial);
  }, [items]);

  const groupedItems = useMemo(() => {
    const cats: Record<string, GenericItem[]> = {};
    items.forEach(item => {
      const c = item.category || 'General';
      if (!cats[c]) cats[c] = [];
      cats[c].push(item);
    });
    return cats;
  }, [items]);

  // --- LOGIC CALCULATIONS ---

  // FORM TOTAL
  const formTotal = Object.entries(formValues).reduce((acc, [key, val]) => {
     const num = parseFloat(val as string);
     return !isNaN(num) ? acc + num : acc;
  }, 0);

  // CART TOTAL
  const cartTotal = items.reduce((acc, item) => {
    const qty = cart[item.id] || 0;
    const price = parseFloat(item.value as string) || 0;
    return acc + (qty * price);
  }, 0);

  // CHECKLIST PROGRESS
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  
  // SHARED PROGRESS METRIC
  let progressPercent = 0;
  let metricValue = 0;
  let metricLabel = "";

  if (layout === 'form') {
    const filledCount = Object.values(formValues).filter(v => v !== "" && v !== 0).length;
    progressPercent = Math.min(100, Math.round((filledCount / items.length) * 100));
    metricValue = filledCount;
    metricLabel = "Fields Filled";
  } else if (layout === 'catalog') {
    const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
    progressPercent = totalItems > 0 ? 100 : 0; // Simple binary progress for catalog
    metricValue = cartTotal;
    metricLabel = "Cart Value";
  } else if (layout === 'checklist') {
    progressPercent = Math.min(100, Math.round((checkedCount / items.length) * 100));
    metricValue = checkedCount;
    metricLabel = "Tasks Done";
  }

  // BUSINESS RULE LOGIC
  let ruleTriggered = false;
  let ruleMessage = "";
  const trackedValue = layout === 'catalog' ? cartTotal : formTotal;

  if (rule) {
     if (trackedValue >= rule.threshold) {
         ruleTriggered = true;
         ruleMessage = rule.actionName || "Approval Required";
         if (rule.type === 'threshold_discount') {
             ruleMessage = `Benefit Applied: ${rule.benefitValue}%`;
         }
     } else {
         ruleMessage = `Value: ${trackedValue} / Threshold: ${rule.threshold}`;
     }
  }

  // --- HANDLERS ---

  const handleFormChange = (id: string, value: string | number) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Trigger Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a78bfa', '#38bdf8', '#34d399']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a78bfa', '#38bdf8', '#34d399']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // --- SOURCE CODE GENERATION ---
  const generatedSourceCode = `import React, { useState } from 'react';

// Generated by VibeShift AI
// App: ${context?.appTitle}
// Layout: ${layout.toUpperCase()}

export default function ${context?.appTitle.replace(/[^a-zA-Z]/g, '')}App() {
  ${layout === 'form' ? `const [formData, setFormData] = useState({});` : ''}
  ${layout === 'catalog' ? `const [cart, setCart] = useState({});` : ''}
  ${layout === 'checklist' ? `const [checked, setChecked] = useState({});` : ''}

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${context?.appTitle}</h1>
      
      <div className="grid gap-6">
        {/* Generated Components */}
${items.map(item => `        <div className="form-group">
          <label>${item.name}</label>
          <${item.type === 'textarea' ? 'textarea' : 'input'} 
             type="${item.type}" 
             placeholder="${item.description || item.name}"
             className="border p-2 rounded w-full"
          />
        </div>`).join('\n')}
      </div>

      <button className="btn-primary mt-8">
        ${context?.actionButtonLabel}
      </button>
    </div>
  );
}`;

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500 relative">
        <div className="max-w-md w-full glass-card rounded-2xl shadow-2xl p-10 text-center border border-slate-700 relative z-10">
          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-[bounce_2s_infinite]">
            <Check size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
             {layout === 'catalog' ? 'Order Placed!' : layout === 'checklist' ? 'Audit Complete!' : 'Data Processed!'}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            The digital record for <span className="text-emerald-400 font-semibold">{context?.appTitle}</span> has been synced to the database.
          </p>
          
          <div className="flex flex-col space-y-3">
             <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors border border-slate-700 flex items-center justify-center gap-2">
                <Download size={18} />
                Download Report (PDF)
             </button>
             <button onClick={() => { setIsSubmitted(false); onReset(); }} className="text-slate-500 hover:text-white text-sm font-medium transition-colors pt-2">
                Process Another Document
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-in fade-in duration-700 relative">
        
        {/* SOURCE CODE MODAL */}
        {showCode && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="bg-[#1e1e1e] w-full max-w-4xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                 <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black">
                    <div className="flex items-center gap-2">
                       <Code2 size={16} className="text-blue-400" />
                       <span className="text-slate-300 font-mono text-sm">src/App.tsx</span>
                    </div>
                    <button onClick={() => setShowCode(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                 </div>
                 <div className="flex-1 overflow-auto p-6">
                    <pre className="font-mono text-xs md:text-sm text-blue-100 leading-relaxed">
                       {generatedSourceCode}
                    </pre>
                 </div>
                 <div className="bg-[#2d2d2d] px-6 py-4 border-t border-black flex justify-end">
                    <button onClick={() => {
                        navigator.clipboard.writeText(generatedSourceCode);
                        alert("Code copied to clipboard!");
                    }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                        Copy to Clipboard
                    </button>
                 </div>
             </div>
          </div>
        )}

        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between mb-10">
             <button onClick={onReset} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-slate-800 border border-slate-700 group-hover:border-slate-600 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="font-medium">Back to Analysis</span>
             </button>
             
             <div className="flex items-center space-x-3">
                 <button 
                    onClick={() => setShowCode(true)}
                    className="hidden md:flex items-center space-x-2 px-4 py-1.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold rounded-full border border-slate-700 transition-all"
                 >
                    <Code2 size={12} />
                    <span>VIEW SOURCE</span>
                 </button>
                 <div className="hidden md:flex items-center space-x-2 px-4 py-1.5 bg-slate-900/50 text-slate-400 text-xs font-medium rounded-full border border-slate-800">
                    <Database size={12} />
                    <span>PostgreSQL: Connected</span>
                 </div>
                 <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>LIVE {layout.toUpperCase()} APP</span>
                 </div>
             </div>
        </div>

        {/* GRID LAYOUT: 2/3 Main Content, 1/3 Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
            {/* --- MAIN CONTENT AREA (Left 8 Cols) --- */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* APP HEADER CARD */}
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-slate-700">
                    <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full blur-[100px] -mr-20 -mt-20 opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Layers size={14} /> {context?.detectedType}
                        </div>
                        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">{context?.appTitle}</h1>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                            <Server size={14} className="text-emerald-500" />
                            {layout === 'catalog' ? 'Real-time Inventory Sync' : layout === 'checklist' ? 'Audit Logs Active' : 'Secure Enterprise Gateway'}
                        </p>
                    </div>
                </div>

                {/* DYNAMIC CONTENT CARDS */}
                {(Object.entries(groupedItems) as [string, GenericItem[]][]).map(([category, catItems]) => (
                    <div key={category} className="glass-card rounded-2xl overflow-hidden border border-slate-800 transition-all hover:border-slate-700">
                        <div className="bg-slate-900/60 px-8 py-5 border-b border-slate-700/50 backdrop-blur-sm flex items-center space-x-3">
                            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500"></div>
                            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">{category}</h3>
                        </div>
                        
                        <div className="p-8">
                            {/* --- LAYOUT 1: CATALOG MODE --- */}
                            {layout === 'catalog' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {catItems.map(item => (
                                        <div key={item.id} className="bg-slate-950/30 border border-slate-800 rounded-xl p-5 flex justify-between items-center group hover:border-violet-500/40 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-violet-400 transition-colors">
                                                    <ShoppingCart size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200 text-lg">{item.name}</div>
                                                    <div className="text-emerald-400 font-mono font-medium">${item.value || '0.00'}</div>
                                                </div>
                                            </div>
                                            {cart[item.id] ? (
                                                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                                    <button onClick={() => handleRemoveFromCart(item.id)} className="p-3 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><Minus size={16} /></button>
                                                    <span className="w-10 text-center font-bold text-white">{cart[item.id]}</span>
                                                    <button onClick={() => handleAddToCart(item.id)} className="p-3 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><Plus size={16} /></button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleAddToCart(item.id)} className="p-3 bg-violet-600/10 text-violet-400 border border-violet-600/20 rounded-lg hover:bg-violet-600 hover:text-white transition-all">
                                                    <Plus size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : 
                            /* --- LAYOUT 2: CHECKLIST MODE --- */
                            layout === 'checklist' ? (
                                <div className="space-y-4">
                                    {catItems.map(item => (
                                        <div 
                                        key={item.id} 
                                        onClick={() => handleToggleCheck(item.id)}
                                        className={`p-5 rounded-xl border flex items-center justify-between cursor-pointer transition-all group ${checkedItems[item.id] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-600'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${checkedItems[item.id] ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                                    {checkedItems[item.id] && <Check size={18} />}
                                                </div>
                                                <span className={`text-lg font-medium transition-colors ${checkedItems[item.id] ? 'text-emerald-400 line-through decoration-emerald-500/30' : 'text-slate-200'}`}>{item.name}</span>
                                            </div>
                                            <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${checkedItems[item.id] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                                {checkedItems[item.id] ? 'Verified' : 'Pending'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                            /* --- LAYOUT 3: FORM MODE (Default) --- */
                            (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {catItems.map(item => {
                                        const inputType = item.type || (typeof item.value === 'number' ? 'number' : 'text');
                                        return (
                                            <div key={item.id} className={`${inputType === 'textarea' ? 'md:col-span-2' : ''} space-y-3 group`}>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-violet-400 transition-colors flex items-center gap-2 ml-1">
                                                    {inputType === 'date' && <Calendar size={12} />}
                                                    {inputType === 'number' && <Hash size={12} />}
                                                    {inputType === 'text' && <TypeIcon size={12} />}
                                                    {item.name}
                                                </label>
                                                
                                                {inputType === 'textarea' ? (
                                                    <textarea
                                                        value={formValues[item.id] || ''}
                                                        onChange={(e) => handleFormChange(item.id, e.target.value)}
                                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all h-32 resize-none hover:bg-slate-900"
                                                        placeholder={item.description || `Enter ${item.name}...`}
                                                    />
                                                ) : (
                                                    <input
                                                        type={inputType === 'number' ? 'number' : 'text'}
                                                        value={formValues[item.id] || ''}
                                                        onChange={(e) => handleFormChange(item.id, e.target.value)}
                                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all hover:bg-slate-900"
                                                        placeholder={item.description || `Enter ${item.name}...`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SIDEBAR (Right 4 Cols) - STICKY --- */}
            <div className="lg:col-span-4 sticky top-24 space-y-8">
                
                {/* STATUS & ACTIONS CARD */}
                <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            {layout === 'catalog' ? <ShoppingCart size={20} className="text-indigo-400" /> : 
                            layout === 'checklist' ? <ClipboardCheck size={20} className="text-indigo-400" /> :
                            <FileCheck size={20} className="text-indigo-400" />}
                            {layout === 'catalog' ? 'Order Summary' : layout === 'checklist' ? 'Audit Status' : 'Overview'}
                        </h3>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>{layout === 'checklist' ? 'Completion' : 'Progress'}</span>
                                <span className={progressPercent === 100 ? 'text-emerald-400' : 'text-slate-400'}>{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-700 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{metricLabel}</span>
                                <span className="text-xl font-bold text-white font-mono">{layout === 'catalog' ? `$${metricValue.toFixed(2)}` : metricValue}</span>
                            </div>
                        </div>

                        {/* Validation/Rules Widget */}
                        <div className={`rounded-xl p-4 border transition-all duration-300 ${
                            ruleTriggered 
                            ? 'bg-amber-500/10 border-amber-500/30' 
                            : 'bg-slate-900/50 border-slate-700'
                        }`}>
                            <div className="flex items-start gap-3">
                                {ruleTriggered ? <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" /> : <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />}
                                <div>
                                    <h4 className={`font-bold text-sm mb-1 ${ruleTriggered ? 'text-amber-400' : 'text-slate-200'}`}>
                                        {ruleTriggered ? "System Alert Triggered" : "System Normal"}
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {rule ? (ruleTriggered ? ruleMessage : `Threshold: ${rule.threshold} (Active)`) : "Standard validation protocols active."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            onClick={handleSubmit}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] active:scale-95 flex items-center justify-center space-x-2 group"
                        >
                            <span>{context?.actionButtonLabel || (layout === 'catalog' ? "Place Order" : layout === 'checklist' ? "Finalize Audit" : "Process Data")}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* MOBILE ACCESS CARD (QR CODE) */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
                    
                    <div className="mb-4">
                         <div className="bg-white p-2 rounded-xl border-4 border-slate-200/10 shadow-lg cursor-pointer transition-transform hover:scale-105 relative overflow-hidden group/qr">
                           <img src={qrCodeUrl} alt="Scan to Open App" className="w-32 h-32 object-contain" />
                           <div className="absolute top-0 left-0 w-full h-1 bg-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.5)] animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover/qr:opacity-100"></div>
                       </div>
                    </div>
                    
                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                        <Smartphone size={16} className="text-violet-400" />
                        Mobile Handover
                    </h4>
                    <p className="text-xs text-slate-400 mb-3 px-4">Scan to continue this session on a mobile device.</p>
                    
                     {isLocalhost && (
                         <div className="text-[10px] text-amber-500 font-mono bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                           Deployment Required for External Scan
                         </div>
                       )}
                </div>

            </div>
        </div>
    </div>
  );
};

export default GeneratedForm;
