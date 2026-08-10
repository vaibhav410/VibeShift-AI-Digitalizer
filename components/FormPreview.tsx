import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Share2, 
  Copy, 
  QrCode, 
  Code, 
  MessageCircle, 
  CheckCircle2, 
  Settings2, 
  Palette, 
  Eye, 
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Trash2,
  Plus,
  Zap,
  Layout,
  Globe,
  ShoppingCart,
  ShoppingBag,
  Minus,
  GraduationCap,
  UserCheck,
  Award,
  AlertTriangle,
  HeartPulse,
  Activity,
  FileCheck,
  Thermometer,
  ClipboardList,
  Briefcase,
  Star,
  BookOpen,
  Sparkles,
  Calendar,
  Database,
  Mail,
  FileText,
  Volume2,
  Languages,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import VibeShiftLogo from './VibeShiftLogo';
import { WorkflowAgent } from './WorkflowAgent';

interface FormPreviewProps {
  project: Project;
  onBack?: () => void;
  onSave?: (projectId: string, updatedItems: any[], updatedRule: any, responseCount?: number) => void;
  onViewAnalytics?: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ project, onBack, onSave, onViewAnalytics }) => {
  const { context = {} as any } = project || {};
  const [items, setItems] = useState(() => project?.items || []);
  const [rule, setRule] = useState(() => project?.rule || null);
  const [responseCount, setResponseCount] = useState(() => project?.responses || 0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'customize' | 'share' | 'agent'>('preview');
  const [isAccepting, setIsAccepting] = useState(true);
  const [accentColor, setAccentColor] = useState('#5eead4');
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const menuFoodItems = useMemo(() => {
    return items.filter(item => {
      const nameL = item.name.toLowerCase();
      const isEligibleFlag = nameL.includes('eligible') || nameL.includes('rewards') || nameL.includes('member') || item.type === 'boolean';
      return !isEligibleFlag;
    });
  }, [items]);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (!updated[itemId]) return prev;
      if (updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId]--;
      }
      return updated;
    });
  };

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = items.find(i => i.id === id);
      if (!item) return sum;
      const price = parseFloat(String(item.value).replace(/[^0-9.]/g, '')) || 0;
      return sum + (price * qty);
    }, 0);
  }, [cart, items]);

  const cartDiscount = useMemo(() => {
    if (!rule) return 0;
    const threshold = rule.threshold || 0;
    const val = rule.benefitValue || rule.value || 0;
    if (cartSubtotal >= threshold) {
      return (cartSubtotal * val) / 100;
    }
    return 0;
  }, [rule, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount);
  }, [cartSubtotal, cartDiscount]);

  const cartTotalItems = useMemo(() => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }, [cart]);

  // Dynamic initializers from project items
  const initialGrade = useMemo(() => {
    const item = items.find(i => i.name.toLowerCase().includes('grade') || i.name.toLowerCase().includes('percentage'));
    return item ? parseFloat(String(item.value)) || 90 : 94.5;
  }, [items]);

  const initialHostel = useMemo(() => {
    const item = items.find(i => i.name.toLowerCase().includes('hostel'));
    return item ? String(item.value).toLowerCase() === 'true' : true;
  }, [items]);

  const initialTemp = useMemo(() => {
    const item = items.find(i => i.name.toLowerCase().includes('temperature') || i.name.toLowerCase().includes('refrigeration'));
    return item ? parseFloat(String(item.value)) || 36 : 36;
  }, [items]);

  const initialAllergies = useMemo(() => {
    const item = items.find(i => i.name.toLowerCase().includes('allergy') || i.name.toLowerCase().includes('allergies'));
    return item ? String(item.value) : "Peanuts, Penicillin";
  }, [items]);

  // --- Scenario States ---
  // 1. College Form Scenario
  const [gradePercentage, setGradePercentage] = useState<number>(initialGrade);
  const [hostelRequired, setHostelRequired] = useState<boolean>(initialHostel);
  const [selectedStream, setSelectedStream] = useState<string>("Computer Science Engineering");
  const [enrollmentSubmitted, setEnrollmentSubmitted] = useState<boolean>(false);

  // 2. Medical Patient Scenario
  const [patientAllergies, setPatientAllergies] = useState<string>(initialAllergies);
  const [isCopayVerified, setIsCopayVerified] = useState<boolean>(true);
  const [medicalSubmitted, setMedicalSubmitted] = useState<boolean>(false);

  // 3. Operations Checklist Scenario
  const [checklistStates, setChecklistStates] = useState<{ [itemId: string]: boolean }>(() => {
    const initial: { [itemId: string]: boolean } = {};
    items.forEach(item => {
      if (item.type === 'boolean' || String(item.value).toLowerCase() === 'true' || String(item.value).toLowerCase() === 'false') {
        initial[item.id] = String(item.value).toLowerCase() === 'true';
      }
    });
    return initial;
  });
  const [fridgeTemp, setFridgeTemp] = useState<number>(initialTemp);
  const [checklistSubmitted, setChecklistSubmitted] = useState<boolean>(false);

  // 4. Candidate Resume Scenario
  const [interviewScore, setInterviewScore] = useState<number>(4);
  const [resumeFastTracked, setResumeFastTracked] = useState<boolean>(false);
  const [recruiterNotes, setRecruiterNotes] = useState<string>("");

  // 5. Newspaper Article Scenario
  const [articleSaved, setArticleSaved] = useState<boolean>(false);
  const [selectedFontScale, setSelectedFontScale] = useState<'small' | 'medium' | 'large'>('medium');
  const [articleLiked, setArticleLiked] = useState<boolean>(false);

  // --- 🔗 RELATABLE ENTERPRISE CONNECTOR STATES (REALISTIC INTERACTIVE SYSTEMS) ---
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [isSheetsSynced, setIsSheetsSynced] = useState<boolean>(false);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState<boolean>(false);
  const [printedReceipt, setPrintedReceipt] = useState<boolean>(false);
  const [whatsappSent, setWhatsappSent] = useState<boolean>(false);
  const [slackBroadcasted, setSlackBroadcasted] = useState<boolean>(false);
  const [isExportingFhir, setIsExportingFhir] = useState<boolean>(false);
  const [fhirPayload, setFhirPayload] = useState<string | null>(null);
  const [isCompilingPdf, setIsCompilingPdf] = useState<boolean>(false);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'draft' | 'sending' | 'sent'>('idle');
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [ttsPlaying, setTtsPlaying] = useState<boolean>(false);
  const [ttsProgress, setTtsProgress] = useState<number>(0);
  const [currentLanguage, setCurrentLanguage] = useState<string>('english');

  // Share portal states & actions
  const [activeShareTool, setActiveShareTool] = useState<'none' | 'qrcode' | 'embed' | 'whatsapp' | 'publicurl'>('none');
  const [whatsappPhone, setWhatsappPhone] = useState<string>("");
  const [isSendingWhatsAppShare, setIsSendingWhatsAppShare] = useState<boolean>(false);
  const [isWhatsAppShareSent, setIsWhatsAppShareSent] = useState<boolean>(false);
  const [isEmbedCopied, setIsEmbedCopied] = useState<boolean>(false);

  const handleSimulateSubmissions = (count: number) => {
    setResponseCount(prev => prev + count);
  };

  const shareUrl = `https://vibeshift.ai/f/${context?.detectedType?.toLowerCase().replace(/\s+/g, '-') || 'form'}`;

  const handleSendWhatsAppShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappPhone) return;
    setIsSendingWhatsAppShare(true);
    setTimeout(() => {
      setIsSendingWhatsAppShare(false);
      setIsWhatsAppShareSent(true);
      setTimeout(() => setIsWhatsAppShareSent(false), 4000);
    }, 1500);
  };

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600px" style="border:none;border-radius:12px;background:#050505;"></iframe>`;
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setIsEmbedCopied(true);
      setTimeout(() => setIsEmbedCopied(false), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = embedCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsEmbedCopied(true);
        setTimeout(() => setIsEmbedCopied(false), 2000);
      } catch (err) {
        console.error("Embed copy failed", err);
      }
      document.body.removeChild(textArea);
    });
  };

  // Simulated handlers
  const handleSheetsSync = () => {
    setIsSyncingSheets(true);
    setTimeout(() => {
      setIsSyncingSheets(false);
      setIsSheetsSynced(true);
    }, 1500);
  };

  const handleBookSlot = (slot: string) => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setScheduledSlot(slot);
    }, 1200);
  };

  const handlePrintReceipt = () => {
    setIsPrintingReceipt(true);
    setTimeout(() => {
      setIsPrintingReceipt(false);
      setPrintedReceipt(true);
    }, 1600);
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 4000);
  };

  const handleSlackBroadcast = () => {
    setSlackBroadcasted(true);
    setTimeout(() => setSlackBroadcasted(false), 4000);
  };

  const handleExportFhir = () => {
    setIsExportingFhir(true);
    setTimeout(() => {
      setIsExportingFhir(false);
      // Construct a valid HL7 FHIR Patient Resource JSON mapping based on items
      const patientName = String(items.find(i => i.name.toLowerCase().includes('name'))?.value || "Vaibhav Kanojia");
      const patientDob = String(items.find(i => i.name.toLowerCase().includes('birth'))?.value || "1998-05-14");
      const activeAllergies = patientAllergies ? patientAllergies.split(',').map(s => s.trim()) : ["Peanuts", "Penicillin"];
      
      const payload = {
        resourceType: "Patient",
        id: "vibe-shift-extracted-p1",
        active: true,
        name: [{
          use: "official",
          text: patientName,
          family: patientName.split(' ').pop() || "",
          given: [patientName.split(' ')[0] || ""]
        }],
        birthDate: patientDob,
        allergies: activeAllergies.map(alg => ({
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          substance: {
            text: alg
          }
        })),
        meta: {
          tag: [{ system: "http://vibeshift.app/fhir", code: "extracted-ocr" }]
        }
      };
      setFhirPayload(JSON.stringify(payload, null, 2));
    }, 1000);
  };

  const handleCompilePdf = () => {
    setIsCompilingPdf(true);
    setTimeout(() => {
      setIsCompilingPdf(false);
      setCompiledPdfUrl(true);
    }, 1800);
  };

  const handleSendEmail = () => {
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
    }, 1500);
  };

  // Simulated TTS audio reader loop
  React.useEffect(() => {
    let ttsTimer: NodeJS.Timeout;
    if (ttsPlaying) {
      ttsTimer = setInterval(() => {
        setTtsProgress(prev => {
          if (prev >= 100) {
            setTtsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(ttsTimer);
  }, [ttsPlaying]);

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowShareSuccess(true);
        setTimeout(() => setShowShareSuccess(false), 2000);
      } catch (err) {
        console.error("Copy fallback failed", err);
      }
      document.body.removeChild(textArea);
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <header className="relative z-50 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:block">
            <VibeShiftLogo size="sm" />
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <h2 className="text-sm font-bold tracking-tight text-zinc-400 truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">{context?.detectedType || 'Live Form'}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button 
            onClick={() => setActiveTab('customize')}
            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'customize' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Palette size={14} />
            <span className="hidden sm:inline">Customize</span>
          </button>
          <button 
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'share' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button 
            onClick={() => setActiveTab('agent')}
            className={`flex items-center gap-2 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'agent' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Sparkles size={14} className="text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">AI Agent</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
          </div>
          <button 
            onClick={() => {
              if (onSave) {
                (onSave as any)(project.id, items, rule, responseCount);
              }
            }} 
            className="btn-primary py-1.5 px-3 sm:py-2 sm:px-6 text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap"
          >
            <span className="hidden xs:inline">Save & </span>Publish
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Controls */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01] overflow-y-auto custom-scrollbar shrink-0 max-h-[300px] lg:max-h-none">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div 
                key="preview-controls"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Device Preview</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setDeviceMode('desktop')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${deviceMode === 'desktop' ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      <Monitor size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Desktop</span>
                    </button>
                    <button 
                      onClick={() => setDeviceMode('mobile')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${deviceMode === 'mobile' ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      <Smartphone size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Mobile</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Form Status</h3>
                  <div className="glass-card p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-300">Accept Responses</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Publicly Accessible</p>
                    </div>
                    <button 
                      onClick={() => setIsAccepting(!isAccepting)}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${isAccepting ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isAccepting ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Analytics Mini-Widget</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 space-y-1">
                      <p className="text-xl font-bold text-teal-400">{responseCount}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Responses</p>
                    </div>
                    <div className="glass-card p-4 space-y-1">
                      <p className="text-xl font-bold">0s</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Time</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'customize' && (
              <motion.div 
                key="customize-controls"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Theme Colors</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['#5eead4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${accentColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Branding</h3>
                  <div className="space-y-3">
                    <button className="w-full btn-secondary py-3 text-xs justify-between group">
                      <div className="flex items-center gap-2">
                        <Layout size={14} className="text-zinc-500 group-hover:text-white" />
                        <span>Upload Logo</span>
                      </div>
                      <Plus size={14} className="text-zinc-500" />
                    </button>
                    <button className="w-full btn-secondary py-3 text-xs justify-between group">
                      <div className="flex items-center gap-2">
                        <Palette size={14} className="text-zinc-500 group-hover:text-white" />
                        <span>Custom Font</span>
                      </div>
                      <ChevronDown size={14} className="text-zinc-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Form Layout</h3>
                  <div className="space-y-2">
                    {['Single Page', 'Step by Step', 'Card View'].map(layout => (
                      <button key={layout} className="w-full p-3 glass-card text-left text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'share' && (
              <motion.div 
                key="share-controls"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Share Link</h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly 
                      value={`vibeshift.ai/f/${context?.detectedType?.toLowerCase().replace(/\s+/g, '-') || 'form'}`}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-zinc-400 focus:outline-none"
                    />
                    <button 
                      onClick={handleShare}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveShareTool(activeShareTool === 'qrcode' ? 'none' : 'qrcode')}
                    className={`btn-secondary py-4 flex-col gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeShareTool === 'qrcode' ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-extrabold' : ''
                    }`}
                  >
                    <QrCode size={20} />
                    QR Code
                  </button>
                  <button 
                    onClick={() => setActiveShareTool(activeShareTool === 'embed' ? 'none' : 'embed')}
                    className={`btn-secondary py-4 flex-col gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeShareTool === 'embed' ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-extrabold' : ''
                    }`}
                  >
                    <Code size={20} />
                    Embed
                  </button>
                  <button 
                    onClick={() => setActiveShareTool(activeShareTool === 'whatsapp' ? 'none' : 'whatsapp')}
                    className={`btn-secondary py-4 flex-col gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeShareTool === 'whatsapp' ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-extrabold' : ''
                    }`}
                  >
                    <MessageCircle size={20} />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => setActiveShareTool(activeShareTool === 'publicurl' ? 'none' : 'publicurl')}
                    className={`btn-secondary py-4 flex-col gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      activeShareTool === 'publicurl' ? 'border-teal-500/50 bg-teal-500/10 text-teal-400 font-extrabold' : ''
                    }`}
                  >
                    <Globe size={20} />
                    Public URL
                  </button>
                </div>

                {/* 🛠️ Selected Share Tool Detail Panel */}
                <AnimatePresence mode="wait">
                  {activeShareTool === 'qrcode' && (
                    <motion.div
                      key="qrcode-panel"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 overflow-hidden text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <QrCode size={12} />
                          Live QR Code Portal
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Ready to scan</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-5 bg-white rounded-xl relative overflow-hidden group">
                        {/* Interactive scan laser line */}
                        <div className="absolute inset-x-4 top-4 bottom-4 border border-teal-500/10 rounded-lg pointer-events-none overflow-hidden z-20">
                          <div className="scan-line" />
                        </div>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=050505&bgcolor=ffffff&data=${encodeURIComponent(shareUrl)}`} 
                          alt="Share QR Code"
                          className="w-40 h-40 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=050505&bgcolor=ffffff&data=${encodeURIComponent(shareUrl)}`, '_blank');
                          }}
                          className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5 flex items-center justify-center gap-1.5"
                        >
                          <Eye size={12} />
                          Full Resolution
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=050505&bgcolor=ffffff&data=${encodeURIComponent(shareUrl)}`);
                            setShowShareSuccess(true);
                            setTimeout(() => setShowShareSuccess(false), 2000);
                          }}
                          className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5 flex items-center justify-center gap-1.5"
                        >
                          <Copy size={12} />
                          Copy Link
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeShareTool === 'embed' && (
                    <motion.div
                      key="embed-panel"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 overflow-hidden text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Code size={12} />
                          Iframe Embed Snippet
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Responsive node</span>
                      </div>
                      <div className="bg-black/50 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-zinc-400 break-all select-all leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {embedCode}
                      </div>
                      <button 
                        onClick={handleCopyEmbed}
                        className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                          isEmbedCopied 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5'
                        }`}
                      >
                        {isEmbedCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                        {isEmbedCopied ? 'Embed Code Copied!' : 'Copy Embed Code'}
                      </button>
                    </motion.div>
                  )}

                  {activeShareTool === 'whatsapp' && (
                    <motion.div
                      key="whatsapp-panel"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 overflow-hidden text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <MessageCircle size={12} />
                          WhatsApp Outbound Gateway
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Dynamic routing</span>
                      </div>
                      
                      <form onSubmit={handleSendWhatsAppShare} className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Recipient Contact Number</label>
                          <input 
                            type="tel"
                            required
                            placeholder="e.g. +1 (555) 019-2834"
                            value={whatsappPhone}
                            onChange={(e) => setWhatsappPhone(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-zinc-600"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            disabled={isSendingWhatsAppShare || !whatsappPhone}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                              isWhatsAppShareSent
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-extrabold'
                              : 'bg-teal-500 hover:bg-teal-400 text-zinc-950 border-teal-500/20 disabled:opacity-30'
                            }`}
                          >
                            {isSendingWhatsAppShare ? (
                              <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                            ) : isWhatsAppShareSent ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <MessageCircle size={12} />
                            )}
                            {isSendingWhatsAppShare ? 'Dispatching...' : isWhatsAppShareSent ? 'Invite Dispatched!' : 'Simulate Message'}
                          </button>

                          <button 
                            type="button"
                            onClick={() => {
                              const cleanedPhone = whatsappPhone.replace(/[^0-9]/g, '');
                              const url = `https://api.whatsapp.com/send?${cleanedPhone ? `phone=${cleanedPhone}&` : ''}text=${encodeURIComponent(`Check out this live workspace: ${shareUrl}`)}`;
                              window.open(url, '_blank');
                            }}
                            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5 flex items-center justify-center gap-1.5"
                          >
                            <Globe size={12} />
                            Open Web
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeShareTool === 'publicurl' && (
                    <motion.div
                      key="publicurl-panel"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 overflow-hidden text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Globe size={12} />
                          Form Portal Endpoint
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Live Node</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        Access the responsive production-ready portal directly in a new window or distribute to customers globally.
                      </p>
                      <div className="flex gap-2">
                        <a 
                          href={window.location.origin} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10"
                        >
                          <Globe size={12} />
                          Launch Live Portal
                        </a>
                        <button 
                          onClick={handleShare}
                          className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-white/5 flex items-center justify-center gap-1.5"
                        >
                          <Copy size={12} />
                          Copy Link
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-teal-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pro Tip</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider font-medium">
                    Embed this form directly into your website using our lightweight JS snippet.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'agent' && (
              <motion.div 
                key="agent-controls"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-8"
              >
                <WorkflowAgent 
                  project={project}
                  items={items}
                  rule={rule}
                  onUpdateItems={setItems}
                  onUpdateRule={setRule}
                  onSimulateSubmissions={handleSimulateSubmissions}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Right: Preview Canvas */}
        <main className="flex-1 bg-black/40 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden relative">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <AnimatePresence mode="wait">
            <motion.div 
              key={deviceMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className={`
                bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700
                ${deviceMode === 'desktop' ? 'w-full max-w-4xl aspect-[16/10]' : 'w-full max-w-[375px] h-[667px] max-h-full'}
              `}
            >
              {/* Form Content */}
              <div className="h-full flex flex-col bg-zinc-50 text-zinc-900 overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-12 space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white mb-4">
                      <Zap size={24} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{context?.detectedType || 'Live Form'}</h1>
                    <p className="text-zinc-500">Please fill out the information below to complete your request.</p>
                  </div>

                  <div className="space-y-6">
                    {rule && (
                      <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-teal-600">
                          <Zap size={14} className="fill-teal-600" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Active Business Logic</span>
                        </div>
                        <p className="text-xs font-medium text-teal-800 leading-relaxed">
                          {rule.description}
                        </p>
                        {rule.logic && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            {Object.entries(rule.logic as any).map(([key, val]) => (
                              <div key={key} className="px-2 py-1 bg-white/50 rounded text-[9px] font-bold uppercase tracking-tighter text-teal-600 border border-teal-200">
                                {key}: {String(val)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {isCheckoutSuccess ? (
                      <div className="max-w-md mx-auto text-center space-y-6 py-12 animate-fade-in text-zinc-900">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 mb-2">
                          <CheckCircle2 size={40} className="stroke-[3]" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Order Placed!</h2>
                          <p className="text-sm text-zinc-500 font-medium">Your order has been sent to the kitchen. Get ready to indulge!</p>
                        </div>
                        <div className="p-4 bg-zinc-100 border border-zinc-200 rounded-2xl space-y-3 text-left font-mono text-xs">
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200 pb-2 flex justify-between">
                            <span>Receipt Details</span>
                            <span>#{Math.floor(Math.random() * 9000 + 1000)}</span>
                          </div>
                          {Object.entries(cart).map(([id, qty]) => {
                            const item = items.find(i => i.id === id);
                            if (!item) return null;
                            return (
                              <div key={id} className="flex justify-between text-zinc-600">
                                <span>{item.name} x {qty}</span>
                                <span>${(parseFloat(String(item.value).replace(/[^0-9.]/g, '')) * qty).toFixed(2)}</span>
                              </div>
                            );
                          })}
                          <div className="border-t border-zinc-200 pt-2 space-y-1 text-zinc-800">
                            {cartDiscount > 0 && (
                              <div className="flex justify-between text-emerald-600 text-[11px] font-bold">
                                <span>Rule Applied (15% Off):</span>
                                <span>-${cartDiscount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-sm">
                              <span>Paid Total:</span>
                              <span>${cartTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        {/* 🔗 Cafe/Food Stall Integrations Control Deck */}
                        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 text-left space-y-4">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} className="text-amber-500 animate-pulse" />
                            Active Restaurant POS Integrations
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={handlePrintReceipt}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 justify-center text-center ${isPrintingReceipt ? 'bg-zinc-100 border-zinc-300 text-zinc-500 animate-pulse' : printedReceipt ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'}`}
                            >
                              <span className="text-base">🖨️</span>
                              <span>{isPrintingReceipt ? "Printing..." : printedReceipt ? "Ticket Printed" : "Kitchen Ticket"}</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={handleSendWhatsApp}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 justify-center text-center ${whatsappSent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'}`}
                            >
                              <span className="text-base">💬</span>
                              <span>{whatsappSent ? "WhatsApp Sent!" : "WhatsApp Alert"}</span>
                            </button>
                          </div>

                          {/* 🧾 Live Thermal Receipt Preview */}
                          {printedReceipt && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-white border-2 border-dashed border-zinc-300 rounded-lg p-4 font-mono text-[10px] text-zinc-800 space-y-2 relative overflow-hidden shadow-sm"
                            >
                              <div className="absolute top-0 right-0 left-0 h-1 bg-zinc-200" />
                              <div className="text-center font-bold uppercase tracking-wider text-xs border-b border-zinc-200 pb-2">
                                *** KITCHEN ORDER TICKET ***
                              </div>
                              <div className="flex justify-between">
                                <span>DATE: {new Date().toLocaleDateString()}</span>
                                <span>TIME: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <div className="border-b border-zinc-200 py-1 space-y-1">
                                {Object.entries(cart).map(([id, qty]) => {
                                  const item = items.find(i => i.id === id);
                                  return item ? (
                                    <div key={id} className="flex justify-between font-bold">
                                      <span>* {item.name}</span>
                                      <span>QTY: {qty}</span>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                              <div className="text-center font-bold text-zinc-500 pt-1 text-[9px]">
                                SENT TO HOT-PLATE NODE B • STALL 04
                              </div>
                            </motion.div>
                          )}

                          {whatsappSent && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[10px] font-semibold flex items-center gap-2"
                            >
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                              <span>Simulated WhatsApp API dispatched successfully!</span>
                            </motion.div>
                          )}
                        </div>

                        <button 
                          onClick={() => { setCart({}); setIsCheckoutSuccess(false); setPrintedReceipt(false); setWhatsappSent(false); }} 
                          className="w-full py-3.5 rounded-xl text-white font-bold uppercase tracking-wider text-xs active:scale-95 transition-transform"
                          style={{ backgroundColor: accentColor }}
                        >
                          Order Something Else
                        </button>
                      </div>
                    ) : context?.isMenu ? (
                      /* Elegant Food Menu with Add to Cart Buttons */
                      <div className="space-y-8 text-zinc-900">
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={18} className="text-zinc-900" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Interactive Menu Card</h3>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">{menuFoodItems.length} Food/Beverage Items</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {menuFoodItems.map((item, idx) => {
                            const price = parseFloat(String(item.value).replace(/[^0-9.]/g, '')) || 0;
                            const qty = cart[item.id] || 0;
                            return (
                              <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-zinc-300 transition-all group">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-sm font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{item.name}</h4>
                                    <span className="text-sm font-bold text-zinc-900 shrink-0">${price.toFixed(2)}</span>
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">{item.description}</p>
                                  )}
                                  <span className="inline-block text-[9px] font-bold bg-zinc-100 text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded-md">
                                    {item.category}
                                  </span>
                                </div>

                                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Quantity</span>
                                  {qty > 0 ? (
                                    <div className="flex items-center gap-3 bg-zinc-100 rounded-lg p-1 border border-zinc-200">
                                      <button 
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-1 hover:bg-white rounded text-zinc-600 transition-colors"
                                      >
                                        <Minus size={12} />
                                      </button>
                                      <span className="text-xs font-bold text-zinc-800 w-4 text-center">{qty}</span>
                                      <button 
                                        type="button"
                                        onClick={() => addToCart(item.id)}
                                        className="p-1 hover:bg-white rounded text-zinc-600 transition-colors"
                                      >
                                        <Plus size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      type="button"
                                      onClick={() => addToCart(item.id)}
                                      className="px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5"
                                    >
                                      <Plus size={12} />
                                      Add to Cart
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Checkout Summary Section */}
                        {cartTotalItems > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-white border border-zinc-300 rounded-3xl shadow-xl space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                              <div className="flex items-center gap-2">
                                <ShoppingBag size={16} className="text-zinc-700" />
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-700">Checkout Cart Basket ({cartTotalItems})</h4>
                              </div>
                              <button type="button" onClick={() => setCart({})} className="text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600">Clear Cart</button>
                            </div>

                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                              {Object.entries(cart).map(([id, qty]) => {
                                const item = items.find(i => i.id === id);
                                if (!item) return null;
                                const price = parseFloat(String(item.value).replace(/[^0-9.]/g, '')) || 0;
                                return (
                                  <div key={id} className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-zinc-600">{item.name} <strong className="text-zinc-800">x{qty}</strong></span>
                                    <span className="text-zinc-900 font-bold">${(price * qty).toFixed(2)}</span>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs font-medium">
                              <div className="flex justify-between text-zinc-500">
                                <span>Basket Subtotal:</span>
                                <span>${cartSubtotal.toFixed(2)}</span>
                              </div>
                              {cartDiscount > 0 ? (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                  <span>Rule Applied (15% Off):</span>
                                  <span>-${cartDiscount.toFixed(2)}</span>
                                </div>
                              ) : rule ? (
                                <div className="flex justify-between text-zinc-400 text-[10px] italic">
                                  <span>* Add ${(rule.threshold - cartSubtotal).toFixed(2)} more for 15% discount!</span>
                                </div>
                              ) : null}
                              <div className="flex justify-between text-sm font-bold pt-2 border-t border-zinc-100">
                                <span>Total Price:</span>
                                <span className="text-base text-zinc-900">${cartTotal.toFixed(2)}</span>
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setIsCheckoutSuccess(true)}
                              className="w-full py-4 rounded-2xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                              style={{ backgroundColor: accentColor, boxShadow: `0 10px 20px -5px ${accentColor}40` }}
                            >
                              <ShoppingCart size={14} />
                              Complete Checkout • ${cartTotal.toFixed(2)}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    ) : context?.detectedType === "College Form" ? (
                      /* 🎓 Dynamic College Form Application Hub */
                      <div className="space-y-6 text-zinc-900 animate-fade-in">
                        {enrollmentSubmitted ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 text-white rounded-3xl p-6 text-center space-y-6"
                          >
                            <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto">
                              <GraduationCap size={32} />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold tracking-tight">Application Submitted!</h3>
                              <p className="text-xs text-zinc-400 font-mono">Royal Academic Admission Portal</p>
                            </div>
                            
                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left font-mono text-xs space-y-3">
                              <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-500 uppercase">Student Name:</span>
                                <span className="font-bold text-white">{items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Student'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Applied Stream:</span>
                                <span className="text-white">{selectedStream}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Grade Percentile:</span>
                                <span className="text-teal-400 font-bold">{gradePercentage}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Tuition Fees:</span>
                                <span className="text-white">
                                  {gradePercentage >= 90 ? (
                                    <span>$10,800 <span className="text-[10px] text-teal-400 font-semibold">(10% Merit Discount Applied)</span></span>
                                  ) : "$12,000"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Hostel Assigned:</span>
                                <span className="text-white">{hostelRequired ? "YES (Tier 1 Priority)" : "NO"}</span>
                              </div>
                            </div>

                            {/* 🔗 College Admissions Integrations Hub */}
                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left space-y-4">
                              <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                <Database size={10} />
                                Active Admissions Integration Hub
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={handleSheetsSync}
                                  disabled={isSyncingSheets}
                                  className={`p-3 rounded-xl border border-white/10 text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${isSyncingSheets ? 'bg-white/5 text-zinc-400 animate-pulse' : isSheetsSynced ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                  <Database size={14} />
                                  <span>{isSyncingSheets ? "Syncing..." : isSheetsSynced ? "Synced to Sheets" : "Sync Google Sheets"}</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleBookSlot("July 12, 10:00 AM")}
                                  disabled={isScheduling}
                                  className={`p-3 rounded-xl border border-white/10 text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${isScheduling ? 'bg-white/5 text-zinc-400 animate-pulse' : scheduledSlot ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                  <Calendar size={14} />
                                  <span>{isScheduling ? "Booking..." : scheduledSlot ? "Interview Booked" : "Schedule Interview"}</span>
                                </button>
                              </div>

                              {/* Spreadsheet Row preview */}
                              {isSheetsSynced && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-2 text-[11px] font-mono text-teal-300"
                                >
                                  <div className="flex justify-between text-[9px] text-teal-500 font-bold uppercase">
                                    <span>Google Sheets Live Row</span>
                                    <span>Sync Status: OK</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-1.5 text-zinc-300">
                                    <div>
                                      <span className="text-[9px] text-zinc-500 uppercase block">Student Name</span>
                                      <span className="truncate block font-bold">{items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Student'}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-zinc-500 uppercase block">Stream</span>
                                      <span className="truncate block">{selectedStream.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-zinc-500 uppercase block">Tuition Status</span>
                                      <span className="truncate block text-teal-400 font-bold">${gradePercentage >= 90 ? "10,800" : "12,000"}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {scheduledSlot && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-1 text-[11px] text-indigo-300 font-mono"
                                >
                                  <span className="text-[9px] text-indigo-500 font-bold uppercase block">Google Calendar Invitation Dispatch</span>
                                  <p className="text-zinc-300">Successfully locked interview slot: <strong className="text-indigo-400">{scheduledSlot}</strong>. Confirmation invite emailed to applicant!</p>
                                </motion.div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => { setEnrollmentSubmitted(false); setIsSheetsSynced(false); setScheduledSlot(null); }}
                              className="w-full py-3 bg-teal-400 hover:bg-teal-500 text-zinc-950 font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
                            >
                              Edit details & re-submit
                            </button>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                              <GraduationCap size={20} className="text-zinc-800" />
                              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Enrollment Portal Control Desk</h3>
                            </div>

                            {/* Main Admission Info Card */}
                            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Student Applicant</label>
                                <p className="text-base font-bold text-zinc-900">
                                  {items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Sanya Sharma'}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stream choice</label>
                                  <select 
                                    value={selectedStream}
                                    onChange={(e) => setSelectedStream(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-bold focus:outline-none"
                                  >
                                    <option value="Computer Science Engineering">Computer Science (CSE)</option>
                                    <option value="Mechanical Engineering">Mechanical Eng (ME)</option>
                                    <option value="Business Administration">Business (BBA)</option>
                                    <option value="Literature">Literature (BA)</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Admission Rating</label>
                                  <div className="flex items-center gap-1.5 text-xs font-bold mt-2">
                                    <Award size={14} className="text-amber-500" />
                                    <span>{gradePercentage >= 90 ? "Excellent Match" : "Standard Review"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Grade slider */}
                              <div className="space-y-2 pt-2 border-t border-zinc-100">
                                <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Academic Grade Score</label>
                                  <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{gradePercentage}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="60" 
                                  max="100" 
                                  step="0.5"
                                  value={gradePercentage}
                                  onChange={(e) => setGradePercentage(parseFloat(e.target.value))}
                                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                                <p className="text-[10px] text-zinc-400">Adjust Grade Score slider to dynamically compute merit discounts.</p>
                              </div>

                              {/* Hostel toggle */}
                              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                <div className="space-y-0.5">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hostel Lodging Required</label>
                                  <p className="text-[11px] text-zinc-400">Toggle student campus accommodation request</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setHostelRequired(!hostelRequired)}
                                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${hostelRequired ? 'bg-teal-500' : 'bg-zinc-300'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hostelRequired ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                              </div>
                            </div>

                            {/* Pricing Box based on calculations */}
                            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 rounded-2xl p-4 space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Fee structure breakdown</h4>
                              <div className="space-y-1.5 text-xs text-zinc-600 font-medium">
                                <div className="flex justify-between">
                                  <span>Annual Base Tuition:</span>
                                  <span>$12,000.00</span>
                                </div>
                                {gradePercentage >= 90 ? (
                                  <div className="flex justify-between text-teal-600 font-bold bg-teal-500/10 p-2 rounded border border-teal-500/20">
                                    <span className="flex items-center gap-1">🏆 10% Merit Scholarship:</span>
                                    <span>-$1,200.00</span>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-zinc-400 py-1 italic">
                                    * Score above 90% grade to unlock a 10% merit tuition discount ($1,200 savings)!
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Hostel Fee:</span>
                                  <span>{hostelRequired ? "$2,500.00" : "$0.00"}</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-900">
                                  <span>Net Payable Fees:</span>
                                  <span>${((gradePercentage >= 90 ? 10800 : 12000) + (hostelRequired ? 2500 : 0)).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setEnrollmentSubmitted(true)}
                              className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 text-xs"
                              style={{ backgroundColor: accentColor, boxShadow: `0 10px 20px -5px ${accentColor}40` }}
                            >
                              Submit Admission Application
                            </button>
                          </div>
                        )}
                      </div>
                    ) : context?.detectedType === "Medical Intake" ? (
                      /* 🏥 Clinical Patient Triage Portal */
                      <div className="space-y-6 text-zinc-900 animate-fade-in">
                        {medicalSubmitted ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-900 text-white rounded-3xl p-6 text-center space-y-6"
                          >
                            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                              <HeartPulse size={32} />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold tracking-tight">Clinic Intake Certified!</h3>
                              <p className="text-xs text-zinc-400">Patient Chart Registered successfully</p>
                            </div>
                            
                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left font-mono text-xs space-y-3">
                              <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-500 uppercase">Patient Name:</span>
                                <span className="font-bold text-white">{items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Vaibhav Kanojia'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">DOB:</span>
                                <span className="text-white">{items.find(i => i.name.toLowerCase().includes('birth'))?.value || '1998-05-14'}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-zinc-500 uppercase block">Medical Allergies:</span>
                                <p className="text-rose-300 font-bold bg-rose-500/10 p-1.5 rounded border border-rose-500/20">{patientAllergies || "None declared"}</p>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500 uppercase">Copay Received:</span>
                                <span className={`font-bold ${isCopayVerified ? 'text-emerald-400' : 'text-amber-400'}`}>{isCopayVerified ? "$35.00 (Insurance Approved)" : "Manual Verification Needed"}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-white/10 text-teal-300 font-bold text-[11px]">
                                <span>Wait-Room Assignment:</span>
                                <span>Care Area Room 3C</span>
                              </div>
                            </div>

                            {/* 🔗 Clinical Health EHR / HL7 FHIR Integration Hub */}
                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left space-y-4">
                              <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                <Activity size={10} className="animate-pulse" />
                                Active EHR clinical Integrations
                              </h4>
                              
                              <button
                                type="button"
                                onClick={handleExportFhir}
                                disabled={isExportingFhir}
                                className={`w-full p-3 rounded-xl border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 ${isExportingFhir ? 'bg-white/5 text-zinc-400 animate-pulse' : fhirPayload ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                              >
                                <Code size={14} />
                                <span>{isExportingFhir ? "Structuring HL7 Resource..." : fhirPayload ? "HL7 FHIR JSON Structured!" : "Export Patient HL7 FHIR Payload"}</span>
                              </button>

                              {fhirPayload && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-[9px] text-zinc-300 space-y-1 overflow-x-auto max-h-48 custom-scrollbar"
                                >
                                  <div className="flex justify-between text-teal-400 font-bold border-b border-white/5 pb-1 text-[8px] tracking-wider uppercase">
                                    <span>FHIR Patient Resource Mockup</span>
                                    <span>Schema: RFC-7159</span>
                                  </div>
                                  <pre className="pt-1.5 leading-relaxed">{fhirPayload}</pre>
                                </motion.div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => { setMedicalSubmitted(false); setFhirPayload(null); }}
                              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
                            >
                              Edit details
                            </button>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                              <HeartPulse size={20} className="text-rose-500" />
                              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Apex Patient Intake Hub</h3>
                            </div>

                            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Patient Full Name</label>
                                <p className="text-sm font-bold text-zinc-900">{items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Vaibhav Kanojia'}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date of Birth</label>
                                  <p className="text-xs text-zinc-700 font-semibold">{items.find(i => i.name.toLowerCase().includes('birth'))?.value || '1998-05-14'}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Emergency Contact</label>
                                  <p className="text-xs text-zinc-700 font-semibold">{items.find(i => i.name.toLowerCase().includes('contact'))?.value || 'Aarav Kanojia'}</p>
                                </div>
                              </div>

                              {/* Interactive Allergies Editor */}
                              <div className="space-y-2 pt-3 border-t border-zinc-100">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Drug or food Allergies</label>
                                <textarea 
                                  value={patientAllergies}
                                  onChange={(e) => setPatientAllergies(e.target.value)}
                                  placeholder="List any drug, environmental, or food allergies..."
                                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400"
                                  rows={2}
                                />
                                {(patientAllergies.toLowerCase().includes('penicillin') || patientAllergies.toLowerCase().includes('peanut')) && (
                                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-[11px] font-medium leading-relaxed">
                                    <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                                    <div>
                                      <strong className="text-rose-800 block">Critical Allergy Flag!</strong>
                                      Penicillin/Peanut detected. Triggering priority wristband protocol.
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Copay simulator */}
                              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                <div className="space-y-0.5">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Insurance Copay Amount paid ($35.00)</label>
                                  <p className="text-[11px] text-zinc-400">Check to verify the payment is cleared by banking gateway</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsCopayVerified(!isCopayVerified)}
                                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${isCopayVerified ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isCopayVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setMedicalSubmitted(true)}
                              className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                              style={{ backgroundColor: accentColor, boxShadow: `0 10px 20px -5px ${accentColor}40` }}
                            >
                              <HeartPulse size={14} />
                              Certify Clinic Admission Chart
                            </button>
                          </div>
                        )}
                      </div>
                    ) : context?.detectedType === "Operations Checklist" ? (
                      /* 📋 Compliance Audit Terminal */
                      <div className="space-y-6 text-zinc-900 animate-fade-in">
                        {checklistSubmitted ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 text-white rounded-3xl p-6 text-center space-y-6"
                          >
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                              <FileCheck size={32} />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-bold tracking-tight">Checklist Certified!</h3>
                              <p className="text-xs text-zinc-400 font-mono">Daily Compliance Report Filed</p>
                            </div>

                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left font-mono text-xs space-y-3">
                              <div className="flex justify-between border-b border-white/10 pb-2 text-zinc-400 text-[10px]">
                                <span>AUDIT CLASSIFICATION</span>
                                <span>PASSED CERTIFIED</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Safety Tasks:</span>
                                <span>{Object.values(checklistStates).filter(Boolean).length} / {Object.keys(checklistStates).length} Passed</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Fridge Temp:</span>
                                <span className={fridgeTemp <= 38 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {fridgeTemp}°F ({fridgeTemp <= 38 ? "SAFE" : "CRITICAL DANGER"})
                                </span>
                              </div>
                              <div className="pt-2 border-t border-white/10 text-xs font-bold text-zinc-300">
                                {fridgeTemp <= 38 && Object.values(checklistStates).filter(Boolean).length >= 3 ? (
                                  <span className="text-emerald-400 flex items-center gap-1">✅ 100% compliant store rating.</span>
                                ) : (
                                  <span className="text-amber-400 flex items-center gap-1">⚠️ Store audit flagged for manual follow-up.</span>
                                )}
                              </div>
                            </div>

                            {/* 🔗 Safety & Store Audit Compliance Integrations Hub */}
                            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 text-left space-y-4">
                              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                <FileCheck size={10} className="animate-pulse" />
                                Store Compliance Dispatch Node
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={handleCompilePdf}
                                  disabled={isCompilingPdf}
                                  className={`p-3 rounded-xl border border-white/10 text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${isCompilingPdf ? 'bg-white/5 text-zinc-400 animate-pulse' : compiledPdfUrl ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                  <FileText size={14} />
                                  <span>{isCompilingPdf ? "Compiling PDF..." : compiledPdfUrl ? "Audit PDF Ready" : "Compile Audit PDF"}</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={handleSlackBroadcast}
                                  disabled={slackBroadcasted}
                                  className={`p-3 rounded-xl border border-white/10 text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${slackBroadcasted ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                  <MessageCircle size={14} />
                                  <span>{slackBroadcasted ? "Slack Notified!" : "Slack HQ Broadcast"}</span>
                                </button>
                              </div>

                              {compiledPdfUrl && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-2 text-[11px] font-mono text-teal-300 flex items-center justify-between"
                                >
                                  <div className="space-y-0.5 pr-2">
                                    <span className="text-[9px] text-teal-500 font-bold uppercase block">compliance_audit_log.pdf</span>
                                    <span className="text-zinc-400 text-[10px] block truncate max-w-[120px]">Ready for inspector upload</span>
                                  </div>
                                  <button onClick={(e) => {e.preventDefault(); alert("Simulating secure local file download...");}} className="px-2.5 py-1 bg-teal-400 text-zinc-950 rounded text-[10px] font-bold uppercase hover:bg-teal-500 transition-colors shrink-0">Download</button>
                                </motion.div>
                              )}

                              {slackBroadcasted && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1 text-[11px] text-emerald-300 font-mono"
                                >
                                  <span className="text-[9px] text-emerald-500 font-bold uppercase block">Slack Webhook Sent</span>
                                  <p className="text-zinc-300">Daily store compliance log was broadcasted successfully to <strong className="text-emerald-400">#ops-safety-alerts</strong>!</p>
                                </motion.div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => { setChecklistSubmitted(false); setCompiledPdfUrl(false); setSlackBroadcasted(false); }}
                              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
                            >
                              Edit checklist details
                            </button>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                              <div className="flex items-center gap-2">
                                <ClipboardList size={20} className="text-zinc-800" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Operational Compliance terminal</h3>
                              </div>
                              <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">
                                {Object.values(checklistStates).filter(Boolean).length} / {Object.keys(checklistStates).length} Checks
                              </span>
                            </div>

                            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Interactive Audit Checkpoints</label>
                                {items.filter(item => item.type === 'boolean' || String(item.value).toLowerCase() === 'true' || String(item.value).toLowerCase() === 'false').map(item => {
                                  const isChecked = !!checklistStates[item.id];
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setChecklistStates(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                      className="w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group hover:shadow-sm"
                                      style={{ 
                                        borderColor: isChecked ? `${accentColor}80` : '#e4e4e7',
                                        backgroundColor: isChecked ? `${accentColor}05` : '#ffffff' 
                                      }}
                                    >
                                      <span className="text-xs font-bold text-zinc-800 leading-tight pr-4">{item.name}</span>
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 group-hover:border-zinc-400 bg-white'}`}>
                                        {isChecked && <Plus size={12} className="rotate-45" />}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Interactive temperature gauge if present */}
                              <div className="space-y-3 pt-4 border-t border-zinc-100">
                                <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Refrigeration Temperature</label>
                                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${fridgeTemp <= 38 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'}`}>
                                    {fridgeTemp}°F
                                  </span>
                                </div>
                                <input 
                                  type="range" 
                                  min="30" 
                                  max="45" 
                                  value={fridgeTemp}
                                  onChange={(e) => setFridgeTemp(parseInt(e.target.value))}
                                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                                />
                                {fridgeTemp > 38 ? (
                                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-[11px] font-medium leading-relaxed">
                                    <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="text-rose-800 block">Critical Bacterial Danger Zone!</strong>
                                      Refrigerator temperature is currently above the mandatory safe threshold of 38°F. Spoilage danger active!
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-zinc-400">✅ Storage is kept in optimal cooling threshold.</p>
                                )}
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => setChecklistSubmitted(true)}
                              className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
                              style={{ backgroundColor: accentColor, boxShadow: `0 10px 20px -5px ${accentColor}40` }}
                            >
                              <CheckCircle2 size={14} />
                              Certify Store Inspection Log
                            </button>
                          </div>
                        )}
                      </div>
                    ) : context?.detectedType === "Candidate Resume / CV" ? (
                      /* 💼 Candidate Screener Console */
                      <div className="space-y-6 text-zinc-900 animate-fade-in">
                        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                          <Briefcase size={20} className="text-zinc-800" />
                          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">HR Candidate Review Board</h3>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                          <div className="flex items-start justify-between gap-4 text-left">
                            <div className="space-y-1">
                              <h4 className="text-base font-bold text-zinc-900">{items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Jane Doe'}</h4>
                              <p className="text-xs text-zinc-500 font-medium">{items.find(i => i.name.toLowerCase().includes('education'))?.value || 'MSc. Computer Science'}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full shrink-0">
                              {items.find(i => i.name.toLowerCase().includes('experience'))?.value || '5 Years'}
                            </span>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-zinc-100 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Extracted Core Skills</label>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {["React", "Node.js", "PyTorch", "SQL", "Cloud Architecture"].map((skill, sIdx) => (
                                <span key={sIdx} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg border border-zinc-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Recruiter Evaluation Slider */}
                          <div className="space-y-3 pt-3 border-t border-zinc-100 text-left">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Recruiter Match Evaluation</label>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, rIdx) => (
                                  <Star 
                                    key={rIdx} 
                                    size={14} 
                                    onClick={() => setInterviewScore(rIdx + 1)}
                                    className={`cursor-pointer transition-colors ${rIdx < interviewScore ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Recruiter Custom Notes */}
                          <div className="space-y-2 pt-3 border-t border-zinc-100 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Recruiter Notes</label>
                            <textarea 
                              value={recruiterNotes}
                              onChange={(e) => setRecruiterNotes(e.target.value)}
                              placeholder="Write screening notes for this candidate profile..."
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400 font-sans"
                              rows={2}
                            />
                          </div>

                          {/* Fast track slider */}
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-left">
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fast-Track Technical Screening</label>
                              <p className="text-[11px] text-zinc-400">Instantly flag candidate for immediate manager panel</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setResumeFastTracked(!resumeFastTracked)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${resumeFastTracked ? 'bg-indigo-500' : 'bg-zinc-300'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${resumeFastTracked ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>

                        {resumeFastTracked && (
                          <div className="space-y-4">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-800 text-xs font-medium leading-relaxed text-left"
                            >
                              🎉 <strong>Fast-Track Protocol Engaged:</strong> This applicant has been added to the Priority Hiring Queue.
                            </motion.div>

                            {/* 🔗 HR Automation & Candidate Engagement Integrations Hub */}
                            <div className="bg-white border border-zinc-200 rounded-2xl p-4 text-left space-y-4">
                              <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                <Mail size={10} className="animate-pulse" />
                                Active ATS & Outreach Integrations
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const name = items.find(i => i.name.toLowerCase().includes('name'))?.value || 'Jane Doe';
                                    setEmailSubject(`Interview Invitation - VibeShift Senior Engineer Role`);
                                    setEmailBody(`Hi ${name},\n\nWe were highly impressed by your experience and core skills. We have fast-tracked your application!\n\nCan you connect for a 30-min technical panel this week?\n\nBest,\nRecruiting Team`);
                                    setEmailStatus('draft');
                                  }}
                                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${emailStatus === 'sent' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : emailStatus === 'draft' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'}`}
                                >
                                  <Mail size={14} />
                                  <span>{emailStatus === 'sent' ? "Email Sent!" : emailStatus === 'draft' ? "Review Draft" : "Draft Outreach"}</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleBookSlot("Thursday, 2:00 PM")}
                                  disabled={isScheduling}
                                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${scheduledSlot ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'}`}
                                >
                                  <Calendar size={14} />
                                  <span>{isScheduling ? "Booking..." : scheduledSlot ? "Interview Booked" : "Schedule Panel"}</span>
                                </button>
                              </div>

                              {emailStatus === 'draft' && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 space-y-2 text-xs"
                                >
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Subject:</span>
                                    <input 
                                      type="text" 
                                      value={emailSubject}
                                      onChange={(e) => setEmailSubject(e.target.value)}
                                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Message Body:</span>
                                    <textarea 
                                      value={emailBody}
                                      onChange={(e) => setEmailBody(e.target.value)}
                                      className="w-full bg-white border border-zinc-200 rounded p-2 text-[11px] font-mono leading-relaxed focus:outline-none"
                                      rows={5}
                                    />
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={handleSendEmail}
                                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all"
                                  >
                                    Send Invitation via Gmail API
                                  </button>
                                </motion.div>
                              )}

                              {emailStatus === 'sent' && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[10px] font-semibold flex items-center gap-2"
                                >
                                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                  <span>Outreach dispatch confirmed. Track invitation in GMail Sent folder!</span>
                                </motion.div>
                              )}

                              {scheduledSlot && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-[11px] text-indigo-800 font-mono"
                                >
                                  <span className="text-[9px] text-indigo-500 font-bold uppercase block">Google Calendar Invitation Dispatch</span>
                                  <p className="text-zinc-600">Successfully locked interview slot: <strong className="text-indigo-600">{scheduledSlot}</strong>. Confirmation invite emailed to candidate!</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}

                        <button 
                          type="button"
                          onClick={() => { setResumeFastTracked(true); }}
                          className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                          <UserCheck size={14} />
                          {resumeFastTracked ? "Candidate Approved!" : "Approve & Fast-Track Candidate"}
                        </button>
                      </div>
                    ) : context?.detectedType === "Newspaper Article / Media" ? (
                      /* 📰 Interactive News Reader clipping */
                      <div className="space-y-6 text-zinc-900 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen size={20} className="text-zinc-800" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Media Clipping Reader</h3>
                          </div>
                          
                          {/* Font Size Selector */}
                          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-[10px] font-bold">
                            <button 
                              type="button"
                              onClick={() => setSelectedFontScale('small')}
                              className={`px-2 py-0.5 rounded transition-all ${selectedFontScale === 'small' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                              A
                            </button>
                            <button 
                              type="button"
                              onClick={() => setSelectedFontScale('medium')}
                              className={`px-2 py-0.5 rounded transition-all ${selectedFontScale === 'medium' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                              A+
                            </button>
                            <button 
                              type="button"
                              onClick={() => setSelectedFontScale('large')}
                              className={`px-2 py-0.5 rounded transition-all ${selectedFontScale === 'large' ? 'bg-white text-zinc-800 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                              A++
                            </button>
                          </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 text-left">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Headline clipping</span>
                            <h2 className="text-lg font-bold text-zinc-900 leading-snug">
                              {items.find(i => i.name.toLowerCase().includes('headline'))?.value || 'Sovereign AI Breakthroughs Transform Healthcare Automation'}
                            </h2>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                              <span>Published: {items.find(i => i.name.toLowerCase().includes('date'))?.value || '2026-07-01'}</span>
                              <span className="w-1 h-1 rounded-full bg-zinc-200" />
                              <span>By {items.find(i => i.name.toLowerCase().includes('author'))?.value || 'Aarav Gupta'}</span>
                            </div>
                          </div>

                          <div className="border-t border-b border-zinc-100 py-4">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Article Body summary</span>
                            <p className="text-zinc-700 leading-relaxed font-serif" style={{ fontSize: selectedFontScale === 'small' ? '12px' : selectedFontScale === 'medium' ? '14px' : '16px' }}>
                              The integration of <strong className="text-amber-600 bg-amber-500/10 px-1 rounded font-sans font-medium">artificial intelligence</strong> into local healthcare automation continues to mark an inflection point. Industry analysts predict that leveraging these extracted workflows can reduce clinical administrative load by upwards of 40%. The report contains multiple custom telemetry charts mapping this automation trend.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Extracted Tags</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {["artificial intelligence", "clinical medicine", "computer vision"].map((tag, tIdx) => (
                                <span key={tIdx} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-100 uppercase tracking-wider">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 🔗 Media Accessibility & AI Translation Integrations Hub */}
                        <div className="bg-white border border-zinc-200 rounded-2xl p-4 text-left space-y-4 animate-fade-in">
                          <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                            <Languages size={10} />
                            Media Outreach & Accessibility Node
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (ttsPlaying) {
                                  setTtsPlaying(false);
                                  setTtsProgress(0);
                                } else {
                                  setTtsPlaying(true);
                                  setTtsProgress(5);
                                }
                              }}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 justify-center text-center ${ttsPlaying ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'}`}
                            >
                              <Volume2 size={14} className={ttsPlaying ? "animate-bounce" : ""} />
                              <span>{ttsPlaying ? "Pause Audio" : "Listen (AI Voice)"}</span>
                            </button>
                            
                            <div className="relative">
                              <select 
                                value={currentLanguage}
                                onChange={(e) => {
                                  setCurrentLanguage(e.target.value);
                                }}
                                className="w-full h-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none appearance-none text-center cursor-pointer text-zinc-800 hover:bg-zinc-100 pr-8"
                              >
                                <option value="english">🇺🇸 English</option>
                                <option value="hindi">🇮🇳 Hindi / हिंदी</option>
                                <option value="spanish">🇪🇸 Spanish</option>
                                <option value="french">🇫🇷 French / François</option>
                                <option value="japanese">🇯🇵 Japanese / 日本語</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                <Languages size={12} />
                              </div>
                            </div>
                          </div>

                          {ttsPlaying && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2 text-xs"
                            >
                              <div className="flex justify-between items-center text-[10px] font-bold text-amber-800 uppercase tracking-widest font-mono">
                                <span className="flex items-center gap-1">🔊 Speech Synthesizer Node</span>
                                <span>{ttsProgress}% Read</span>
                              </div>
                              <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
                                <motion.div 
                                  className="bg-amber-500 h-full" 
                                  style={{ width: `${ttsProgress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <p className="text-[11px] text-zinc-600 font-serif italic">"The integration of artificial intelligence into local healthcare automation continues to..."</p>
                            </motion.div>
                          )}

                          {currentLanguage !== 'english' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-teal-800 font-serif leading-relaxed"
                            >
                              <span className="text-[9px] text-teal-600 font-bold uppercase block font-sans mb-1">AI Cloud Translation Pipeline Match</span>
                              {currentLanguage === 'hindi' && "स्थानीय स्वास्थ्य सेवा स्वचालन में कृत्रिम बुद्धिमत्ता का एकीकरण एक महत्वपूर्ण मोड़ का प्रतीक बना हुआ है..."}
                              {currentLanguage === 'spanish' && "La integración de la inteligencia artificial en la automatización de la salud de la comunidad continúa marcando un hito..."}
                              {currentLanguage === 'french' && "L'intégration de l'intelligence artificielle dans l'automatisation des soins de santé locaux continue de marquer un tournant..."}
                              {currentLanguage === 'japanese' && "ローカルヘルスケア自動化への人工知能の統合は、転換点を示し続けています..."}
                            </motion.div>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setArticleLiked(!articleLiked)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border ${articleLiked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                          >
                            <HeartPulse size={14} className={articleLiked ? "fill-rose-600" : ""} />
                            {articleLiked ? "Liked" : "Like clipping"}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setArticleSaved(!articleSaved)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 text-white`}
                            style={{ backgroundColor: accentColor }}
                          >
                            <Sparkles size={14} />
                            {articleSaved ? "Saved to Library!" : "Save Clipping"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Default Form Rendering */
                      <div className="space-y-6">
                        {items.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">{item.name}</label>
                            <input 
                              type="text" 
                              placeholder={String(item.value)}
                              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                              style={{ '--tw-ring-color': accentColor } as any}
                            />
                          </div>
                        ))}

                        <button 
                          className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-95"
                          style={{ backgroundColor: accentColor, boxShadow: `0 10px 20px -5px ${accentColor}40` }}
                        >
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-zinc-100 flex items-center justify-center gap-2 opacity-40">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Powered by</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-zinc-900 rounded flex items-center justify-center text-white">
                        <Zap size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-900 tracking-tight">VibeShift</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Success Toast */}
          <AnimatePresence>
            {showShareSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-500 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-2xl shadow-emerald-500/40"
              >
                <CheckCircle2 size={16} />
                Link Copied to Clipboard
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default FormPreview;
