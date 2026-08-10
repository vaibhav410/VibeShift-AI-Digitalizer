import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, ArrowRight, Zap, Search, ShieldCheck, Database, Layout, Smartphone, Share2, MoreVertical, Trash2, Copy, QrCode, Code, MessageCircle, Camera, Terminal, Play, Coffee, Newspaper, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DemoVideo from './DemoVideo';
import ThreeDCard from './ThreeDCard';
import { GenericItem, DocumentContext, UploadStep } from '../types';

interface UploadDashboardProps {
  onAnalyze: (files: File[]) => Promise<void>;
  isAnalyzing: boolean;
  activeStep: UploadStep;
  items: GenericItem[];
  context: DocumentContext | null;
  onGenerate: () => void;
  onReset: () => void;
  manualRule: string;
  setManualRule: (rule: string) => void;
  onAudioSelect?: (file: File) => void;
  onCameraClick: () => void;
}

const UploadDashboard: React.FC<UploadDashboardProps> = ({ 
  onAnalyze, 
  isAnalyzing, 
  activeStep,
  items, 
  context, 
  onGenerate,
  onReset,
  manualRule,
  setManualRule,
  onAudioSelect,
  onCameraClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleSimulateUpload = async (filename: string) => {
    const dummyBlob = new Blob(["mock_content"], { type: "text/plain" });
    const dummyFile = new File([dummyBlob], filename, { type: "text/plain" });
    setSelectedFiles([dummyFile]);
    await onAnalyze([dummyFile]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      await onAnalyze(files);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      await onAnalyze(files);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <AnimatePresence mode="wait">
        {activeStep === 'upload' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-3xl mx-auto space-y-8 text-center"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Upload Your Document</h2>
              <p className="text-zinc-400 text-lg">Our AI will scan, extract, and build your digital workflow in seconds.</p>
            </div>

            <ThreeDCard intensity={5} className="w-full">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative w-full min-h-[300px] md:aspect-[16/9] border-2 border-dashed rounded-3xl p-6 sm:p-12 transition-all cursor-pointer
                  flex flex-col items-center justify-center gap-4 sm:gap-6 text-center group overflow-hidden h-full
                  ${isDragging ? 'border-teal-500 bg-teal-500/5 scale-[1.02]' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'}
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-4 sm:p-6 bg-teal-500/10 rounded-2xl text-teal-400 group-hover:scale-110 transition-transform duration-500">
                  <Upload size={32} className="sm:w-10 sm:h-10" />
                </div>

                <div className="relative space-y-1 sm:space-y-2">
                  <p className="text-lg sm:text-xl font-bold">Drop your document here</p>
                  <p className="text-[10px] sm:text-sm text-zinc-500 font-medium uppercase tracking-widest">PDF, JPG, PNG • MAX 10MB</p>
                </div>

                <div className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onCameraClick(); }}
                    className="btn-secondary w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 border-teal-500/30 bg-teal-500/5 text-teal-400 hover:bg-teal-500/10"
                  >
                    <Camera size={16} />
                    <span>Scan with Camera</span>
                  </button>
                  <div className="hidden sm:block h-8 w-px bg-white/10 mx-1" />
                  <div className="flex items-center gap-3 mt-1 sm:mt-0">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0a0c] bg-zinc-800 flex items-center justify-center">
                          <FileText size={12} className="text-zinc-400" />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">Supports PDFs</p>
                  </div>
                </div>
              </div>
            </ThreeDCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <ThreeDCard intensity={8} className="md:col-span-2">
                <div 
                  onClick={() => setShowVideoModal(true)}
                  className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 text-left group cursor-pointer hover:bg-white/5 transition-colors overflow-hidden relative h-full"
                >
                   <div className="flex-1 space-y-2 relative z-10">
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[8px] font-bold text-teal-400 uppercase tracking-widest">
                         <Zap size={10} className="fill-teal-400 text-teal-400" />
                         Live Demo
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white">Watch AI in Action</h4>
                      <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">See how VibeShift extracts data from a handwritten medical form in real-time.</p>
                   </div>
                   <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                      {/* High-fidelity CSS/SVG Scanning Mockup */}
                      <div className="absolute inset-0 bg-[#0c0c10] flex flex-col justify-between p-3 font-mono text-[8px] text-zinc-500 overflow-hidden select-none">
                         <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="flex items-center gap-1 text-teal-400 font-bold tracking-wider">
                               <span className="relative flex h-1 w-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1 w-1 bg-teal-500"></span>
                               </span>
                               SCANNER
                            </span>
                         </div>
                         <div className="space-y-1.5 py-1">
                            <div className="h-1.5 w-3/4 bg-white/5 rounded animate-pulse" />
                            <div className="h-1.5 w-1/2 bg-white/5 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                         </div>
                         {/* Scanner bar animation */}
                         <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_10px_#2dd4bf] animate-bounce top-1/2" />
                         <div className="flex justify-between items-center text-[7px] text-zinc-600 border-t border-white/5 pt-1">
                            <span>LATENCY: 12ms</span>
                         </div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors animate-fade-in" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Play size={16} className="text-white fill-white opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                   </div>
                </div>
              </ThreeDCard>
              <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4">
                {[
                  { label: "College Form", icon: FileText, filename: "college_admission_form.pdf", color: "text-blue-400 bg-blue-500/10" },
                  { label: "Cafe Food Menu", icon: Coffee, filename: "cafe_menu_catalog.png", color: "text-amber-400 bg-amber-500/10" },
                  { label: "Candidate Resume", icon: User, filename: "resume_johndoe.pdf", color: "text-rose-400 bg-rose-500/10 border border-rose-500/20" },
                  { label: "Newspaper Article", icon: Newspaper, filename: "newspaper_article_clipping.jpg", color: "text-purple-400 bg-purple-500/10 border border-purple-500/20" },
                ].map((item, i) => (
                  <ThreeDCard key={i}>
                    <button 
                      onClick={() => handleSimulateUpload(item.filename)}
                      className="w-full h-full glass-card p-4 flex items-center gap-3 text-left group hover:bg-white/5 transition-all"
                    >
                      <div className={`p-2 rounded-lg transition-transform ${item.color} group-hover:scale-110 duration-200`}>
                        <item.icon size={16} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
                    </button>
                  </ThreeDCard>
                ))}
              </div>
            </div>

            {/* Business Logic Overlay - Re-implemented from previous design */}
            <div className="glass-card p-8 space-y-6 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                  <Zap size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Business Logic Overlay</h3>
              </div>
              
              <div className="space-y-4">
                <textarea 
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white outline-none focus:border-teal-500/50 transition-colors min-h-[100px] placeholder-zinc-700"
                  placeholder="Example: 'Apply 10% discount for orders over $500' or 'Flag items with low stock'..."
                  value={manualRule}
                  onChange={(e) => setManualRule(e.target.value)}
                />
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
                <div className="flex items-center gap-4">
                   <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">
                      <Zap size={14} className="text-violet-500" />
                      <span>Upload Voice Instructions</span>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) onAudioSelect?.(e.target.files[0]);
                        }}
                      />
                   </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeStep === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto space-y-12 text-center py-20"
          >
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-teal-500/20 blur-3xl animate-pulse" />
              <div className="relative w-32 h-32 bg-white/[0.02] border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                <Zap size={48} className="text-teal-400 fill-teal-400 animate-bounce" />
                <div className="scan-line" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">AI is working its magic...</h2>
              <div className="flex flex-col items-center gap-2">
                <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-teal-400 to-indigo-500"
                  />
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Scanning → Extracting → Building</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left max-w-sm mx-auto">
              {[
                { label: "Optical Character Recognition", status: "complete" },
                { label: "Neural Field Extraction", status: "processing" },
                { label: "Logic Synthesis", status: "pending" }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-4 glass-card">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-emerald-500/20 text-emerald-500' : step.status === 'processing' ? 'bg-teal-500/20 text-teal-400 animate-spin' : 'bg-white/5 text-zinc-600'}`}>
                    {step.status === 'complete' ? <CheckCircle2 size={14} /> : step.status === 'processing' ? <Zap size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-zinc-600' : 'text-zinc-300'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeStep === 'review' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button onClick={onReset} className="btn-ghost py-2 px-3">
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <div className="hidden sm:block h-4 w-px bg-white/10" />
                <div className="flex flex-wrap items-center gap-2">
                  <div className="badge-blue text-[10px] sm:text-xs">Review Mode</div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">{context?.detectedType || 'Extracted Document'}</h2>
                </div>
              </div>
              <button onClick={onGenerate} className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm">
                Generate Live Form
                <ArrowRight size={16} />
              </button>
            </div>

            {context?.isUnrelated && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex flex-col md:flex-row items-start gap-4 text-left shadow-2xl shadow-rose-500/5 animate-fade-in"
              >
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl shrink-0">
                  <AlertCircle size={24} className="animate-pulse" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400">Unrelated Document Detected • ग़ैर-संबंधित दस्तावेज़</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      This platform is optimized for <strong className="text-white">Cafe Menus, Food Stalls, and College Admission Forms</strong>. We detected this file is a <strong className="text-rose-300 uppercase">{context.unrelatedType}</strong>.
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                      यह प्लेटफ़ॉर्म विशेष रूप से कैफ़े और कॉलेज फॉर्म के लिए है। यह दस्तावेज़ एक <strong className="text-rose-300">{context.unrelatedType}</strong> है, जो मुख्य फॉर्म प्रकारों से अलग है। फिर भी AI ने इसके फ़ील्ड्स को सफलतापूर्वक निकाल लिया है!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Original Document Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Original Source</h3>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Page 1 of 1</span>
                </div>
                <div className="relative aspect-[3/4] glass-card overflow-hidden bg-black/40 flex items-center justify-center p-8">
                  {selectedFiles[0] && (
                    <img 
                      src={URL.createObjectURL(selectedFiles[0])} 
                      alt="Source" 
                      className="max-w-full max-h-full object-contain opacity-50 grayscale"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {/* AI Bounding Boxes Simulation */}
                  <div className="absolute inset-0 p-8">
                    <div className="relative w-full h-full">
                      {items.slice(0, 5).map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="absolute border border-teal-500/50 bg-teal-500/10 rounded-sm"
                          style={{
                            top: `${20 + i * 15}%`,
                            left: '10%',
                            width: '40%',
                            height: '4%'
                          }}
                        >
                          <div className="absolute -top-4 left-0 text-[8px] font-bold text-teal-400 uppercase tracking-widest">Field Detected</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Field Mapping Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">AI-Detected Fields</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">99.9% Accuracy</span>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                </div>
                <div className="glass-card overflow-hidden flex flex-col max-h-[600px] bg-black/40 border-white/5">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-teal-400" />
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verification Logs</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Verified</span>
                      <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar font-mono">
                    {items.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg hover:border-teal-500/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-teal-500/70">[{idx.toString().padStart(2, '0')}]</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[8px] text-emerald-500 uppercase font-bold">Valid</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 bg-black/40 border border-white/5 rounded px-3 py-1.5 text-xs text-zinc-300">
                              {item.value}
                           </div>
                           <div className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-zinc-500 uppercase">
                              {item.category || 'String'}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{items.length} Entries Extracted</p>
                    <button className="text-[10px] font-bold text-teal-400 uppercase tracking-widest hover:text-teal-300 transition-colors">Clear All</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-zinc-800 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
              <DemoVideo />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDashboard;
