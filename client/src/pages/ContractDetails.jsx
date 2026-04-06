import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  ChevronLeft, 
  ShieldCheck, 
  Briefcase, 
  Calendar,
  AlertCircle,
  Zap,
  Loader2,
  Lock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ContractDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select(`
          *,
          gig:gigs(*),
          freelancer:users!contracts_freelancer_id_fkey(*),
          client:users!contracts_client_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (data) setContract(data);
    } catch (err) {
      console.error('Fetch contract failed', err);
      setError('Contract data encrypted or not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('contracts')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      
      // Update local state
      setContract({ ...contract, status: newStatus });
      
      // If completed, update gig status too
      if (newStatus === 'completed') {
        await supabase.from('gigs').update({ status: 'completed' }).eq('id', contract.gig_id);
      }
    } catch (err) {
      console.error('Update status failed', err);
      alert('Mission update unsuccessful.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="container py-20 text-center animate-pulse text-indigo-400 font-extrabold text-2xl uppercase tracking-[0.2em]">Synchronizing Secure Contract Data...</div>;
  if (error) return <div className="container py-20 text-center text-rose-400 font-black">{error}</div>;

  const isClient = user && user.id === contract.client_id;
  const isFreelancer = user && user.id === contract.freelancer_id;

  return (
    <div className="container px-6 space-y-12 py-12 animate-fade max-w-5xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-white transition-colors group font-black uppercase text-xs tracking-widest leading-none bg-white/5 py-3 px-6 rounded-2xl border border-white/5">
        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Return to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Contract Dossier */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-12 space-y-8 border-none bg-indigo-500/[0.01] rounded-[48px] shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                   <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Active Mission Contract #{contract.id.slice(0, 8).toUpperCase()}
                   </div>
                   <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">{contract.gig?.title}</h1>
                </div>
                <div className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border ${contract.status === 'active' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                   Mission {contract.status}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <ContractInfo icon={<DollarSign className="text-emerald-400" />} label="Contract Value" value={`$${contract.amount}`} />
                <ContractInfo icon={<Calendar className="text-indigo-400" />} label="Launch Date" value={new Date(contract.created_at).toLocaleDateString()} />
                <ContractInfo icon={<Briefcase className="text-secondary" />} label="Mission Mode" value="Fixed Reward" />
                <ContractInfo icon={<ShieldCheck className="text-cyan-400" />} label="Escrow Status" value={contract.status === 'active' ? 'Held Secure' : 'Released'} />
             </div>

             <div className="space-y-6 pt-8 border-t border-white/5">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                   <Zap className="w-5 h-5 text-amber-500" />
                   Mission Completion Requirements
                </h3>
                <div className="glass p-8 bg-white/[0.01] border-none rounded-[32px] text-slate-400 font-medium italic">
                   "{contract.gig?.requirements?.join(', ') || 'All standard mission parameters apply.'}"
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6 p-10 glass border-none bg-emerald-500/[0.02] rounded-[32px]">
             <ShieldAlert className="w-10 h-10 text-indigo-400" />
             <div className="space-y-1">
                <h4 className="font-black text-white tracking-tight leading-none uppercase">Military-Grade Escrow Active</h4>
                <p className="text-xs text-slate-500 font-medium">Funds are held by GigSphere and will only be released upon mutual confirmation of mission success.</p>
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
           <div className="glass p-10 space-y-8 border-none bg-indigo-500/[0.03] rounded-[48px]">
              <div className="text-center space-y-4">
                 <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Partner Identity</div>
                 <div className="flex justify-center flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-800 border-4 border-indigo-500/20 flex items-center justify-center font-black text-3xl text-indigo-400 shadow-2xl">
                       {isClient ? (contract.freelancer?.full_name?.charAt(0) || 'F') : (contract.client?.full_name?.charAt(0) || 'C')}
                    </div>
                    <div className="text-xl font-black text-white tracking-tight uppercase leading-none">
                       {isClient ? contract.freelancer?.full_name : contract.client?.full_name}
                    </div>
                    <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{isClient ? 'Freelancer' : 'Client Partner'}</div>
                 </div>
              </div>

              <div className="space-y-4">
                 <button className="btn btn-outline w-full h-14 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest leading-none flex items-center justify-center group">
                    Enter Secure Comms
                    <MessageSquare className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
                 </button>
                 
                 {contract.status === 'active' && (
                    <div className="pt-4 space-y-4">
                       {isFreelancer ? (
                          <button 
                            onClick={() => handleUpdateStatus('pending_review')}
                            disabled={actionLoading}
                            className="btn btn-primary w-full h-[4.5rem] rounded-[2rem] text-lg font-black tracking-tight"
                          >
                             {actionLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (
                                <span className="flex items-center gap-3">
                                   Submit for Review
                                   <ArrowRight className="w-6 h-6 hover:translate-x-1" />
                                </span>
                             )}
                          </button>
                       ) : isClient ? (
                          <button 
                             onClick={() => handleUpdateStatus('completed')}
                             disabled={actionLoading}
                             className="btn btn-primary w-full h-[4.5rem] rounded-[2rem] text-lg font-black tracking-tight bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-emerald-500/20"
                          >
                             {actionLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (
                                <span className="flex items-center gap-3">
                                   Release Escrow
                                   <CheckCircle className="w-6 h-6" />
                                </span>
                             )}
                          </button>
                       ) : null}
                    </div>
                 )}
              </div>
           </div>

           <div className="glass p-10 bg-white/[0.01] border-none flex items-center space-x-6 group rounded-[32px] hover:bg-white/[0.02] cursor-help">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-white leading-none uppercase tracking-tight">Escrow Help</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Dispute resolution.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ContractInfo = ({ icon, label, value }) => (
  <div className="space-y-1 group">
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
       {React.cloneElement(icon, { size: 12 })}
       {label}
    </div>
    <div className="text-xl font-black text-white tracking-widest group-hover:text-indigo-400 transition-colors uppercase">{value}</div>
  </div>
);

export default ContractDetails;
