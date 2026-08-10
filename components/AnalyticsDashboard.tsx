import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeft,
  Filter, 
  Download, 
  Calendar, 
  Search, 
  MoreVertical, 
  ChevronRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion } from 'motion/react';

const heatmapData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 320 },
  { name: 'Sun', value: 210 },
];

const funnelData = [
  { name: 'Step 1', value: 100 },
  { name: 'Step 2', value: 85 },
  { name: 'Step 3', value: 70 },
  { name: 'Step 4', value: 45 },
];

const completionData = [
  { name: 'Completed', value: 75 },
  { name: 'Abandoned', value: 25 },
];

const COLORS = ['#5eead4', '#8b5cf6', '#ec4899', '#10b981'];

import { Project } from '../types';

interface AnalyticsDashboardProps {
  project: Project;
  onBack: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ project, onBack }) => {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Analytics Command Center</h2>
            <p className="text-sm text-zinc-500 font-medium">Real-time insights for <span className="text-teal-400">{project.title}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-1 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto">
            {['Overview', 'Responses', 'Fields'].map(tab => (
              <button key={tab} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${tab === 'Overview' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {tab}
              </button>
            ))}
          </div>
          <button className="btn-secondary py-2 px-4 text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Responses", value: "1,284", change: "+12.5%", icon: Users, color: "teal" },
          { label: "Completion Rate", value: "78.2%", change: "+2.1%", icon: Activity, color: "emerald" },
          { label: "Avg. Time to Fill", value: "2m 45s", change: "-15s", icon: Clock, color: "violet" },
          { label: "Active Sessions", value: "42", change: "Live", icon: Globe, color: "teal" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 space-y-4 group hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center justify-between">
              <div className={`p-3 bg-${stat.color}-500/10 rounded-xl text-${stat.color}-400`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : stat.change === 'Live' ? 'text-teal-400 animate-pulse' : 'text-red-500'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : stat.change.startsWith('-') ? <ArrowDownRight size={12} /> : null}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Chart */}
        <div className="lg:col-span-2 glass-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Submission Heatmap</h3>
              <p className="text-xs text-zinc-600">Peak activity usually occurs on Fridays</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors"><Filter size={14} /></button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors"><MoreVertical size={14} /></button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heatmapData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5eead4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5eead4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#5eead4" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Donut */}
        <div className="glass-card p-8 space-y-8 flex flex-col">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Completion Rate</h3>
            <p className="text-xs text-zinc-600">Overall form performance</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold tracking-tight">75%</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Success</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {completionData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-medium text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drop-off Funnel */}
        <div className="glass-card p-8 space-y-8">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Field Drop-off Funnel</h3>
            <p className="text-xs text-zinc-600">Where users stop filling the form</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnelData}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Feed */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Real-time Response Feed</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Live Syncing</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Respondent</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "John Doe", status: "Completed", time: "2m ago", email: "john@example.com" },
                    { name: "Sarah Smith", status: "Abandoned", time: "5m ago", email: "sarah@example.com" },
                    { name: "Mike Ross", status: "Completed", time: "12m ago", email: "mike@example.com" },
                    { name: "Rachel Zane", status: "Completed", time: "15m ago", email: "rachel@example.com" }
                  ].map((resp, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                            {resp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-zinc-300">{resp.name}</p>
                            <p className="text-[10px] text-zinc-600 font-medium">{resp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${resp.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {resp.status === 'Completed' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                          {resp.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{resp.time}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors">
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-white/5 bg-white/[0.02] text-center">
            <button className="text-[10px] font-bold text-teal-400 uppercase tracking-widest hover:text-teal-300 transition-colors">View All Responses</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
