import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutGrid, List, Search, Filter, SlidersHorizontal, SlidersVertical } from 'lucide-react';
import GigCard from '../components/GigCard';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ skill: '', minBudget: '', maxBudget: '' });

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter.skill) params.append('skill', filter.skill);
        if (filter.minBudget) params.append('minBudget', filter.minBudget);
        if (filter.maxBudget) params.append('maxBudget', filter.maxBudget);
        
        const response = await axios.get(`http://localhost:5000/api/gigs?${params.toString()}`);
        setGigs(response.data.data.gigs);
      } catch (err) {
        console.error('Fetch gigs failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [filter]);

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-6 space-y-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-white">Find Your <span className="text-secondary">Mission.</span></h1>
          <p className="text-slate-400 font-medium">Browse high-paying opportunities curated for elite talent.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-2 rounded-2xl w-full md:w-auto">
          <div className="relative flex-grow md:w-64 group pl-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search missions..." 
              className="bg-transparent border-none text-white text-sm focus:ring-0 w-full pl-8 py-2" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-xs px-6 py-3 text-xs font-bold rounded-xl flex items-center">
            <Filter className="w-3 h-3 mr-2" />
            FILTER
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="glass h-64 animate-pulse bg-white/5 opacity-50 border-none"></div>
           ))}
        </div>
      ) : filteredGigs.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 animate-fade">
          {filteredGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl text-slate-700">🔭</div>
          <h2 className="text-2xl font-bold text-slate-500">No missions found.</h2>
          <p className="text-slate-600">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default Gigs;
