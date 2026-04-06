import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight, UserPlus, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await register(formData.email, formData.password, formData.fullName, formData.role);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed. System rejected your credentials.');
      }
    } catch (err) {
      setError('An unexpected system error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-2xl space-y-8 glass p-10 relative overflow-hidden group border-white/5 hover:border-indigo-500/30 transition-all duration-500">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all duration-700"></div>

        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <UserPlus className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-2">
              Join the Sphere <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </h2>
            <p className="text-slate-400 font-medium text-lg">Select your path and start building today.</p>
          </div>
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-bold animate-fade relative z-10">
            {error}
          </div>
        )}

        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 pb-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'freelancer' })}
              className={`p-8 rounded-[2rem] border-2 transition-all duration-300 text-center space-y-4 ${
                formData.role === 'freelancer' ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-2xl shadow-indigo-500/20' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-center"><Building2 className="w-10 h-10" /></div>
              <div className="font-black text-xl tracking-tight">Freelancer</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'client' })}
              className={`p-8 rounded-[2rem] border-2 transition-all duration-300 text-center space-y-4 ${
                formData.role === 'client' ? 'bg-secondary/10 border-secondary text-white shadow-2xl shadow-secondary/20' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-center"><User className="w-10 h-10" /></div>
              <div className="font-black text-xl tracking-tight">Client</div>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  className="input pl-12 h-16 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="nk"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">System Mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  className="input pl-12 h-16 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="nandakumarn166@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Secret Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  className="input pl-12 h-16 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-20 text-2xl font-black tracking-tighter flex items-center justify-center shadow-2xl shadow-indigo-500/20 group/btn"
          >
            {loading ? (
              <Loader2 className="animate-spin w-8 h-8" />
            ) : (
              <span className="flex items-center gap-4">
                Initialize Account
                <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-all duration-500" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center pt-8 space-y-4 relative z-10">
          <p className="text-slate-500 text-lg font-medium">
            Already verified within the sphere?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-all font-black decoration-indigo-400/30 underline-offset-8 hover:underline">
              Enter Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
