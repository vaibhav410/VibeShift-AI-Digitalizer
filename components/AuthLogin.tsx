
import React, { useState } from 'react';
import { Command, Lock, ArrowRight, ShieldCheck, Mail, AlertCircle } from 'lucide-react';

interface AuthLoginProps {
  onLogin: () => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Validation: Only allow gmail.com
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Access Restricted: Only authorized @gmail.com accounts allowed.');
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans text-slate-100">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] mb-6">
             <Command className="text-white" size={32} />
           </div>
           <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">VibeShift</h1>
           <p className="text-slate-400">Enterprise Process Digitalization</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-500 delay-100">
          <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-3">
                 <AlertCircle className="text-red-400 shrink-0" size={20} />
                 <p className="text-red-200 text-sm">{error}</p>
               </div>
             )}

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="text-slate-500" size={18} />
                 </div>
                 <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                    placeholder="name@gmail.com"
                 />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Lock className="text-slate-500" size={18} />
                 </div>
                 <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                    placeholder="••••••••"
                 />
               </div>
             </div>

             <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
             >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
             </button>
          </form>
        </div>
        
        <div className="mt-8 text-center flex items-center justify-center space-x-2 text-emerald-500/80 text-xs font-medium bg-emerald-500/10 py-2 px-4 rounded-full mx-auto w-fit border border-emerald-500/20">
           <ShieldCheck size={14} />
           <span>End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
