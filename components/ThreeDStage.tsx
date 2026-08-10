import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Shield, Sparkles, Database, Terminal, Cpu } from 'lucide-react';
import DemoVideo from './DemoVideo';

export const ThreeDStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for luxury-level dampening
  const springConfig = { damping: 30, stiffness: 100, mass: 0.8 };
  const rotateXSpring = useSpring(x, springConfig);
  const rotateYSpring = useSpring(y, springConfig);

  // Map mouse positions to rotational angles
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-20, 20]);

  // Handle cursor tracking inside stage bounding box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coordinates (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeY);
    y.set(relativeX);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly spring back to initial elegant display angle
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-10 flex items-center justify-center select-none"
      style={{ perspective: 1500 }}
    >
      {/* 3D Animated Showcase Canvas */}
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 8,
          rotateY: isHovered ? rotateY : -12,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-4xl aspect-video rounded-3xl bg-[#09090b]/80 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out p-1 md:p-2"
      >
        {/* Ambient 3D Backlight Halo */}
        <div 
          className="absolute -inset-8 bg-gradient-to-tr from-blue-500/20 via-violet-500/10 to-emerald-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500"
          style={{ 
            transform: 'translateZ(-60px)',
            opacity: isHovered ? 0.9 : 0.6 
          }}
        />

        {/* Outer Tech Bezel Rim */}
        <div 
          className="absolute inset-0 rounded-[22px] border-2 border-white/5 pointer-events-none" 
          style={{ transform: 'translateZ(2px)' }}
        />

        {/* Embedded Interactive Video Stage */}
        <div 
          className="relative w-full h-full rounded-[18px] overflow-hidden bg-black/95 shadow-inner"
          style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}
        >
          <DemoVideo />
        </div>

        {/* Floating 3D Badge 1: HIPAA SECURE (Deep Layer Parallax Z=80px) */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 -left-6 md:-left-12 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-3 z-30"
          style={{ 
            transform: 'translateZ(80px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield size={16} />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Compliance</div>
            <div className="text-xs font-bold text-white">HIPAA Secure</div>
          </div>
        </motion.div>

        {/* Floating 3D Badge 2: GEMINI COGNITION (Deep Layer Parallax Z=100px) */}
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-6 -right-6 md:-right-12 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-3 z-30"
          style={{ 
            transform: 'translateZ(100px)',
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cognition Engine</div>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1">
              Gemini Pro
            </div>
          </div>
        </motion.div>

        {/* Floating 3D Stats Sidebar (Mid Layer Parallax Z=50px) */}
        <motion.div
          className="absolute top-1/4 -right-8 md:-right-20 hidden lg:flex flex-col gap-2 p-3 rounded-xl bg-black/80 border border-white/5 backdrop-blur-md shadow-xl"
          style={{ 
            transform: 'translateZ(50px)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500">
            <Cpu size={10} className="text-blue-500" /> SYSTEM STATUS
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center gap-6">
              <span className="text-[9px] text-zinc-400 font-mono">LATENCY</span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">12ms</span>
            </div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-[9px] text-zinc-400 font-mono">ACCURACY</span>
              <span className="text-[9px] text-blue-400 font-mono font-bold">99.9%</span>
            </div>
          </div>
        </motion.div>

        {/* Floating 3D Database Badge (Mid Layer Parallax Z=60px) */}
        <motion.div
          className="absolute bottom-1/4 -left-8 md:-left-16 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-white/5 backdrop-blur-md shadow-xl"
          style={{ 
            transform: 'translateZ(60px)',
          }}
        >
          <Database size={12} className="text-violet-400" />
          <span className="text-[9px] font-mono font-bold text-zinc-300">AUTO-SQL SYNCHRONIZED</span>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ThreeDStage;
