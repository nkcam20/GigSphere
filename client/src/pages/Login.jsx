import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.data.user, response.data.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md space-y-8 glass p-10 relative overflow-hidden group border-white/5 hover:border-indigo-500/30 transition-all duration-500">
        {/* Animated Background Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>

        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-2">
              Welcome Back <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-tight">Elite access to the GigSphere</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-bold animate-fade relative z-10">
            {error}
          </div>
        )}

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  className="input pl-12 h-16 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-all text-lg font-medium"
                  placeholder="nanda@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Access Phrase</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="input pl-12 h-16 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-all text-lg font-medium"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-16 text-xl font-black tracking-tight flex items-center justify-center shadow-2xl shadow-indigo-500/20 group/btn overflow-hidden"
          >
            {loading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <span className="flex items-center gap-3">
                Authenticate
                <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-all duration-300" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center pt-6 items-center flex flex-col gap-4 relative z-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <p className="text-slate-500 text-base font-medium">
            New to the sphere?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-all font-black decoration-indigo-400/30 underline-offset-8 hover:underline">
              Initialize Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
