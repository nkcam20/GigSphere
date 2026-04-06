import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Briefcase, Star, Settings, ShieldCheck, Zap, Globe, Github, Twitter, Linkedin, Loader2, Sparkles, MessageSquare, Target } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProfile(data);
    } catch (err) {
      console.error('Fetch profile failed', err);
      setError('Agent identity not found in the sphere.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container py-20 text-center animate-pulse text-indigo-400 font-extrabold text-2xl uppercase tracking-[0.2em] shadow-2xl">Reconstructing Identity Dossier...</div>;
  if (error) return <div className="container py-20 text-center text-rose-400 font-black">{error}</div>;

  const isOwnProfile = currentUser && currentUser.id === id;

  return (
    <div className="container px-6 space-y-16 py-20 animate-fade max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="relative glass p-12 overflow-hidden border-none bg-indigo-500/[0.03] rounded-[48px] shadow-2xl shadow-indigo-500/10">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-12">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full bg-slate-800 border-8 border-indigo-500/20 flex items-center justify-center font-black text-7xl text-indigo-400 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
              {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" /> : profile.full_name?.charAt(0)}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 p-4 rounded-3xl bg-indigo-500 text-white shadow-2xl border-4 border-[#0f172a] hover:scale-110 active:scale-90 transition-transform">
                <Settings className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="text-center lg:text-left space-y-6 flex-grow">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <h1 className="text-6xl font-black text-white leading-tight tracking-tighter uppercase">{profile.full_name}</h1>
                <ShieldCheck className="w-10 h-10 text-indigo-400 animate-pulse" />
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 font-black uppercase text-xs tracking-widest">
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-400" /> {profile.role}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-400" /> Global Remote</span>
                <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> English, Spanish</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <SocialLink icon={<Github />} />
              <SocialLink icon={<Twitter />} />
              <SocialLink icon={<Linkedin />} />
              {isOwnProfile ? (
                 <button className="btn btn-primary h-14 px-10 rounded-2xl ml-auto font-black uppercase text-xs tracking-widest flex items-center gap-2 group">
                    Optimize Dossier
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                 </button>
              ) : (
                 <button className="btn btn-primary h-14 px-10 rounded-2xl ml-auto font-black uppercase text-xs tracking-widest flex items-center gap-2 group">
                    Initialize Contact
                    <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 group">
               <Target className="w-8 h-8 text-indigo-400 group-hover:rotate-12 transition-all" />
               Professional Intelligence Summary
            </h2>
            <div className="glass p-10 bg-white/[0.01] border-none rounded-[48px] text-xl text-slate-400 font-medium leading-relaxed leading-[2.5rem] indent-12 shadow-inner">
               "{profile.bio || 'This agent is currently operating under maximum intelligence encryption. Bio will be revealed upon contract initialization.'}"
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-4">
               <Zap className="w-6 h-6 text-amber-400" />
               Combat Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-6">
              {(profile.skills && profile.skills.length > 0) ? profile.skills.map((skill, index) => (
                <div key={index} className="px-10 py-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-white font-black uppercase text-sm tracking-widest shadow-2xl shadow-indigo-500/5 group hover:-translate-y-1 transition-transform">
                   {skill}
                </div>
              )) : (
                <div className="text-slate-600 font-black uppercase tracking-widest text-xs italic">Skills currently encrypted or not initialized by the agent.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="glass p-10 space-y-8 border-none bg-white/[0.01] rounded-[48px] shadow-2xl">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
               Sphere Influence
            </h3>
            <div className="space-y-6">
              <StatRow label="Intelligence Rating" value="5.0" icon={<Star className="text-amber-500" fill="currentColor" />} />
              <StatRow label="Missions Accomplished" value="24" icon={<ShieldCheck className="text-indigo-400" />} />
              <StatRow label="Network Reach" value="Top 1%" icon={<Globe className="text-secondary" />} />
              <StatRow label="Success Rate" value="100%" icon={<Zap className="text-emerald-400" />} />
            </div>
          </div>

          <div className="glass p-10 bg-indigo-500/10 border-none rounded-[40px] text-center space-y-6 group cursor-pointer hover:bg-indigo-500/20 transition-all">
             <div className="font-black text-indigo-400 uppercase text-xs tracking-[0.3em] leading-none mb-2">Availability</div>
             <div className="text-3xl font-black text-white animate-pulse">Available Now</div>
             <p className="text-slate-500 text-xs font-medium">Accepting elite AI-focused missions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between group hover:bg-white/5 p-4 rounded-2xl transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white/5 text-slate-500 group-hover:text-white transition-colors">
         {icon}
      </div>
      <div className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">{label}</div>
    </div>
    <div className="text-xl font-black text-white tracking-widest">{value}</div>
  </div>
);

const SocialLink = ({ icon }) => (
  <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-95">
    {icon}
  </button>
);

export default Profile;
