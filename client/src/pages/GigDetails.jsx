import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Clock, LayoutGrid, CheckCircle, TrendingUp, Sparkles, Send, BrainCircuit } from 'lucide-react';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposalForm, setProposalForm] = useState({ cover_letter: '', bid_amount: '', delivery_days: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gigRes = await axios.get(`http://localhost:5000/api/gigs/${id}`);
        setGig(gigRes.data.data.gig);
        
        // If client, fetch proposals too
        if (user && (user.role === 'client' || user.role === 'admin')) {
          const propRes = await axios.get(`http://localhost:5000/api/proposals/gig/${id}`);
          setProposals(propRes.data.data.proposals);
        }
      } catch (err) {
        console.error('Fetch data failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/proposals', { ...proposalForm, gig_id: id });
      alert('Proposal submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Apply failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHire = async (proposalId) => {
    if (!window.confirm('Hire this freelancer? All other proposals will be rejected.')) return;
    try {
      await axios.post('http://localhost:5000/api/contracts/hire', { proposal_id: proposalId });
      alert('Freelancer hired! Contract created.');
      navigate('/dashboard');
    } catch (err) {
       alert(err.response?.data?.message || 'Hire failed');
    }
  };

  if (loading) return <div className="container py-20 text-center text-slate-500 animate-pulse font-black text-4xl uppercase tracking-tighter">AI Processing...</div>;
  if (!gig) return <div className="container py-20 text-center">Gig not found</div>;

  return (
    <div className="container px-6 grid md:grid-cols-3 gap-12 py-12 animate-fade">
      {/* Left Column: Gig Info */}
      <div className="md:col-span-2 space-y-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-2">
             <Clock className="w-4 h-4" />
             <span>Posted 3 hours ago</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight">{gig.title}</h1>
          <div className="flex flex-wrap gap-4 pt-4">
             {gig.skills_required.map((s, i) => (
               <span key={i} className="px-4 py-2 glass rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 border-white/5">{s}</span>
             ))}
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-2xl font-black text-white flex items-center">
             <LayoutGrid className="w-6 h-6 mr-3 text-indigo-400" />
             Mission Details
           </h2>
           <p className="text-slate-400 leading-relaxed text-lg font-medium whitespace-pre-wrap">{gig.description}</p>
        </div>

        {/* Client Dashboard: Proposals */}
        {user?.role === 'client' && user.id === gig.client_id && (
           <div className="space-y-8 pt-12 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-white flex items-center">
                  <BrainCircuit className="w-8 h-8 mr-4 text-secondary animate-pulse" />
                  AI-Ranked Proposals
                </h2>
                <div className="badge bg-white/5 border-white/10 px-4 py-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                   {proposals.length} Applications received
                </div>
              </div>

              <div className="space-y-6">
                 {proposals.map(p => (
                   <div key={p.id} className="glass p-8 border-none bg-white/[0.02] hover:bg-white/[0.04] transition-all transform hover:-translate-x-1">
                      <div className="flex items-start justify-between mb-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-black text-indigo-400 border border-white/10">{p.freelancer?.full_name?.charAt(0)}</div>
                            <div>
                               <h3 className="text-xl font-bold text-white">{p.freelancer?.full_name}</h3>
                               <div className="flex items-center text-emerald-400 space-x-2 font-black text-sm">
                                  <span>${p.bid_amount}</span>
                                  <span className="text-slate-600 font-medium px-2">•</span>
                                  <span className="text-slate-500 font-medium text-xs">{p.delivery_days} Days delivery</span>
                               </div>
                            </div>
                         </div>
                         {/* AI SCORE BADGE */}
                         <div className="text-center p-3 glass border-white/10 min-w-[100px] shadow-2xl shadow-indigo-500/10">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fit Score</div>
                            <div className={`text-2xl font-black ${p.ai_score > 80 ? 'text-indigo-400' : p.ai_score > 50 ? 'text-secondary' : 'text-slate-500'}`}>{p.ai_score || '??'}</div>
                         </div>
                      </div>
                      <p className="text-slate-400 mb-8 italic leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">"{p.cover_letter}"</p>
                      
                      {/* AI ANALYSIS AI */}
                      {p.ai_analysis && (
                        <div className="mb-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-start space-x-3 group">
                           <Sparkles className="w-5 h-5 text-indigo-400 mt-1" />
                           <div className="text-xs font-medium text-indigo-300 leading-relaxed italic"><strong className="text-white block not-italic mb-1 uppercase tracking-widest text-[9px]">Claude AI Analysis:</strong> {p.ai_analysis}</div>
                        </div>
                      )}

                      <button onClick={() => handleHire(p.id)} className="btn btn-primary w-full py-4 text-sm font-black uppercase tracking-widest">Connect & Hire</button>
                   </div>
                 ))}
                 {proposals.length === 0 && <div className="text-center py-20 glass border-dashed bg-transparent text-slate-600 font-bold uppercase tracking-widest">No applicants yet. AI is standing by.</div>}
              </div>
           </div>
        )}
      </div>

      {/* Right Column: Sidebar */}
      <div className="space-y-8 animate-slide">
         {/* Budget Card */}
         <div className="glass p-10 bg-indigo-500/5 border-indigo-500/20 shadow-2xl shadow-indigo-500/5">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Project Terms</div>
            <div className="text-5xl font-black text-white flex items-center mb-1">
               <DollarSign className="w-8 h-8 text-indigo-500" />
               {gig.budget}
            </div>
            <div className="text-sm font-medium text-slate-500">Fixed Budget</div>
            <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Timeline</span>
                  <span className="text-slate-300 font-black">{new Date(gig.deadline).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Applicants</span>
                  <span className="text-slate-300 font-black">{proposals.length}</span>
               </div>
            </div>
         </div>

         {/* Application Form (Freelancer only) */}
         {user?.role === 'freelancer' && (
           <div className="glass p-10 space-y-8 border-none bg-white/[0.04]">
              <h3 className="text-2xl font-black text-indigo-400">Apply Now</h3>
              <form onSubmit={handleApply} className="space-y-6">
                 <div>
                    <label className="input-label">Project Quote ($)</label>
                    <input className="input" type="number" placeholder="0.00" value={proposalForm.bid_amount} onChange={(e) => setProposalForm({...proposalForm, bid_amount: e.target.value})} required />
                 </div>
                 <div>
                    <label className="input-label">Delivery Days</label>
                    <input className="input" type="number" placeholder="7" value={proposalForm.delivery_days} onChange={(e) => setProposalForm({...proposalForm, delivery_days: e.target.value})} required />
                 </div>
                 <div>
                    <label className="input-label">Cover Letter</label>
                    <textarea className="input min-h-[150px] py-4" placeholder="Briefly explain why you're the perfect fit..." value={proposalForm.cover_letter} onChange={(e) => setProposalForm({...proposalForm, cover_letter: e.target.value})} required />
                 </div>
                 <button disabled={submitting} type="submit" className="btn btn-primary w-full py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center">
                    {submitting ? 'Transmitting...' : 'Transmit Proposal'}
                    <Send className="ml-2 w-4 h-4" />
                 </button>
              </form>
           </div>
         )}

         {/* Client Info Card */}
         <div className="glass p-10 space-y-6 border-none bg-white/[0.01]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">About Client</h3>
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-black text-indigo-400 text-xl border border-white/5">{gig.client?.full_name?.charAt(0)}</div>
               <div>
                  <h4 className="font-bold text-white leading-none">{gig.client?.full_name}</h4>
                  <div className="flex items-center text-yellow-500 mt-1">
                     {[1,2,3,4,5].map(i => <div key={i} className="text-[10px]">★</div>)}
                     <span className="text-slate-500 ml-2 text-xs font-bold">{gig.client?.avg_rating || '5.0'}</span>
                  </div>
               </div>
            </div>
            <p className="text-xs text-slate-500 italic leading-relaxed">{gig.client?.bio || 'Elite client on GigSphere since 2026. Consistent developer engagement.'}</p>
         </div>
      </div>
    </div>
  );
};

export default GigDetails;
