import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Trash2, 
  BarChart3, 
  Eye, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users,
  Layout,
  FileText,
  ShieldCheck,
  Smartphone,
  ArrowUpRight,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DemoVideo from './DemoVideo';
import ThreeDCard from './ThreeDCard';

import { Project as ProjectType } from '../types';

interface Project extends ProjectType {
  icon?: any;
  color?: string;
}

const projects: Project[] = [
  { 
    id: '1', 
    title: 'Student Registration', 
    type: 'College Form', 
    responses: 1284, 
    status: 'active', 
    lastEdited: '2h ago', 
    icon: FileText, 
    color: 'blue',
    context: {
      detectedType: "College Form",
      appTitle: "Royal Academic Admission Portal",
      actionButtonLabel: "Apply for Enrollment",
      summaryLabel: "Admission Status Score",
      layoutType: "form",
      confidence: 0.99
    },
    items: [
      { id: "col1", name: "Student Full Name", value: "Sanya Sharma", category: "Academic Credentials", type: "text" },
      { id: "col2", name: "Applying Stream", value: "Computer Science Engineering", category: "Enrollment Choices", type: "text" },
      { id: "col3", name: "Previous Grade Percentage", value: "94.5", category: "Academic Credentials", type: "number" },
      { id: "col4", name: "Contact Phone Number", value: "+91 98765 43210", category: "Contact Details", type: "text" },
      { id: "col5", name: "Requires Hostel Facility", value: "true", category: "Facilities", type: "boolean" }
    ],
    rule: {
      type: "threshold_discount",
      threshold: 90,
      benefitValue: 10,
      originalText: "Students with grades above 90% receive automatic 10% merit discount on tuition."
    }
  },
  { 
    id: '2', 
    title: 'Patient Intake', 
    type: 'Hospital Record', 
    responses: 856, 
    status: 'active', 
    lastEdited: '5h ago', 
    icon: ShieldCheck, 
    color: 'violet',
    context: {
      detectedType: "Medical Intake",
      appTitle: "Apex Patient Portal",
      actionButtonLabel: "Submit Patient Chart",
      summaryLabel: "Co-pay Due Today",
      layoutType: "form",
      confidence: 0.98
    },
    items: [
      { id: "p1", name: "Full Name", value: "Vaibhav Kanojia", category: "Personal Details", type: "text" },
      { id: "p2", name: "Date of Birth", value: "1998-05-14", category: "Personal Details", type: "date" },
      { id: "p3", name: "Inherent Allergies", value: "Peanuts, Penicillin", category: "Medical History", type: "textarea" },
      { id: "p4", name: "Emergency Contact", value: "Aarav Kanojia", category: "Emergency Contact", type: "text" },
      { id: "p5", name: "Emergency Phone", value: "+1 (555) 381-4902", category: "Emergency Contact", type: "text" },
      { id: "p6", name: "First-time Patient", value: "true", category: "Insurance Verification", type: "boolean" },
      { id: "p7", name: "Copay Amount Paid", value: "35.00", category: "Insurance Verification", type: "currency" }
    ],
    rule: {
      type: "threshold_action",
      threshold: 50,
      benefitValue: 0,
      originalText: "Emergency patients are prioritized automatically.",
      actionName: "Trigger Care Alert"
    }
  },
  { 
    id: '3', 
    title: 'Dinner Menu', 
    type: 'Restaurant Menu', 
    responses: 42, 
    status: 'paused', 
    lastEdited: '1d ago', 
    icon: Smartphone, 
    color: 'fuchsia',
    context: {
      detectedType: "Cafe Catalog",
      appTitle: "VibeShift Espresso Lab",
      actionButtonLabel: "Place Checkout Order",
      summaryLabel: "Order Subtotal",
      layoutType: "catalog",
      isMenu: true,
      confidence: 0.97
    },
    items: [
      { id: "c1", name: "Nitro Cold Brew", value: "4.85", category: "Beverages", type: "currency" },
      { id: "c2", name: "Vanilla Sweet Cream Macchiato", value: "5.50", category: "Beverages", type: "currency" },
      { id: "c3", name: "Smoked Salmon Bagel", value: "9.25", category: "Artisanal Foods", type: "currency" },
      { id: "c4", name: "Avocado Sourdough Toast", value: "8.00", category: "Artisanal Foods", type: "currency" },
      { id: "c5", name: "Extra Espresso Shot", value: "1.50", category: "Add-ons", type: "currency" },
      { id: "c6", name: "Rewards Member Discount Eligible", value: "true", category: "Customer Rewards", type: "boolean" }
    ],
    rule: {
      type: "threshold_discount",
      threshold: 20,
      benefitValue: 15,
      originalText: "Orders over $20 automatically get a 15% discount applied at checkout."
    }
  },
  { 
    id: '4', 
    title: 'Feedback Survey', 
    type: 'General Form', 
    responses: 0, 
    status: 'draft', 
    lastEdited: '3d ago', 
    icon: Layout, 
    color: 'emerald',
    context: {
      detectedType: "General Form",
      appTitle: "VibeShift Feedback Terminal",
      actionButtonLabel: "Submit Feedback",
      summaryLabel: "Overall Score",
      layoutType: "form",
      confidence: 0.95
    },
    items: [
      { id: "f1", name: "Customer Name", value: "Aarav Gupta", category: "Customer Details", type: "text" },
      { id: "f2", name: "Satisfaction Level", value: "9", category: "Feedback Score", type: "number" },
      { id: "f3", name: "Key Recommendations", value: "The visual interface and automated voice summaries are outstanding.", category: "Comments", type: "textarea" },
      { id: "f4", name: "Subscribe to Newsletter", value: "true", category: "Preferences", type: "boolean" }
    ],
    rule: null
  }
];

