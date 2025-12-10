
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Zap, Image as ImageIcon, Mic, Layout, FileText, ArrowRight, Wand2, Hexagon, Command, Sparkles, ScanLine, Github, Linkedin, X, Link as LinkIcon, Globe, Camera, RefreshCw, ChevronDown, Settings2, ChevronUp } from 'lucide-react';
import FileUpload from './components/FileUpload';
import GeneratedForm from './components/GeneratedForm';
import AnalysisReview from './components/AnalysisReview';
import AuthLogin from './components/AuthLogin';
import { AppState, GenericItem, BusinessRule } from './types';
import { extractDataFromImages, extractRuleFromAudio, extractRuleFromText, fileToGenerativePart } from './services/gemini';

const LINKEDIN_URL = "https://www.linkedin.com/in/vaibhav-kumar-kanojia-38533631b/";
const GITHUB_URL = "https://github.com/vaibhav410";

// --- SUB-COMPONENT: ROBUST CAMERA SCANNER ---
interface CameraScannerProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setError(null);
        // Explicitly request video with the current facing mode
        activeStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode } 
        });
        setStream(activeStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        // Retry without specific facing mode constraint if the first attempt fails (fallback for laptops)
        if (facingMode === 'environment') {
             try {
                activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(activeStream);
                if (videoRef.current) videoRef.current.srcObject = activeStream;
             } catch (retryErr) {
                 setError("Could not access camera. Please check permissions.");
             }
        } else {
             setError("Could not access camera. Please check permissions.");
        }
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip image horizontally if using front camera for natural mirror feel
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "scanned_doc.jpg", { type: 'image/jpeg' });
            onCapture(file);
            onClose(); // Clean close
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="relative glass-card rounded-2xl p-0 border border-violet-500/50 shadow-[0_0_30px_rgba(124,58,237,0.1)] animate-in zoom-in duration-300 h-[320px] md:h-[480px] flex flex-col overflow-hidden bg-black">
      {/* Live Camera View */}
      {error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900">
              <div className="p-4 bg-red-500/10 rounded-full text-red-400 mb-4"><Camera size={32} /></div>
              <p className="text-red-300 font-medium mb-4 text-sm">{error}</p>
              <button onClick={onClose} className="flex items-center space-x-2 text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 text-sm">
                  <X size={16} /> <span>Close</span>
              </button>
          </div>
      ) : (
          <>
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            
            {/* High Tech Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-emerald-500 rounded-tl-xl"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-emerald-500 rounded-tr-xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-emerald-500 rounded-bl-xl"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-emerald-500 rounded-br-xl"></div>
                
                {/* Scanning Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            
            {/* Controls Overlay */}
            <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center pointer-events-auto">
                    <div className="bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-2 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        VIBESHIFT OPTICAL RECOGNITION
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex justify-between items-end pb-4 pointer-events-auto px-4">
                     {/* Camera Toggle Button */}
                     <button 
                        onClick={toggleCamera}
                        className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md border border-white/20 transition-all"
                        title="Switch Camera"
                    >
                        <RefreshCw size={20} className={facingMode === 'environment' ? '' : 'rotate-180'} />
                    </button>

                    <button 
                        onClick={handleCapture}
                        className="w-16 h-16 rounded-full border-4 border-white/80 bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center group shadow-2xl mx-auto"
                        title="Capture Document"
                    >
                        <div className="w-12 h-12 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                    </button>

                     {/* Spacer to balance flex layout */}
                    <div className="w-10"></div>
                </div>
            </div>
          </>
      )}
    </div>
  );
};


