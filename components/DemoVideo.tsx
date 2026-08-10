import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Shield, FileText, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DemoVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [activePhase, setActivePhase] = useState<'upload' | 'scan' | 'map' | 'ready'>('upload');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play and handle animation loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop back
          }
          return prev + 0.5; // Smooth progression
        });
      }, 50);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Map progress to phases
  useEffect(() => {
    if (progress < 25) {
      setActivePhase('upload');
    } else if (progress < 60) {
      setActivePhase('scan');
    } else if (progress < 85) {
      setActivePhase('map');
    } else {
      setActivePhase('ready');
    }
  }, [progress]);

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseFloat(e.target.value));
  };

  const getPhaseTitle = () => {
    switch (activePhase) {
      case 'upload':
        return 'Uploading & Normalizing Document';
      case 'scan':
        return 'Gemini AI Vision OCR Scanning';
      case 'map':
        return 'Structure Extraction & Type Inference';
      case 'ready':
        return 'Digital Interactive Form Generated';
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a0c] flex flex-col justify-between relative select-none font-sans overflow-hidden">
      {/* Visual Canvas Area */}
      <div className="flex-1 w-full relative flex items-center justify-center p-6 md:p-12 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-blue-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <AnimatePresence mode="wait">
          {activePhase === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center space-y-6 text-center max-w-md"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-20 h-24 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center">
                  <FileText size={40} className="text-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight">intake-form-handwritten.pdf</h3>
                <p className="text-xs text-zinc-400 font-mono">Size: 1.4 MB | Scanning DPI: 300</p>
              </div>
              
              {/* Fake progress bar */}
              <div className="w-64 bg-zinc-800 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-violet-600 h-full transition-all duration-100 ease-out"
                  style={{ width: `${(progress / 25) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-blue-400 animate-pulse uppercase tracking-wider">
                Ingesting Document Source...
              </span>
            </motion.div>
          )}

          {activePhase === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-[4/3] bg-zinc-900 rounded-2xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
                {/* Laser scan bar */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_#3b82f6] z-10"
                  style={{ 
                    top: `${Math.sin((progress - 25) * 0.3) * 45 + 50}%`,
                    transition: 'top 50ms linear'
                  }}
                />

                {/* Simulated Document Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Source View (DPI Checked)</span>
                    <span className="text-[10px] font-mono text-blue-400">OCR Confidence: 99.8%</span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <p className="text-sm font-mono text-zinc-400">Name: <span className="text-white bg-blue-500/10 border border-blue-500/30 px-1 rounded select-all font-sans">John Doe</span></p>
                      <div className="absolute -inset-1 bg-blue-500/5 border border-blue-500/20 rounded opacity-60" />
                    </div>
                    
                    <div className="relative group">
                      <p className="text-sm font-mono text-zinc-400">Email: <span className="text-white bg-blue-500/10 border border-blue-500/30 px-1 rounded select-all font-sans">john.doe@gmail.com</span></p>
                      <div className="absolute -inset-1 bg-blue-500/5 border border-blue-500/20 rounded opacity-60" />
                    </div>

                    <div className="relative group">
                      <p className="text-sm font-mono text-zinc-400">Phone: <span className="text-white bg-blue-500/10 border border-blue-500/30 px-1 rounded select-all font-sans">+1 (555) 234-5678</span></p>
                      <div className="absolute -inset-1 bg-blue-500/5 border border-blue-500/20 rounded opacity-60" />
                    </div>

                    <div className="relative group">
                      <p className="text-sm font-mono text-zinc-400">Symptoms: <span className="text-white bg-blue-500/10 border border-blue-500/30 px-1 rounded select-all font-sans">Mild fever and persistent cough...</span></p>
                      <div className="absolute -inset-1 bg-blue-500/5 border border-blue-500/20 rounded opacity-60" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-4">
                  <Sparkles size={12} className="animate-spin text-blue-400" />
                  Gemini-powered Vision OCR active
                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl h-full flex items-center justify-center gap-6"
            >
              {/* Left Side: Original */}
              <div className="flex-1 aspect-[3/4] bg-zinc-950/80 rounded-2xl border border-white/5 p-4 flex flex-col justify-between opacity-40">
                <div className="h-4 w-1/2 bg-white/10 rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="h-8 w-full bg-white/5 rounded-lg border border-dashed border-white/10" />
              </div>

              {/* Connected Glow Laser Line */}
              <div className="flex flex-col items-center text-blue-500">
                <Zap size={24} className="animate-bounce" />
                <span className="text-[8px] font-bold tracking-widest uppercase text-blue-400 mt-1">Inference</span>
              </div>

              {/* Right Side: Mapping to modern React form inputs */}
              <div className="flex-1 aspect-[3/4] bg-zinc-900 rounded-2xl border border-blue-500/30 p-4 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute inset-0 bg-blue-500/[0.01] rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-blue-500/20 rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="h-2 w-16 bg-zinc-600 rounded" />
                      <div className="h-8 w-full bg-white/5 border border-blue-500/30 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-zinc-300">John Doe</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-zinc-600 rounded" />
                      <div className="h-8 w-full bg-white/5 border border-blue-500/30 rounded-lg flex items-center px-3">
                        <span className="text-[10px] text-zinc-300">john.doe@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-full bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-600/30">
                  Form Generated
                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center space-y-6 text-center max-w-lg"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
                  <CheckCircle2 size={44} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Interactive Workflow Live!</h3>
                <p className="text-sm text-zinc-400 max-w-sm">
                  The messy paper intake form has been compiled into a beautiful, secure, mobile-friendly dashboard form instantly.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Shield size={12} className="text-green-400" />
                  HIPAA Secure
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300 flex items-center gap-1.5 font-medium">
                  <Zap size={12} className="text-blue-400 fill-blue-400" />
                  Accuracy: 99.9%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Player Timeline & Controls Header */}
      <div className="bg-zinc-950/90 border-t border-white/5 px-4 py-3 flex flex-col gap-2 backdrop-blur-md">
        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            LIVE SIMULATION DEMO
          </span>
          <span className="text-blue-400 font-mono font-bold uppercase">
            {getPhaseTitle()}
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="relative flex items-center h-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress}
            onChange={handleTimelineChange}
            className="w-full accent-blue-500 bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer focus:outline-none"
          />
          <div 
            className="absolute left-0 bg-gradient-to-r from-blue-500 to-violet-600 h-1 rounded-lg pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
            </button>
            <button 
              onClick={() => setProgress(0)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:scale-105"
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
            
            <div className="text-xs font-mono text-zinc-400 select-none">
              {`0:${Math.floor(progress * 0.2).toString().padStart(2, '0')}`} <span className="text-zinc-600">/</span> 0:20
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-[9px] font-bold text-zinc-400 tracking-wider">
              1080p HD
            </div>
            <button className="p-1.5 text-zinc-400 hover:text-white transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;
