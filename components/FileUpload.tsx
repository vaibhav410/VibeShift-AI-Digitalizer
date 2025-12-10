import React, { useRef, useState } from 'react';
import { FileAudio, FileImage, CheckCircle, X, UploadCloud, Sparkles } from 'lucide-react';
import { FileType } from '../types';

interface FileUploadProps {
  type: FileType;
  onUpload: (file: File) => void;
  label: string;
  subLabel: string;
  currentFile?: File | null;
  onRemove?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ type, onUpload, label, subLabel, currentFile, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file) return;
    if (type === 'image' && !file.type.startsWith('image/')) return alert('Image files only.');
    if (type === 'audio' && !file.type.startsWith('audio/')) return alert('Audio files only.');
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const hasFile = !!currentFile;

  return (
    <div 
      className={`relative glass-card rounded-2xl p-10 cursor-pointer transition-all duration-300 group
        ${isDragging 
          ? 'border-violet-500/50 bg-violet-900/20 neon-glow' 
          : 'border-slate-800 hover:border-violet-500/30 hover:bg-slate-800/40'}
        ${hasFile ? 'border-emerald-500/30 bg-emerald-950/20' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
        className="hidden" 
        accept={type === 'image' ? "image/*" : "audio/*"}
      />
      
      {/* Decorative background blur */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none
          ${type === 'image' ? 'from-violet-600 to-blue-600' : 'from-fuchsia-600 to-pink-600'}
      `}></div>
      
      {hasFile && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-full transition-colors z-10 border border-slate-700 hover:border-red-500/30"
        >
          <X size={18} />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center text-center space-y-5">
        {hasFile ? (
           <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full"></div>
              <div className="text-emerald-400 bg-emerald-500/10 p-5 rounded-full mb-2 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300">
                <CheckCircle size={32} />
              </div>
           </div>
        ) : (
          <div className={`p-5 rounded-full transition-all duration-500 relative
            ${type === 'image' 
              ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
              : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]'}`}>
             {type === 'image' ? <UploadCloud size={32} /> : <FileAudio size={32} />}
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-slate-100 tracking-tight flex items-center justify-center gap-2">
            {hasFile ? currentFile.name : label}
            {!hasFile && <Sparkles size={16} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            {hasFile ? 'Click to replace' : subLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
