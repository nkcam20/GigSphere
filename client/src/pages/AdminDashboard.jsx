import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  MoreVertical, 
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, gigs: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch gigs
      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .select('*');

      // Fetch contracts for revenue
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('amount')
        .eq('status', 'completed');

      if (userData) {
        setRecentUsers(userData.slice(0, 10));
        setStats({
          users: userData.length,
          gigs: gigData?.length || 0,
          revenue: contractData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0
        });
      }
    } catch (err) {
      console.error('Admin fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-20 text-center animate-pulse text-indigo-400 font-extrabold text-2xl uppercase tracking-[0.2em]">Synchronizing Total Sphere Intelligence...</div>;
  if (!user || user.role !== 'admin') return <div className="container py-20 text-center text-rose-400 font-extrabold text-2xl uppercase tracking-[0.2em] shadow-2xl">Access Unauthorized. Personnel Only.</div>;

  return (
    <div className="container px-6 space-y-16 py-16 animate-fade max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-2">
               <ShieldCheck className="w-4 h-4 mr-2" />
               <span className="font-bold uppercase text-[10px] tracking-widest leading-none">Global Network Admin</span>
            </div>
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">Sphere <span className="text-indigo-400">Command</span>.</h1>
            <p className="text-xl text-slate-400 font-medium">Global intelligence and oversight for the GigSphere network operations.</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="btn btn-outline h-14 px-8 rounded-2xl border-white/5 font-black uppercase text-xs tracking-widest flex items-center gap-2 group">
               Export Intelligence
            </button>
            <button className="btn btn-primary h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 group">
               Network Scan
               <Zap className="w-4 h-4 animate-pulse text-amber-500" />
            </button>
         </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <AdminStatWidget label="Total Agents" value={stats.users} icon={<Users className="text-indigo-400" />} change="+12%" />
         <AdminStatWidget label="Active Missions" value={stats.gigs} icon={<Briefcase className="text-cyan-400" />} change="+5.4%" />
         <AdminStatWidget label="Total Revenue" value={`$${stats.revenue}`} icon={<DollarSign className="text-emerald-500" />} change="+18.2%" />
         <AdminStatWidget label="Network Health" value="100%" icon={<TrendingUp className="text-secondary" />} change="Optimal" />
      </div>

      {/* Users Table Dashboard */}
      <div className="space-y-8">
         <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 group">
               <Users className="w-8 h-8 text-indigo-400" />
               Agent Registry
            </h2>
            <div className="relative group max-w-md hidden md:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
               <input type="text" className="input pl-12 h-12 bg-white/5 border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest" placeholder="Filter agents..." />
            </div>
         </div>

         <div className="glass overflow-hidden border-none bg-indigo-500/[0.01] rounded-[48px] shadow-2xl">
            <table className="w-full text-left">
               <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                     <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity File</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Protocol Role</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {recentUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="p-8">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-indigo-500/10 flex items-center justify-center font-black text-xl text-indigo-400">
                                {user.full_name?.charAt(0) || 'U'}
                             </div>
                             <div>
                                <div className="font-black text-lg text-white leading-none uppercase tracking-tight">{user.full_name}</div>
                                <div className="text-xs text-slate-500 font-medium mt-1 lowercase">{user.email}</div>
                             </div>
                          </div>
                       </td>
                       <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                             {user.role}
                          </span>
                       </td>
                       <td className="p-8">
                          <div className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                             <CheckCircle className="w-4 h-4" />
                             Verified
                          </div>
                       </td>
                       <td className="p-8 text-right">
                          <button className="p-4 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const AdminStatWidget = ({ label, value, icon, change }) => (
  <div className="glass p-10 space-y-6 border-none bg-white/[0.01] rounded-[48px] relative overflow-hidden group">
     <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[4rem] flex items-center justify-center group-hover:bg-white/10 transition-colors">
        {React.cloneElement(icon, { size: 32 })}
     </div>
     <div className="space-y-4">
        <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-4">{label}</div>
        <div className="text-5xl font-black text-white tracking-tighter mb-2">{value}</div>
        <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
           <TrendingUp className="w-4 h-4" />
           {change}
        </div>
     </div>
  </div>
);

export default AdminDashboard;