interface ProjectsPageProps {
  projects: ProjectType[];
  onNewProject: () => void;
  onSelectProject: (p: ProjectType) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects: initialProjects, onNewProject, onSelectProject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const allProjects = [...initialProjects, ...projects.filter(p => !initialProjects.some(ip => ip.id === p.id))];

  const filteredProjects = allProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold tracking-tight">My Projects</h2>
          <p className="text-sm text-zinc-500 font-medium">Manage and monitor your AI-generated workflows.</p>
        </div>

        <button onClick={onNewProject} className="btn-primary px-8 py-3">
          <Plus size={20} />
          Create New Form
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto">
          {['all', 'active', 'paused', 'draft'].map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {status}
            </button>
          ))}
        </div>
        <button className="btn-secondary py-3 px-4 text-xs uppercase tracking-widest">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Demo Video Section */}
      <div className="glass-card p-8 bg-gradient-to-br from-teal-500/5 to-violet-500/5 border-teal-500/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
               <Zap size={12} className="fill-teal-400 text-teal-400" />
               Tutorial
            </div>
            <h3 className="text-2xl font-display font-bold tracking-tight">How VibeShift Works</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Watch this quick guide to see how you can transform any paper document into a live digital workflow in under 30 seconds using our advanced AI engine.
            </p>
            <div className="flex flex-col gap-3">
               {[
                 "Upload or scan any document",
                 "AI extracts fields and logic",
                 "Publish and share instantly"
               ].map((step, i) => (
                 <div key={i} className="flex items-center gap-3 text-xs font-medium text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500">{i+1}</div>
                    {step}
                 </div>
               ))}
             </div>
          </div>
          <ThreeDCard intensity={15} className="w-full">
            <div 
              onClick={() => setShowVideoModal(true)}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer h-full"
            >
               {/* High-fidelity CSS/SVG Scanning Mockup */}
               <div className="absolute inset-0 bg-[#0c0c10] flex flex-col justify-between p-5 font-mono text-[10px] text-zinc-500 overflow-hidden select-none">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                     <span className="flex items-center gap-1.5 text-teal-400 font-bold tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
                        </span>
                        GEMINI VISION ENG
                     </span>
                     <span className="text-zinc-600">CONF: 99.9%</span>
                  </div>
                  <div className="space-y-2 py-3">
                     <div className="h-2 w-3/4 bg-white/5 rounded animate-pulse" />
                     <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                     <div className="h-2 w-5/6 bg-white/5 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                  {/* Scanner bar animation */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_15px_#2dd4bf] animate-bounce top-1/2" />
                  <div className="flex justify-between items-center text-[9px] text-zinc-600 border-t border-white/5 pt-1.5">
                     <span>FPS: 60.0</span>
                     <span>LATENCY: 12ms</span>
                  </div>
               </div>
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors animate-fade-in" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-teal-400 flex items-center justify-center text-zinc-950 shadow-xl shadow-teal-400/20 group-hover:scale-110 transition-transform">
                     <BarChart3 size={24} />
                  </div>
               </div>
            </div>
          </ThreeDCard>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project, i) => {
          const colorClass = project.color || 'blue';
          return (
            <ThreeDCard key={project.id} className="h-full flex flex-col">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card glass-card-hover group flex flex-col h-full w-full justify-between"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 bg-teal-500/10 rounded-2xl text-teal-400 group-hover:scale-110 transition-transform duration-500`}>
                      {(() => {
                        const IconComponent = project.icon || FileText;
                        return typeof IconComponent === 'function' || typeof IconComponent === 'object' ? <IconComponent size={24} /> : <FileText size={24} />;
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : project.status === 'paused' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-zinc-500 border border-white/5'}`}>
                        {project.status === 'active' ? <CheckCircle2 size={10} /> : project.status === 'paused' ? <Clock size={10} /> : <AlertCircle size={10} />}
                        {project.status}
                      </div>
                      <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight group-hover:text-teal-400 transition-colors">{project.title}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{project.type}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{project.responses}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Responses</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{project.lastEdited}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Last Edited</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onSelectProject(project as any)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-teal-400 transition-colors" title="Analytics">
                      <BarChart3 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors" title="Duplicate">
                      <Copy size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <button onClick={() => onSelectProject(project as any)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors">
                    View Details
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </motion.div>
            </ThreeDCard>
          );
        })}


        {/* Create New Card */}
        <ThreeDCard className="h-full">
          <button 
            onClick={onNewProject}
            className="glass-card border-dashed border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all flex flex-col items-center justify-center p-12 gap-4 group h-full w-full"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-teal-400 group-hover:text-zinc-950 transition-all duration-500">
              <Plus size={24} />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-bold uppercase tracking-widest">Create New Form</p>
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">Start from a document</p>
            </div>
          </button>
        </ThreeDCard>
      </div>

      {/* Empty State Simulation */}
      {filteredProjects.length === 0 && (
        <div className="py-20 text-center space-y-6">
          <div className="inline-flex p-6 bg-white/5 rounded-full text-zinc-600">
            <Search size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No projects found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">We couldn't find any projects matching your search criteria. Try adjusting your filters or create a new form.</p>
          </div>
          <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="btn-secondary mx-auto">
            Clear All Filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-zinc-800 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
              <DemoVideo />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