const Footer: React.FC = () => (
  <footer className="bg-[#020617] text-slate-400 py-16 mt-20 border-t border-slate-800/50 relative overflow-hidden">
    {/* Background elements */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-violet-500/20">
             <Command className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">VibeShift</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          The Enterprise Standard for AI-Driven Process Digitalization. Transform static documents into dynamic software.
        </p>
        <div className="flex space-x-4">
           {/* Social Links */}
           <a 
             href={GITHUB_URL} 
             target="_blank" 
             rel="noopener noreferrer"
             className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 hover:text-white transition-all flex items-center justify-center group"
           >
              <Github size={20} className="group-hover:scale-110 transition-transform" />
           </a>
           <a 
             href={LINKEDIN_URL} 
             target="_blank" 
             rel="noopener noreferrer"
             className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 hover:text-white transition-all flex items-center justify-center group"
           >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
           </a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Product</h4>
        <ul className="space-y-3 text-sm">
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">VibeShift Core</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Visual Intelligence</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Workflow Engine</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Integrations</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Solutions</h4>
        <ul className="space-y-3 text-sm">
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Financial Operations</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Healthcare Intake</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Supply Chain</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Legal Automation</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Support</h4>
        <ul className="space-y-3 text-sm">
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Documentation</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">API Status</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Contact Sales</a></li>
          <li className="hover:text-violet-400 cursor-pointer transition-colors"><a href="#">Security</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
      <span>© 2025 VibeShift AI Inc. All rights reserved.</span>
      <div className="flex space-x-6">
        <span className="hover:text-slate-400 cursor-pointer transition-colors"><a href="#">Privacy Policy</a></span>
        <span className="hover:text-slate-400 cursor-pointer transition-colors"><a href="#">Terms of Service</a></span>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, setState] = useState<AppState>({
    uploadedImages: [],
    uploadedAudio: null,
    manualRuleText: '',
    extractedItems: [],
    documentContext: null,
    rule: null,
    step: 'input',
    isLoading: false,
    loadingMessage: ''
  });

  const [isScanning, setIsScanning] = useState(false);
  const [showLogic, setShowLogic] = useState(false); // Collapsible state

  const handleImageUpload = (file: File) => {
    setState(prev => ({ ...prev, uploadedImages: [file] }));
  };

  const handleAudioUpload = (file: File) => {
    setState(prev => ({ ...prev, uploadedAudio: file, manualRuleText: '' })); 
  };

  const handleRemoveImage = () => {
    setState(prev => ({ ...prev, uploadedImages: [] }));
  };

  const handleRemoveAudio = () => {
    setState(prev => ({ ...prev, uploadedAudio: null }));
  };

  const handleAnalyze = async () => {
    if (state.uploadedImages.length === 0) {
      alert("Please upload a business document first.");
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, loadingMessage: 'VibeShift Engine Architecting Solution...' }));

    try {
      const imageParts = await Promise.all(state.uploadedImages.map(fileToGenerativePart));
      
      let rule: BusinessRule | null = null;
      if (state.uploadedAudio) {
        const audioPart = await fileToGenerativePart(state.uploadedAudio);
        rule = await extractRuleFromAudio(audioPart.inlineData.data, audioPart.inlineData.mimeType);
      } else if (state.manualRuleText.trim().length > 0) {
        rule = await extractRuleFromText(state.manualRuleText);
      }

      // Extract Data AND Context
      const { items, context } = await extractDataFromImages(imageParts);

      setState(prev => ({
        ...prev,
        extractedItems: items,
        documentContext: context,
        rule: rule,
        step: 'review',
        isLoading: false
      }));

    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false }));
      alert("Analysis failed. Please check your inputs.");
    }
  };

  const handleReset = () => {
    setState({
      uploadedImages: [],
      uploadedAudio: null,
      manualRuleText: '',
      extractedItems: [],
      documentContext: null,
      rule: null,
      step: 'input',
      isLoading: false,
      loadingMessage: ''
    });
  };

  if (!isAuthenticated) {
    return <AuthLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100 bg-[#020617] selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      
      {/* Background Grid & Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Navbar */}
      <header className="bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
          <a 
            href={LINKEDIN_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-all duration-300">
              <Command className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">VibeShift</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
              Features <ChevronDown size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
              Enterprise <ChevronDown size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Docs</a>
            
            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center space-x-1 bg-slate-900/50 p-1 rounded-full border border-slate-800">
             {['input', 'review', 'app'].map((s, idx) => {
                const isActive = state.step === s;
                const isCompleted = (state.step === 'review' && idx === 0) || (state.step === 'app' && idx < 2);
                
                return (
                    <div key={s} className="flex items-center">
                        <div className={`
                            flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-500
                            ${isActive ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 
                              isCompleted ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}
                        `}>
                            <div className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full 
                              ${isActive ? 'bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 
                                isCompleted ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                                {isCompleted ? <Zap size={10} /> : idx + 1}
                            </div>
                            <span className="capitalize font-medium text-sm tracking-wide hidden lg:inline">
                                {s === 'input' ? 'Ingest' : s === 'review' ? 'Analyze' : 'Deploy'}
                            </span>
                        </div>
                    </div>
                );
             })}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

        {/* Loading Overlay */}
        {state.isLoading && (
          <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-lg z-[60] flex flex-col items-center justify-center animate-in fade-in duration-500">
             <div className="relative mb-10 p-10">
                 <div className="absolute inset-0 border-t-2 border-violet-500 rounded-full animate-spin blur-[2px]"></div>
                 <div className="w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="text-white animate-pulse" size={36} />
                 </div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-3 tracking-tight">Processing Data</h3>
              <p className="text-violet-400 font-mono animate-pulse">{state.loadingMessage}</p>
          </div>
        )}

        {/* STEP 1: INPUT */}
        {state.step === 'input' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pt-10">
             <div className="text-center mb-16 relative">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                 <Zap size={12} className="text-yellow-400 fill-yellow-400" /> 
                 <span>VibeShift AI Engine 3.0</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Transform</span> <br/>
                <span className="gradient-text drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">Chaos to Code.</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Instantly transform static documents into fully functional Web Apps. No coding required.
              </p>
            </div>

            {/* MAIN UPLOAD AREA - The Hero */}
            <div className="mb-12">
               {isScanning ? (
                      <CameraScanner 
                         onCapture={handleImageUpload} 
                         onClose={() => setIsScanning(false)} 
                      />
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <FileUpload 
                            type="image"
                            label="Upload Document"
                            subLabel="Invoice, Contract, Inventory (JPG/PNG)"
                            onUpload={handleImageUpload}
                            currentFile={state.uploadedImages[0]}
                            onRemove={handleRemoveImage}
                        />
                         <button 
                           onClick={() => setIsScanning(true)}
                           className="w-full py-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700 hover:border-violet-500/30 text-slate-300 hover:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                           <Camera size={20} />
                           <span>Scan via Camera</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ACTION BUTTON */}
             <div className="flex justify-center mb-16">
                <button
                    onClick={handleAnalyze}
                    disabled={state.uploadedImages.length === 0}
                    className="w-full md:w-auto group relative inline-flex items-center justify-center px-24 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:grayscale shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] transform hover:-translate-y-1 active:scale-95 text-lg"
                >
                    <span className="mr-3">Initiate Synthesis</span>
                    <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            {/* COLLAPSIBLE LOGIC SECTION */}
            <div className="border-t border-slate-800/50 pt-8">
                 <button 
                    onClick={() => setShowLogic(!showLogic)}
                    className="flex items-center justify-center space-x-2 text-slate-500 hover:text-white transition-colors mx-auto mb-6 text-sm font-medium"
                 >
                    <Settings2 size={16} />
                    <span>Advanced Workflow Configuration</span>
                    {showLogic ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                 </button>

                 {showLogic && (
                     <div className="glass-card rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300 border border-slate-700/50 bg-slate-900/30">
                        <div className="flex items-start gap-6">
                             <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Custom Logic Rules</label>
                                {!state.uploadedAudio && (
                                    <textarea
                                        value={state.manualRuleText}
                                        onChange={(e) => setState(prev => ({ ...prev, manualRuleText: e.target.value }))}
                                        placeholder="e.g., 'If total > $5,000, trigger Manager Approval'"
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-violet-500/50 outline-none resize-none placeholder-slate-600 text-sm h-32"
                                    />
                                )}
                             </div>
                             <div className="w-px bg-slate-700 h-32 hidden md:block"></div>
                             <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Voice Instructions</label>
                                 <FileUpload 
                                    type="audio"
                                    label="Record / Upload"
                                    subLabel="WAV/MP3"
                                    onUpload={handleAudioUpload}
                                    currentFile={state.uploadedAudio}
                                    onRemove={handleRemoveAudio}
                                />
                             </div>
                        </div>
                     </div>
                 )}
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW */}
        {state.step === 'review' && (
             <AnalysisReview 
                extractedItems={state.extractedItems}
                context={state.documentContext}
                rule={state.rule}
                onBack={() => setState(prev => ({ ...prev, step: 'input' }))}
                onConfirm={() => setState(prev => ({ ...prev, step: 'app' }))}
             />
        )}

        {/* STEP 3: APP */}
        {state.step === 'app' && (
             <GeneratedForm 
               items={state.extractedItems} 
               context={state.documentContext}
               rule={state.rule} 
               onReset={handleReset}
             />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default App;
