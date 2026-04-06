import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Rocket, DollarSign, Calendar, List, MessageSquare, Send, Sparkles } from 'lucide-react';

const PostGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    budget: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/gigs', formData);
      alert('Mission launched successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Mission launch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl px-6 py-12 animate-fade">
       <div className="space-y-4 mb-12">
          <h1 className="text-5xl font-black text-white">Launch a <span className="text-secondary">Mission.</span></h1>
          <p className="text-slate-400 font-medium">Describe your project and let AI rank the world's best talent for you.</p>
       </div>

       <div className="glass p-12 border-none bg-white/[0.02]">
          <form onSubmit={handleSubmit} className="space-y-10">
             <div className="space-y-4">
                <label className="input-label">Project Title</label>
                <div className="relative group">
                  <Rocket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input name="title" className="input pl-12 py-5" placeholder="Building a DeFi Dashboard with AI integration" value={formData.title} onChange={handleChange} required />
                </div>
             </div>

             <div className="space-y-4">
                <label className="input-label">Mission Description</label>
                <textarea name="description" className="input min-h-[250px] py-4" placeholder="Deep-dive into the project scope, technical requirements, and target outcomes..." value={formData.description} onChange={handleChange} required />
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="input-label">Required Skills (Comma separated)</label>
                   <div className="relative group">
                     <List className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                     <input name="skills_required" className="input pl-12 py-5" placeholder="React, Node, Python" value={formData.skills_required} onChange={handleChange} required />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="input-label">Project Budget ($)</label>
                   <div className="relative group">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                     <input name="budget" type="number" className="input pl-12 py-5" placeholder="5000" value={formData.budget} onChange={handleChange} required />
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <label className="input-label">Deadline</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input name="deadline" type="date" className="input pl-12 py-5" value={formData.deadline} onChange={handleChange} required />
                </div>
             </div>

             <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-widest italic animate-pulse">
                   <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                   AI Ranking will be enabled automatically
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary px-12 py-5 text-lg font-black uppercase tracking-widest shadow-indigo-500/25">
                   {loading ? 'Launching...' : 'Ignite Mission'}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export default PostGig;
