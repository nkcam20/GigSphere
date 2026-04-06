import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { Clock, DollarSign, MapPin, Briefcase, ChevronLeft, ShieldCheck, Mail, ArrowRight, Loader2, Target, Users, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  const fetchGigDetails = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('gigs')
        .select(`
          *,
          client:users!gigs_client_id_fkey(id, full_name, avatar_url, bio)
        `)
        .eq('id', id)
        .single();

      if (data) setGig(data);
    } catch (err) {
      console.error('Fetch gig details failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'freelancer') return alert('Only elite freelancers can accept missions.');
    
    setProposalLoading(true);
    try {
      // Create a contract immediately for this demo
      const { error: contractError } = await supabase
        .from('contracts')
        .insert([{
          gig_id: id,
          client_id: gig.client_id,
          freelancer_id: user.id,
          amount: gig.budget,
          status: 'active'
        }]);

      if (contractError) throw contractError;
      
      // Update gig status
      await supabase.from('gigs').update({ status: 'assigned' }).eq('id', id);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Mission acceptance failed.');
    } finally {
      setProposalLoading(false);
    }
  };

  if (loading) return <div className="container py-20 text-center animate-pulse text-indigo-400 font-extrabold text-2xl uppercase tracking-[0.2em] shadow-2xl">Decoding Mission Intel...</div>;
  if (!gig) return <div className="container py-20 text-center">Mission ID not found in the sphere.</div>;

  return (
    <div className="container px-6 space-y-12 py-16 animate-fade max-w-6xl mx-auto">
      <Link to="/gigs" className="inline-flex items-center text-slate-500 hover:text-white transition-colors group font-black uppercase text-xs tracking-widest leading-none bg-white/5 py-3 px-6 rounded-2xl border border-white/5">
        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Sphere Discovery
      </Link>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="badge bg-indigo-500/10 text-indigo-400 px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{gig.category}</span>
               <div className="flex -space-x-3 items-center ml-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-4 border-[#0f172a] shadow-lg"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary border-4 border-[#0f172a] shadow-lg"></div>
                  <div className="w-8 h-8 rounded-full bg-cyan-400 border-4 border-[#0f172a] shadow-lg"></div>
                  <span className="text-slate-500 text-[10px] font-bold ml-6 uppercase tracking-widest">+12 Top Candidates Interested</span>
               </div>
            </div>
            
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
              {gig.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              <DetailCard icon={<DollarSign className="text-emerald-400" />} label="Mission Reward" value={`$${gig.budget}`} />
              <DetailCard icon={<Clock className="text-indigo-400" />} label="Engagement" value="Contract" />
              <DetailCard icon={<MapPin className="text-secondary" />} label="Location" value="Remote Sphere" />
              <DetailCard icon={<ShieldCheck className="text-cyan-400" />} label="Verification" value="Verified Client" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 group">
               <Target className="w-8 h-8 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
               Mission Intelligence Brief
            </h2>
            <div className="glass p-10 border-none bg-white/[0.01] rounded-[48px] text-lg text-slate-400 font-medium leading-relaxed space-y-6">
               <p>{gig.description}</p>
            </div>
          </div>

          {gig.requirements && gig.requirements.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-4">
                 <Zap className="w-6 h-6 text-amber-400" />
                 Skill Requirements
              </h2>
              <div className="flex flex-wrap gap-4">
                {gig.requirements.map((req, index) => (
                  <span key={index} className="px-6 py-4 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-white font-black uppercase text-xs tracking-widest">{req}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-12 animate-slide">
          <div className="glass p-10 space-y-10 border-none bg-indigo-500/[0.03] rounded-[48px] shadow-2xl shadow-indigo-500/10">
            <div className="text-center space-y-6">
              <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest leading-none flex items-center justify-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 Elite Matching Active
              </div>
              <div className="space-y-1">
                 <div className="text-5xl font-black text-white tracking-tighter">${gig.budget}</div>
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fixed Milestone Payment</div>
              </div>
            </div>
            
            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center uppercase tracking-widest animate-pulse">{error}</div>}

            <button 
              onClick={handleApply}
              disabled={proposalLoading || gig.status !== 'open'}
              className="btn btn-primary w-full h-[5rem] px-8 py-5 text-xl font-black tracking-tight rounded-[2rem] shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-4 group/btn relative overflow-hidden transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              {proposalLoading ? <Loader2 className="animate-spin w-8 h-8" /> : (
                gig.status === 'open' ? (
                  <>
                    Initialize Mission
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                ) : 'Mission Assigned'
              )}
            </button>

            <div className="pt-6 border-t border-white/5 space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl uppercase shadow-xl">
                     {gig.client?.avatar_url ? <img src={gig.client.avatar_url} className="w-full h-full rounded-[1.5rem] object-cover" /> : gig.client?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight">{gig.client?.full_name}</h3>
                    <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-1">Verified Hiring Partner</div>
                  </div>
               </div>
               <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{gig.client?.bio || 'Elite hiring partner with multiple successful sphere operations.'}"</p>
               <button className="btn btn-outline w-full h-14 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest leading-none flex items-center justify-center group overflow-hidden">
                  View Full Intelligence File
                  <Users className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
               </button>
            </div>
          </div>

          <div className="glass p-10 bg-white/[0.01] border-none flex items-center space-x-6 group rounded-[32px] hover:bg-white/[0.02] transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform duration-500">
               <Mail className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-white leading-none uppercase tracking-tight">Direct Comms</h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-none">Instant channel to partner.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="glass p-6 space-y-2 border-none bg-white/[0.02] rounded-3xl group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-bl-[2rem] flex items-center justify-center group-hover:bg-white/10 transition-colors">
       {React.cloneElement(icon, { size: 16 })}
    </div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</div>
    <div className="text-xl font-black text-white tracking-tighter">{value}</div>
  </div>
);

export default GigDetails;
