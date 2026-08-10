import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Zap, 
  Camera, 
  X, 
  RefreshCw, 
  Github, 
  Linkedin, 
  Mail, 
  ShieldCheck,
  Layout, 
  Plus, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  ChevronRight 
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import UploadDashboard from './components/UploadDashboard';
import FormPreview from './components/FormPreview';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ProjectsPage from './components/ProjectsPage';
import AuthLogin from './components/AuthLogin';
import ErrorBoundary from './components/ErrorBoundary';
import VibeShiftLogo from './components/VibeShiftLogo';
import { Chatbot } from './components/Chatbot';
import { AppState, GenericItem, BusinessRule, View, Project as ProjectType } from './types';
import { extractDataFromImages, extractRuleFromAudio, extractRuleFromText, fileToGenerativePart } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';

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
        activeStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode } 
        });
        setStream(activeStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
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
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "scanned_doc.jpg", { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="relative card-minimal rounded-2xl p-0 border-zinc-800 shadow-2xl animate-fade-in h-[320px] md:h-[480px] flex flex-col overflow-hidden bg-black">
      {error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-950">
              <div className="p-4 bg-red-500/10 rounded-full text-red-400 mb-4"><Camera size={32} /></div>
              <p className="text-red-300 font-medium mb-4 text-sm">{error}</p>
              <button onClick={onClose} className="btn-secondary flex items-center gap-2">
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
            
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-xl"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-white/20 rounded-tr-xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-white/20 rounded-bl-xl"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-xl"></div>
            </div>
            
            <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center pointer-events-auto">
                    <div className="bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-400 border border-white/10 flex items-center gap-2 backdrop-blur-md uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Optical Capture Mode
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/60 text-white rounded-full hover:bg-zinc-800 transition-colors backdrop-blur-md border border-white/10">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex justify-center items-end pb-8 pointer-events-auto gap-8">
                     <button 
                        onClick={toggleCamera}
                        className="p-3 bg-black/50 text-white rounded-full hover:bg-zinc-800 backdrop-blur-md border border-white/10 transition-all"
                    >
                        <RefreshCw size={20} className={facingMode === 'environment' ? '' : 'rotate-180'} />
                    </button>

                    <button 
                        onClick={handleCapture}
                        className="w-16 h-16 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center group shadow-2xl"
                    >
                        <div className="w-12 h-12 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                    </button>

                    <div className="w-10"></div>
                </div>
            </div>
          </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('vibeshift_user') : null;
    return {
      user: cachedUser || null,
      view: cachedUser ? 'projects' : 'landing',
      uploadStep: 'upload',
      projects: [],
      currentProject: null,
      uploadedImages: [],
      uploadedAudio: null,
      manualRuleText: '',
      extractedItems: [],
      documentContext: null,
      rule: null,
      isLoading: false,
      loadingMessage: ''
    };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'System Synchronized', desc: 'Firestore and Auth are connected with secure user keys.', time: 'Just now', unread: true },
    { id: '2', title: 'Gemini Engine Ready', desc: 'Using gemini-3.1-pro-preview for high-precision document extraction.', time: '5m ago', unread: true },
    { id: '3', title: 'Workspace Configured', desc: 'Scan form with camera or upload a document to instantly build interactive interfaces.', time: '1h ago', unread: true }
  ]);

  const handleStart = () => {
    if (state.user) {
      setState(prev => ({ ...prev, view: 'projects' }));
    } else {
      setState(prev => ({ ...prev, view: 'auth' }));
    }
  };

  const handleLogin = (name: string) => {
    localStorage.setItem('vibeshift_user', name);
    setState(prev => ({ ...prev, user: name, view: 'projects' }));
  };

  const handleLogout = () => {
    localStorage.removeItem('vibeshift_user');
    setState(prev => ({ ...prev, user: null, view: 'landing' }));
  };

  const handleAnalyze = async (files: File[]) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      loadingMessage: 'Analyzing document structure...',
      uploadedImages: files,
      uploadStep: 'processing'
    }));

    try {
      const imageParts = await Promise.all(files.map(fileToGenerativePart));
      
      let rule: BusinessRule | null = null;
      if (state.uploadedAudio) {
        const audioPart = await fileToGenerativePart(state.uploadedAudio);
        rule = await extractRuleFromAudio(audioPart);
      } else if (state.manualRuleText.trim().length > 0) {
        rule = await extractRuleFromText(state.manualRuleText);
      }

      const result = await extractDataFromImages(imageParts, files[0]?.name);

      setState(prev => ({
        ...prev,
        extractedItems: result.items,
        documentContext: result.context,
        rule: rule || result.rule || prev.rule || null,
        isLoading: false,
        uploadStep: 'review'
      }));

    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isLoading: false, uploadStep: 'upload' }));
      alert("Analysis failed. Please check your inputs.");
    }
  };

  const handleGenerate = () => {
    if (!state.documentContext) return;

    const newProject: ProjectType = {
      id: Math.random().toString(36).substr(2, 9),
      title: state.documentContext.appTitle,
      type: state.documentContext.detectedType,
      responses: 0,
      status: 'active',
      lastEdited: new Date().toLocaleDateString(),
      items: state.extractedItems,
      context: state.documentContext,
      rule: state.rule
    };

    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      currentProject: newProject,
      view: 'preview'
    }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      uploadedImages: [],
      uploadedAudio: null,
      manualRuleText: '',
      extractedItems: [],
      documentContext: null,
      rule: null,
      isLoading: false,
      uploadStep: 'upload'
    }));
  };

  const handleSaveProject = (projectId: string, updatedItems: GenericItem[], updatedRule: BusinessRule | null, responseCount?: number) => {
    setState(prev => {
      const updatedProjects = prev.projects.map(p => 
        p.id === projectId 
          ? { ...p, items: updatedItems, rule: updatedRule, responses: responseCount ?? p.responses } 
          : p
      );
      return { 
        ...prev, 
        projects: updatedProjects,
        currentProject: prev.currentProject?.id === projectId 
          ? { ...prev.currentProject, items: updatedItems, rule: updatedRule, responses: responseCount ?? prev.currentProject.responses }
          : prev.currentProject,
        view: 'projects' 
      };
    });
  };

  const renderView = () => {
    switch (state.view) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'auth':
        return <AuthLogin onLogin={handleLogin} />;
      case 'projects':
        return (
          <ProjectsPage 
            projects={state.projects} 
            onNewProject={() => setState(prev => ({ ...prev, view: 'upload' }))}
            onSelectProject={(p) => setState(prev => ({ ...prev, currentProject: p, view: 'preview' }))}
          />
        );
      case 'upload':
        return (
          <UploadDashboard 
            onAnalyze={handleAnalyze}
            isAnalyzing={state.isLoading}
            activeStep={state.uploadStep}
            items={state.extractedItems}
            context={state.documentContext}
            onGenerate={handleGenerate}
            onReset={handleReset}
            manualRule={state.manualRuleText}
            setManualRule={(text) => setState(prev => ({ ...prev, manualRuleText: text }))}
            onAudioSelect={(file) => setState(prev => ({ ...prev, uploadedAudio: file }))}
            onCameraClick={() => setIsScanning(true)}
          />
        );
      case 'preview':
        return state.currentProject ? (
          <FormPreview 
            project={state.currentProject} 
            onBack={() => setState(prev => ({ ...prev, view: 'projects' }))}
            onSave={handleSaveProject}
            onViewAnalytics={() => setState(prev => ({ ...prev, view: 'analytics' }))}
          />
        ) : null;
      case 'analytics':
        return state.currentProject ? (
          <AnalyticsDashboard 
            project={state.currentProject} 
            onBack={() => setState(prev => ({ ...prev, view: 'preview' }))}
          />
        ) : null;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  if (state.view === 'landing' || state.view === 'auth') {
    return renderView();
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050505] text-zinc-100 flex overflow-hidden">
      {/* Mobile Sidebar Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#070709] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <VibeShiftLogo size="md" />
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {[
              { id: 'projects', label: 'My Projects', icon: Layout },
              { id: 'upload', label: 'New Workflow', icon: Plus },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'projects' || item.id === 'upload') {
                    setState(prev => ({ ...prev, view: item.id as View }));
                  }
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${state.view === item.id ? 'bg-teal-500/10 text-teal-400 font-bold border border-teal-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="relative z-[70] h-16 border-b border-white/5 bg-[#050505]/85 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span>VibeShift</span>
              <ChevronRight size={12} />
              <span className="text-zinc-300 capitalize">{state.view}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsSystemStatusOpen(prev => !prev)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Ready</span>
              </button>

              <AnimatePresence>
                {isSystemStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSystemStatusOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-72 bg-[#0d0d0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-left"
                    >
                      <div className="border-b border-white/5 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">System Parameters</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">High-fidelity offline extraction mode active</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Database Engine</span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Active</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Offline OCR Processing</span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Standby</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Audio Synthesis Node</span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Ready</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">API Response Routing</span>
                          <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Local Mode</span>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="p-2 text-zinc-400 hover:text-white transition-colors relative"
              >
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0c]" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-[280px] sm:w-80 max-w-[calc(100vw-32px)] bg-[#0d0d0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 space-y-4 z-50 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <Bell size={14} className="text-blue-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Notifications</span>
                        </div>
                        <button 
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                          }}
                          className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                        >
                          Mark all as read
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-zinc-500 text-center py-4">No notifications yet.</p>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                              }}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                n.unread 
                                  ? 'bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10' 
                                  : 'bg-white/[0.01] border-white/5 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2 min-w-0">
                                <span className={`text-[10px] font-bold uppercase tracking-wider break-words flex-1 min-w-0 ${n.unread ? 'text-blue-400' : 'text-zinc-500'}`}>
                                  {n.title}
                                </span>
                                <span className="text-[8px] text-zinc-600 font-medium whitespace-nowrap shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[9px] text-zinc-400 leading-relaxed mt-1 break-words">{n.desc}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2" />
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{state.user || 'Vaibhav'}</p>
                  <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-widest mt-1">Online</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-blue-500/20">
                  {state.user?.[0] || 'V'}
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#0d0d0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-left"
                    >
                      <div className="border-b border-white/5 pb-2">
                        <p className="text-xs font-bold text-white">{state.user || 'Vaibhav'}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">vkkanojia079@gmail.com</p>
                      </div>
                      <div className="space-y-1">
                        <button 
                          onClick={() => {
                            const newName = prompt("Enter your name:", state.user || "");
                            if (newName) handleLogin(newName);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          Rename Account
                        </button>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderView()}
        </main>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <CameraScanner 
              onCapture={(file) => {
                handleAnalyze([file]);
                setIsScanning(false);
              }}
              onClose={() => setIsScanning(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Chatbot Assistant */}
      <Chatbot />
    </div>
    </ErrorBoundary>
  );
};

export default App;
