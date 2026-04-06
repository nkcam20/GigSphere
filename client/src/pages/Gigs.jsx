import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronRight, Zap, Sparkles } from 'lucide-react';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          client:users!gigs_client_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (data) setGigs(data);
    } catch (err) {
      console.error('Fetch gigs failed', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-6 space-y-12 py-12 animate-fade">
      {/* Search Header */}
      <div className="space-y-8 max-w-4xl">
         <div className="space-y-4">
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">Mission <span className="text-indigo-400">Discovery</span>.</h1>
            <p className="text-xl text-slate-400 font-medium">Find elite missions across the AI sphere. Filter by category or intelligence level.</p>
         </div>

         <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              className="input pl-16 h-20 text-xl font-bold bg-white/[0.02] border-white/5 focus:border-indigo-500/50 transition-all rounded-[32px] shadow-2xl shadow-black/20" 
              placeholder="Search for missions (AI Development, Creative, Consulting...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12 pt-8">
         {/* Filters Sidebar */}
         <div className="space-y-8 hidden lg:block">
            <div className="glass p-10 space-y-8 bg-indigo-500/[0.02] border-none rounded-[48px]">
               <div className="flex items-center text-white font-black text-xl">
                  <Filter className="w-5 h-5 mr-3 text-indigo-400" />
                  Mission Filters
               </div>
               
               <div className="space-y-4">
                  <FilterCategory label="AI Engineering" active />
                  <FilterCategory label="Prompt Architecture" />
                  <FilterCategory label="Strategic Intelligence" />
                  <FilterCategory label="Elite Design" />
               </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">Price Sphere</div>
                  <input type="range" className="w-full h-1 bg-white/5 rounded-full appearance-none accent-indigo-400" />
               </div>
            </div>
         </div>

         {/* Gigs List */}
         <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-indigo-400 font-black text-xl uppercase tracking-widest">Scanning Sphere for Missions...</div>
            ) : filteredGigs.length > 0 ? (
              filteredGigs.map(gig => (
                <Link key={gig.id} to={`/gigs/${gig.id}`} className="glass p-10 block hover:bg-white/[0.04] transition-all border-none bg-white/[0.01] rounded-[48px] group hover:-translate-y-2">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-6 flex-grow">
                         <div className="flex items-center space-x-3">
                            <span className="badge bg-indigo-500/10 text-indigo-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{gig.category}</span>
                            <span className="flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                               <MapPin className="w-3 h-3 mr-1" />
                               Global Remote
                            </span>
                         </div>
                         <h3 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">{gig.title}</h3>
                         <p className="text-slate-400 font-medium line-clamp-2 text-lg leading-relaxed">{gig.description}</p>
                         <div className="flex items-center space-x-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center"><User className="w-4 h-4 mr-2" />{gig.client?.full_name || 'Hiring Manager'}</span>
                            <span className="flex items-center"><Zap className="w-4 h-4 mr-2" />AI-Enhanced Project</span>
                         </div>
                      </div>
                      <div className="md:text-right space-y-4 md:w-48">
                         <div className="text-4xl font-black text-white tracking-tighter">${gig.budget}</div>
                         <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fixed Reward</div>
                         <div className="btn btn-primary w-full h-14 rounded-2xl group flex items-center justify-center font-black overflow-hidden relative">
                            Initialize Mission
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                   </div>
                </Link>
              ))
            ) : (
              <div className="py-20 text-center glass border-dashed bg-transparent border-white/5 rounded-[48px]">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-lg">No missions found matching your search term.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const FilterCategory = ({ label, active }) => (
  <div className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center group font-bold tracking-tight ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-white/5'}`}>
     <Briefcase className="w-4 h-4 mr-3 opacity-50 group-hover:opacity-100 transition-opacity" />
     {label}
  </div>
);

export default Gigs;
