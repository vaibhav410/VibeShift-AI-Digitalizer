import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Zap, 
  Shield, 
  Smartphone, 
  ArrowUpRight, 
  CheckCircle2, 
  Play, 
  X, 
  Sparkles, 
  Database, 
  Code, 
  Layers, 
  Activity, 
  Check, 
  Users, 
  Cpu 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DemoVideo from './DemoVideo';
import ThreeDCard from './ThreeDCard';
import ThreeDStage from './ThreeDStage';
import VibeShiftLogo from './VibeShiftLogo';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('annually');

  // Trust logos mock data
  const TRUST_LOGOS = [
    { name: "OpenAI", logo: "OpenAI" },
    { name: "stripe", logo: "stripe" },
    { name: "wise", logo: "wise" },
    { name: "Retool", logo: "Retool" },
    { name: "Medium", logo: "Medium" },
    { name: "loom", logo: "loom" },
    { name: "Cash App", logo: "Cash App" },
    { name: "Linear", logo: "Linear" }
  ];

  // Bento Features Grid Data
  const BENTO_FEATURES = [
    {
      title: "AI-powered form scanning.",
      desc: "Get real-time, smart suggestions for cleaner, optimal digital form layouts.",
      preview: (
        <div className="relative w-full h-24 bg-black/50 rounded-xl border border-white/5 p-3 overflow-hidden font-mono text-[9px] text-zinc-500">
          <div className="flex justify-between items-center text-[10px] text-zinc-300 border-b border-white/5 pb-1 mb-2">
            <span>OCR_SCAN_ENG</span>
            <span className="text-emerald-400 font-bold">CONF: 99.9%</span>
          </div>
          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <span className="text-blue-400">{"{"}</span>
              <span>type: "Patient Intake"</span>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <span className="text-blue-400">fields:</span>
              <span className="bg-emerald-500/15 text-emerald-400 px-1 rounded">["fullName", "dob", "allergies"]</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-blue-400">{"}"}</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] text-zinc-400 border border-white/10">
            Applying Changes...
          </div>
        </div>
      )
    },
    {
      title: "Real-time document previews.",
      desc: "Scan documents, extract parameters, and instantly preview responsive layouts together.",
      preview: (
        <div className="relative w-full h-24 bg-black/50 rounded-xl border border-white/5 p-3 overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-7 rounded bg-zinc-900 border border-white/5 p-1.5 flex flex-col justify-center">
              <div className="h-1 w-8 bg-zinc-500 rounded mb-1" />
              <div className="h-1.5 w-12 bg-white/10 rounded" />
            </div>
            <div className="h-7 rounded bg-zinc-900 border border-white/5 p-1.5 flex flex-col justify-center">
              <div className="h-1 w-6 bg-zinc-500 rounded mb-1" />
              <div className="h-1.5 w-16 bg-white/10 rounded" />
            </div>
          </div>
          <div className="mt-2 h-7 rounded bg-emerald-400 flex items-center justify-center text-[9px] font-bold text-black uppercase tracking-wider">
            Add to macOS
          </div>
        </div>
      )
    },
    {
      title: "One-click integrations.",
      desc: "Easily connect your extracted digital workflows with popular dev tools & platforms.",
      preview: (
        <div className="w-full h-24 bg-black/40 rounded-xl border border-white/5 p-2.5 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-2 w-full max-w-[200px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors hover:border-white/20">
                {i === 1 && <Database size={12} className="text-emerald-400" />}
                {i === 2 && <Shield size={12} className="text-blue-400" />}
                {i === 3 && <Layers size={12} className="text-violet-400" />}
                {i === 4 && <Smartphone size={12} className="text-fuchsia-400" />}
                {i > 4 && <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Flexible custom parameters.",
      desc: "Effortlessly manage, refine, and configure active business rules and alert systems.",
      preview: (
        <div className="w-full h-24 bg-black/50 rounded-xl border border-white/5 p-3 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>Search for actions</span>
            <span className="text-[8px] bg-zinc-800 px-1 rounded border border-white/10">⌘K</span>
          </div>
          <div className="h-8 bg-zinc-900/80 border border-white/5 rounded-lg px-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-white font-mono">Trigger Care Alert</span>
            </div>
            <span className="text-[8px] text-emerald-400 uppercase tracking-widest font-bold">Enabled</span>
          </div>
        </div>
      )
    },
    {
      title: "Launch parallel OCR engines.",
      desc: "Solve high-volume ingestion challenges faster with multiple AI processing units.",
      preview: (
        <div className="w-full h-24 bg-black/50 rounded-xl border border-white/5 p-3 flex flex-col justify-center">
          <div className="p-2 bg-zinc-900/90 border border-white/5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">System Update</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden">
              <div className="h-full w-2/3 bg-emerald-400 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Deployment made easy.",
      desc: "Go from scanned physical forms to a live, reactive, secure application in seconds.",
      preview: (
        <div className="w-full h-24 bg-black/60 rounded-xl border border-white/5 p-2 font-mono text-[8px] text-zinc-500 overflow-hidden space-y-1">
          <div>[01:07:45] Running build on Vercel Edge Runtime...</div>
          <div className="text-emerald-400 font-bold">[01:07:46] Build succeeded successfully.</div>
          <div>[01:07:47] Provisioning secure database nodes...</div>
          <div className="text-blue-400">[01:07:47] Applet live at: standard-ingress-3000</div>
        </div>
      )
    }
  ];

  // Testimonials tweets grid
  const TWEETS_FEED = [
    {
      text: "The real-time code suggestions from Pointer feel like having a senior engineer reviewing every line of code as you write. The accuracy of its recommendations has improved our overall code quality, reduced review time.",
      name: "Annette Black",
      handle: "@grey",
      avatarBg: "bg-teal-500/20 text-teal-400",
      highlight: true
    },
    {
      text: "Pointer's multi-agent coding feature has been a game changer. We're fixing complex bugs in hours instead of spending entire sprints on them.",
      name: "Cameron Williamson",
      handle: "@B2J",
      avatarBg: "bg-purple-500/20 text-purple-400"
    },
    {
      text: "Collaborative coding feels effortless now. With Pointer's real-time previews, pair programming has become faster and more productive.",
      name: "Cody Fisher",
      handle: "@apple",
      avatarBg: "bg-blue-500/20 text-blue-400"
    },
    {
      text: "We no longer juggle multiple tools. Pointer brought all our integrations together in one place, which simplified our entire workflow.",
      name: "Robert Fox",
      handle: "@MasterCard",
      avatarBg: "bg-amber-500/20 text-amber-400"
    },
    {
      text: "Integrating Pointer into our stack was smooth, and the MCP server connections saved us days of configuration work.",
      name: "Devon Lane",
      handle: "@McDonalds",
      avatarBg: "bg-red-500/20 text-red-400"
    },
    {
      text: "We started with the free plan just to test it out, but within a week we upgraded to Pro. Now, we can't imagine coding without it.",
      name: "Darlene Robertson",
      handle: "@lucid",
      avatarBg: "bg-pink-500/20 text-pink-400"
    },
    {
      text: "Deploying on Vercel with Pointer was not just simple, it felt seamless. We went from coding to seeing our changes live in minutes without worrying about build pipelines or configuration issues.",
      name: "Albert Flores",
      handle: "@LouisVuitton",
      avatarBg: "bg-cyan-500/20 text-cyan-400",
      large: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-teal-500/30 overflow-x-hidden font-sans">
      
      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowDemo(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-[#0d0d0f] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-zinc-800 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
              <DemoVideo />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <VibeShiftLogo size="md" />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400 tracking-wider uppercase">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors font-bold text-teal-400">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>

          <button 
            onClick={onStart} 
            className="bg-white text-black hover:bg-zinc-200 transition-colors font-bold px-4 py-1.5 rounded-full text-xs shadow-lg tracking-tight"
          >
            Try for Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Pointer Ambient Glow background */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-teal-500/10 blur-[130px] -z-10 rounded-full animate-pulse" />
        <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Removed badge */}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7.5xl font-extrabold tracking-tight leading-[1.05] text-white"
          >
            Unleash the Power <br />
            of <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">AI Agents</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Accelerate your development workflow with intelligent AI agents that write, review, and optimize your code. Turn paper forms into reactive digital apps instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={onStart} 
              className="bg-white text-black hover:bg-zinc-200 transition-colors font-bold px-8 py-3.5 rounded-full text-sm shadow-xl shadow-teal-500/10 cursor-pointer"
            >
              Signup for free
            </button>
            <button 
              onClick={() => setShowDemo(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-semibold px-8 py-3.5 rounded-full text-sm flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white"
            >
              <Play size={14} className="fill-white text-white" />
              Watch Demo video
            </button>
          </motion.div>

          {/* Luxury 3D Stage Presentation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-10"
          >
            <ThreeDStage />
          </motion.div>

          {/* Trusted Startup Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 text-center space-y-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Trusted by fast-growing startups</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale filter invert brightness-200">
              {TRUST_LOGOS.map((logo, idx) => (
                <div key={idx} className="flex items-center gap-1 font-bold text-sm tracking-tight text-white">
                  {logo.name === "stripe" && <span className="font-extrabold lowercase text-lg">stripe</span>}
                  {logo.name === "wise" && <span className="italic font-black">wise</span>}
                  {logo.name === "OpenAI" && <span className="font-mono tracking-widest">OPENAI</span>}
                  {logo.name === "Retool" && <span className="font-semibold text-xs border border-white px-1.5 py-0.5 rounded">RETOOL</span>}
                  {logo.name !== "stripe" && logo.name !== "wise" && logo.name !== "OpenAI" && logo.name !== "Retool" && <span>{logo.name}</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid section: "Empower Your Workflow with AI" */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Empower Your Workflow with AI
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Ask your AI Agent for real-time collaboration, seamless integrations, and actionable insights to streamline your operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feature, idx) => (
              <ThreeDCard key={idx} className="h-full">
                <div className="bg-[#0b0b0d]/50 hover:bg-[#0e0e11]/80 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl p-6 h-full flex flex-col justify-between space-y-6 transition-all duration-300">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                  {feature.preview}
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* Guillermo Rauch Testimonial Quote Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-[#070709] to-[#050505] relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-xl md:text-3xl font-bold tracking-tight text-white leading-relaxed max-w-3xl mx-auto">
            "Pointer's real-time previews cut our debugging time in half and made coding collaboratively actually enjoyable."
          </p>
          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-zinc-950 font-black text-xs">
              GR
            </div>
            <div>
              <p className="text-xs font-bold text-white">Guillermo Rauch</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">CEO, Vercel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-black/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Pricing built for every developer
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Choose a plan that fits your coding workflow, from individuals starting out to growing professionals and large organizations.
            </p>

            {/* Toggle Annually / Monthly */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="bg-zinc-900 border border-white/5 p-1 rounded-full flex items-center relative">
                <button
                  onClick={() => setBillingPeriod('annually')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    billingPeriod === 'annually' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Annually
                </button>
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    billingPeriod === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Card */}
            <div className="bg-[#0b0b0d]/80 border border-white/5 rounded-2xl p-8 flex flex-col justify-between space-y-8 hover:border-white/10 transition-colors">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Free</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-xs text-zinc-500">/month</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Perfect for individuals starting their journey.</p>
                </div>
                <button 
                  onClick={onStart}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Get Started
                </button>
                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Get started today:</p>
                  {[
                    "Real-time code suggestions",
                    "Basic integration logs",
                    "Single database connection",
                    "Sync to 5 active workflows",
                    "Virtual sandboxes"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Check size={14} className="text-zinc-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Card (Vibrant Mint/Teal Pointer Style) */}
            <div className="bg-[#5eead4] text-zinc-950 rounded-2xl p-8 flex flex-col justify-between space-y-8 shadow-[0_20px_50px_rgba(94,234,212,0.15)] relative transform md:-translate-y-2 z-10 border-2 border-[#5eead4]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-zinc-950 text-[#5eead4] border border-[#5eead4]/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Pro</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-zinc-950">
                      {billingPeriod === 'annually' ? '$12' : '$16'}
                    </span>
                    <span className="text-xs text-zinc-700 font-bold">/month</span>
                  </div>
                  <p className="text-xs text-zinc-800 mt-2 font-medium">Ideal for professional developers and startups.</p>
                </div>
                <button 
                  onClick={onStart}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 text-white transition-colors py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Join now
                </button>
                <div className="space-y-3.5 pt-4 border-t border-zinc-950/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800">Everything in Free +</p>
                  {[
                    "Advanced real-time engines",
                    "Unlimited integrations with custom logos",
                    "Multiple database connections",
                    "Sync to 50 concurrent workflows",
                    "Collaborative editor with team chat",
                    "Advanced version control integrations",
                    "Priority email and chat support"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-900 font-medium">
                      <Check size={14} className="text-zinc-950 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ultra Card */}
            <div className="bg-[#0b0b0d]/80 border border-white/5 rounded-2xl p-8 flex flex-col justify-between space-y-8 hover:border-white/10 transition-colors">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Ultra</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-white">
                      {billingPeriod === 'annually' ? '$128' : '$160'}
                    </span>
                    <span className="text-xs text-zinc-500">/month</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Tailored solutions for teams and corporations.</p>
                </div>
                <button 
                  onClick={onStart}
                  className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Talk to Sales
                </button>
                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Everything in Pro +</p>
                  {[
                    "Dedicated account support",
                    "Unlimited concurrent sessions",
                    "Unlimited active engines",
                    "Enterprise-grade security and compliance",
                    "Priority deployments and SLA guarantees"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Check size={14} className="text-zinc-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Review Feed */}
      <section id="testimonials" className="py-24 px-6 border-t border-white/5 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Coding made effortless
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              How developers ship products faster, collaborate seamlessly, and build with confidence using Pointer's powerful AI tools.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-6xl mx-auto">
            {TWEETS_FEED.map((tweet, idx) => (
              <div 
                key={idx} 
                className={`break-inside-avoid inline-block w-full mb-6 rounded-2xl p-6 border transition-all duration-300 ${
                  tweet.highlight 
                    ? 'bg-[#5eead4] text-zinc-950 border-[#5eead4] shadow-[0_15px_40px_rgba(94,234,212,0.1)]' 
                    : 'bg-[#0b0b0d]/60 text-zinc-300 border-white/5 hover:border-white/10'
                }`}
              >
                <p className={`text-xs leading-relaxed ${tweet.highlight ? 'text-zinc-900 font-medium' : 'text-zinc-300'}`}>
                  "{tweet.text}"
                </p>
                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-current/10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    tweet.highlight ? 'bg-zinc-950 text-white' : tweet.avatarBg
                  }`}>
                    {tweet.name[0]}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${tweet.highlight ? 'text-zinc-950' : 'text-white'}`}>
                      {tweet.name}
                    </h4>
                    <p className={`text-[10px] ${tweet.highlight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      {tweet.handle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-xs">
          <div className="flex items-center gap-3">
            <VibeShiftLogo size="sm" />
            <span className="font-semibold text-zinc-400">VibeShift AI Platform</span>
          </div>
          <p className="text-center md:text-left">© 2026 VibeShift AI. Built with premium Pointer interface architecture.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
