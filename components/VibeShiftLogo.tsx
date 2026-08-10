import React from 'react';
import { motion } from 'motion/react';

interface VibeShiftLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const VibeShiftLogo: React.FC<VibeShiftLogoProps> = ({ 
  className = '', 
  iconOnly = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'gap-1.5',
      icon: 'w-6 h-6 rounded-md',
      logoText: 'text-base',
      subtext: 'text-[7px]'
    },
    md: {
      container: 'gap-2',
      icon: 'w-8 h-8 rounded-lg',
      logoText: 'text-xl',
      subtext: 'text-[9px]'
    },
    lg: {
      container: 'gap-3',
      icon: 'w-12 h-12 rounded-xl',
      logoText: 'text-2xl',
      subtext: 'text-xs'
    },
    xl: {
      container: 'gap-4',
      icon: 'w-16 h-16 rounded-2xl',
      logoText: 'text-4xl',
      subtext: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className} select-none`}>
      {/* Custom Icon Mark based on upload */}
      <div className="relative flex-shrink-0">
        <div className={`relative ${currentSize.icon} bg-[#0df5c4] flex items-center justify-center overflow-hidden shadow-[0_2px_10px_rgba(13,245,196,0.15)]`}>
          {/* Clean Sharp Lightning Bolt */}
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-[50%] h-[50%] text-zinc-950"
          >
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
          </svg>
          
          {/* Subtle shine sweep for extra premium feel */}
          <motion.div 
            animate={{
              left: ['-100%', '200%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.5
            }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </div>
      </div>

      {/* Typography brand wordmark */}
      {!iconOnly && (
        <div className="flex flex-col text-left">
          <div className={`${currentSize.logoText} font-sans font-extrabold tracking-tight leading-none text-white flex items-center`}>
            <span>Vibe</span>
            <span className="font-semibold">Shift</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeShiftLogo;
