import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, DollarSign, MessageSquare, CheckCircle, Clock, ChevronRight, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, pending: 0, earnings: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch contracts from Supabase directly
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            gig:gigs(title),
            freelancer:users!contracts_freelancer_id_fkey(full_name),
            client:users!contracts_client_id_fkey(full_name)
          `)
          .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);

        if (data) {
          setContracts(data);
          
          // Calculate stats
          const activeCount = data.filter(c => c.status === 'active').length;
          const totalEarnings = data
            .filter(c => c.status === 'completed')
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);
            
          setStats({ active: activeCount, earnings: totalEarnings, pending: data.length - activeCount });
        }
      } catch (err) {
        console.error('Fetch dashboard failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <div className="container py-20 text-center animate-pulse text-indigo-400 font-black text-2xl uppercase tracking-widest">Initializing Dashboard Intelligence...</div>;
  if (!user) return <div className="container py-20 text-center text-rose-400 font-bold">Access Denied. Please log in.</div>;

  return (
    <div className="container px-6 space-y-12 py-12 animate-fade">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-4">
            <h1 className="text-5xl font-black text-white">Hi, <span className="text-indigo-400">{(user.full_name || 'Agent').split(' ')[0]}</span>.</h1>
            <p className="text-slate-400 font-medium">Welcome to your command center. Check your latest mission updates.</p>
         </div>
         <div className="flex items-center space-x-2 badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-2">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="font-bold uppercase text-[10px] tracking-widest">{user.role} Account Verified</span>
         </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatWidget label="Active Missions" value={stats.active} icon={<Briefcase className="text-indigo-400" />} />
         <StatWidget label="Total Revenue" value={`$${stats.earnings}`} icon={<DollarSign className="text-emerald-400" />} />
         <StatWidget label="Pending Actions" value={stats.pending} icon={<Clock className="text-amber-400" />} />
      </div>

      {/* Main Grid: Contracts & Sidebar */}
      <div className="grid lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center">
               <LayoutDashboard className="w-6 h-6 mr-3 text-indigo-400" />
               Contract Overview
            </h2>

            <div className="space-y-4">
               {contracts.map(contract => (
                 <div key={contract.id} className="glass p-8 border-none bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center space-x-6">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contract.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {contract.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                       </div>
                       <div>
                          <h3 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors capitalize">{contract.gig?.title || 'Contract Mission'}</h3>
                          <p className="text-sm text-slate-500 font-medium">
                            {user.role === 'client' ? `Freelancer: ${contract.freelancer?.full_name || 'Pending'}` : `Client: ${contract.client?.full_name || 'Pending'}`}
                          </p>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                       <div className="text-right hidden sm:block">
                          <div className="text-lg font-black text-white">${contract.amount || 0}</div>
                          <div className={`text-[10px] font-bold uppercase tracking-widest ${contract.status === 'active' ? 'text-amber-500' : 'text-emerald-500'}`}>{contract.status}</div>
                       </div>
                       <Link to={`/contracts/${contract.id}`} className="p-3 rounded-xl bg-white/5 hover:bg-indigo-500/10 transition-colors">
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                       </Link>
                    </div>
                 </div>
               ))}
               {contracts.length === 0 && (
                 <div className="py-20 text-center glass border-dashed bg-transparent border-white/5 rounded-[48px]">
                   <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No active contracts found. Launch a mission today.</p>
                   <Link to="/gigs" className="btn btn-primary mt-6 px-10 h-14 font-black">Browse Missions</Link>
                 </div>
               )}
            </div>
         </div>

         {/* Sidebar */}
         <div className="space-y-8 animate-slide">
            <div className="glass p-10 space-y-8 border-none bg-indigo-500/[0.03] rounded-[48px]">
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-indigo-500/20 flex items-center justify-center font-black text-4xl text-indigo-400 shadow-2xl shadow-indigo-500/20">
                     {(user.full_name || 'U').charAt(0)}
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white">{user.full_name || 'User Agent'}</h3>
                     <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                     <div className="text-lg font-black text-white">5.0</div>
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rating</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                     <div className="text-lg font-black text-white">{contracts.length}</div>
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Missions</div>
                  </div>
               </div>

               <Link to={`/profile/${user.id}`} className="btn btn-outline w-full py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center group h-14">
                  Manage Public Profile
                  <User className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
               </Link>
            </div>

            <Link to="/chat" className="glass p-10 bg-white/[0.01] border-none flex items-center space-x-6 group rounded-[32px] hover:bg-white/[0.05] transition-all cursor-pointer block">
               <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform">
                  <MessageSquare className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-white leading-none">Sphere Chat</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 text-nowrap">Connect with partners instantly.</p>
               </div>
            </Link>
         </div>
      </div>
    </div>
  );
};

const StatWidget = ({ label, value, icon }) => (
  <div className="glass p-8 space-y-4 border-none bg-white/[0.02] hover:bg-white/[0.04] transition-all transform hover:-translate-y-1 group rounded-[40px]">
     <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">{icon}</div>
     </div>
     <div className="text-4xl font-black text-white">{value}</div>
  </div>
);

export default Dashboard;
