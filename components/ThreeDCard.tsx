import React, { useRef, useState } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({ 
  children, 
  className = '', 
  intensity = 10 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation angles based on cursor offset from center
    const rx = ((centerY - y) / centerY) * intensity;
    const ry = ((x - centerX) / centerX) * -intensity; // Negative so it tilts towards the cursor
    
    setRotateX(rx);
    setRotateY(ry);

    // Dynamic specular highlight gradient position
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setShineStyle({
      opacity: 0.12,
      background: `radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    // Smooth reset
    setRotateX(0);
    setRotateY(0);
    setShineStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular highlights for physical light reflection */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-20" 
        style={shineStyle}
      />
      {children}
    </div>
  );
};

export default ThreeDCard;
