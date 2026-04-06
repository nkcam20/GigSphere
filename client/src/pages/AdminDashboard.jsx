import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, DollarSign, Briefcase, Activity, TrendingUp, Sparkles, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Fetch stats failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container py-20 text-center animate-pulse text-4xl font-black text-rose-400">Restricted: Administrative Protocol Overload...</div>;

  return (
    <div className="container px-6 space-y-12 py-12 animate-fade">
       {/* Security Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                <span>Level 7 Administrative Clearance Active</span>
             </div>
             <h1 className="text-5xl font-black text-white">Sphere <span className="text-rose-500">Command Control.</span></h1>
             <p className="text-slate-400 font-medium">Real-time platform metrics and global network state.</p>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatWidget label="Total User Population" value={stats.totalUsers} icon={<Users className="text-rose-400" />} />
          <StatWidget label="Active Platform Gigs" value={stats.totalGigs} icon={<Briefcase className="text-indigo-400" />} />
          <StatWidget label="System Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign className="text-emerald-400" />} />
          <StatWidget label="Network Health" value="99.9%" icon={<Activity className="text-cyan-400" />} />
       </div>

       {/* Platform Health Logic */}
       <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 glass p-12 border-none bg-white/[0.02] space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <Database className="w-20 h-20 text-white/[0.02]" />
             </div>
             
             <h3 className="text-2xl font-black text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-indigo-400" />
                Administrative Log History
             </h3>
             
             <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-bold text-slate-500 tracking-wide uppercase">
                   <span>Platform Core Initialization</span>
                   <span className="text-emerald-500 font-black">Stable</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-bold text-slate-500 tracking-wide uppercase">
                   <span>Supabase Database Connection</span>
                   <span className="text-emerald-500 font-black">Active - 24ms Latency</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-bold text-slate-500 tracking-wide uppercase">
                   <span>Claude AI Ranking Node</span>
                   <span className="text-indigo-400 font-black">Syncing...</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="glass p-10 border-none bg-rose-500/10 shadow-2xl shadow-rose-500/5 transition-all hover:scale-[1.02]">
                <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-6">Security Hotlinks</h4>
                <div className="space-y-4">
                   <button className="btn btn-outline w-full py-4 text-xs font-black uppercase tracking-widest border-rose-500/30 text-rose-400 hover:bg-rose-500/10">Flag Account Protocol</button>
                   <button className="btn btn-outline w-full py-4 text-xs font-black uppercase tracking-widest border-slate-700 text-slate-500 hover:bg-white/5">Audit Financial Logs</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const StatWidget = ({ label, value, icon }) => (
  <div className="glass p-8 space-y-4 border-none bg-white/[0.02] group hover:bg-white/[0.04] transition-all transform hover:-translate-y-1">
     <div className="flex items-center justify-between">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors shadow-xl shadow-black/20">{icon}</div>
     </div>
     <div className="text-5xl font-black text-white tracking-tighter">{value}</div>
  </div>
);

export default AdminDashboard;
