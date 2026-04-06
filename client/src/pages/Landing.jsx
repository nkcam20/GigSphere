import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Shield, Clock, TrendingUp, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="container px-6 space-y-32 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-fade max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          <span>The Future of Work is Here</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white">
          Where Skills meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-secondary to-cyan-400">Intelligence.</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          GigSphere uses Claude AI to match elite freelancers with innovative projects, ensuring the perfect fit in seconds, not days.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
          <Link to="/register" className="btn btn-primary px-10 py-5 text-lg shadow-indigo-500/25 group">
            Hire Top Talent
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/gigs" className="btn btn-outline px-10 py-5 text-lg">
            Find High-Paying Work
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 glass border-none rounded-[48px] bg-white/[0.02]">
        <StatCard icon={<TrendingUp />} value="$12.4M" label="Payments Handled" />
        <StatCard icon={<Users />} value="85k+" label="Elite Freelancers" />
        <StatCard icon={<Shield />} value="99.9%" label="Secure Escrow" />
        <StatCard icon={<Zap />} value="< 2s" label="AI Matching" />
      </section>

      {/* Features Section */}
      <section className="space-y-16 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Why Choice <span className="text-indigo-400">GigSphere?</span></h2>
          <p className="text-slate-400">Production-ready features designed for the 2026 workforce.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="text-indigo-400" />} 
            title="AI Proposal Ranking" 
            desc="Our integrated Claude layer automatically analyzes and ranks proposals based on skill-fit and value, saving you hours of screening."
          />
          <FeatureCard 
            icon={<Shield className="text-secondary" />} 
            title="Stripe Escrow Payments" 
            desc="Funds are held securely by Stripe and released only when work is delivered and approved. Total peace of mind for both parties."
          />
          <FeatureCard 
            icon={<Clock className="text-cyan-400" />} 
            title="Real-time Collaboration" 
            desc="Chat instantly with your hired freelancer through our WebSocket-powered messaging system with full history persistence."
          />
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="text-center space-y-2 p-6">
    <div className="flex justify-center text-slate-500">{React.cloneElement(icon, { size: 20 })}</div>
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass p-10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-2">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Landing;
