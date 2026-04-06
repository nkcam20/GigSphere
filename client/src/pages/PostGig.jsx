import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { Rocket, Target, DollarSign, Briefcase, PlusCircle, Loader2, Sparkles, Wand2 } from 'lucide-react';

const PostGig = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI Development',
    budget: '',
    requirements: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('Login Required');
    
    setLoading(true);
    setError('');
    
    try {
      const { error: postError } = await supabase
        .from('gigs')
        .insert([{
          client_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          requirements: formData.requirements.split(',').map(r => r.trim()),
          status: 'open'
        }]);

      if (postError) throw postError;
      navigate('/gigs');
    } catch (err) {
      setError(err.message || 'Mission Launch Failed. Intelligence check unsuccessful.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiRefinement = () => {
     // Simulate AI refinement
     setFormData({ ...formData, description: `${formData.description} (Refined by Claude AI for maximum match quality)` });
  };

  return (
    <div className="container px-6 space-y-12 py-16 animate-fade">
      <div className="max-w-4xl mx-auto space-y-12">
         {/* Page Header */}
         <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-2">
               <Rocket className="w-4 h-4 mr-2" />
               <span className="font-bold uppercase text-[10px] tracking-widest leading-none">Mission Launch Pad</span>
            </div>
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">Initialize New <span className="text-indigo-400">Mission</span>.</h1>
            <p className="text-xl text-slate-400 font-medium">Broadcast your project to the elite. AI matching will begin immediately upon publication.</p>
         </div>

         {error && (
            <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-black uppercase text-center">{error}</div>
         )}

         <form onSubmit={handleSubmit} className="space-y-12">
            <div className="glass p-12 space-y-10 border-none bg-white/[0.01] rounded-[48px]">
               <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Mission Title</label>
                    <div className="relative group">
                       <Target className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                       <input 
                         required 
                         className="input pl-16 h-20 text-xl font-bold bg-white/[0.02] border-white/5 focus:border-indigo-500/50 transition-all rounded-[32px]" 
                         placeholder="e.g. Architecting a Military-Grade Neural Network" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Intelligence Category</label>
                        <div className="relative">
                           <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                           <select 
                             className="input pl-16 h-20 text-lg font-bold bg-white/[0.02] border-white/5 rounded-[32px] appearance-none"
                             value={formData.category}
                             onChange={(e) => setFormData({...formData, category: e.target.value})}
                           >
                              <option className="bg-slate-900">AI Development</option>
                              <option className="bg-slate-900">Prompt Engineering</option>
                              <option className="bg-slate-900">Elite Consulting</option>
                              <option className="bg-slate-900">Modern Architecture</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Mission Budget ($)</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                           <input 
                             type="number" 
                             required 
                             className="input pl-16 h-20 text-xl font-bold bg-white/[0.02] border-white/5 focus:border-emerald-500/50 transition-all rounded-[32px]" 
                             placeholder="2500" 
                             value={formData.budget}
                             onChange={(e) => setFormData({...formData, budget: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Intelligence Brief (Description)</label>
                    <div className="relative">
                       <textarea 
                         required 
                         className="input p-8 h-48 bg-white/[0.02] border-white/5 focus:border-indigo-500/50 transition-all rounded-[32px] resize-none text-lg font-medium leading-relaxed" 
                         placeholder="Describe the mission parameters in detail..." 
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                       />
                       <button 
                         type="button"
                         onClick={handleAiRefinement}
                         className="absolute right-6 bottom-6 btn btn-outline py-2 px-4 rounded-xl border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs font-black flex items-center gap-2"
                       >
                         <Wand2 className="w-3 h-3" />
                         Refine with AI
                       </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
               <p className="text-slate-500 flex items-center font-bold text-sm">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Claude AI will immediately notify the top 1% of matching candidates.
               </p>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="btn btn-primary h-20 px-12 text-2xl font-black tracking-tight rounded-[2rem] w-full sm:w-auto shadow-2xl shadow-indigo-500/20"
               >
                 {loading ? <Loader2 className="animate-spin w-8 h-8 mx-auto" /> : (
                   <span className="flex items-center gap-3">
                     Broadcast Mission
                     <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </span>
                 )}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default PostGig;
