import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Mic } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  label?: string;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  accept = "image/*", 
  label = "Upload Document",
  maxFiles = 1
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const isAudio = accept.includes('audio');

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          flex flex-col items-center justify-center gap-4 text-center
          ${isDragging ? 'border-zinc-400 bg-zinc-900/50' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/30'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
        />
        
        <div className="p-3 bg-zinc-900 rounded-xl text-zinc-400">
          {isAudio ? <Mic size={24} /> : <Upload size={24} />}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
            {isAudio ? 'WAV, MP3, M4A' : 'PDF, JPG, PNG'} • MAX 10MB
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-zinc-800 rounded text-zinc-400">
                  <FileText size={14} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-zinc-300 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-600 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
