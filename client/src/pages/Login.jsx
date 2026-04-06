import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCircle, Mail, Lock, UserPlus, Fingerprint } from 'lucide-react';
import { supabase } from '../utils/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' }
      });
    } catch (err) {
      setError('Google Sign In failed. Mission aborted.');
    }
  };

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
    <div className="container flex items-center justify-center py-20">
      <div className="glass w-full max-w-md p-10 space-y-8 animate-fade">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-white">Welcome Back</h2>
          <p className="text-slate-400 font-medium tracking-wide">Continue your gig journey</p>
        </div>

        {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" 
                className="input pl-12" 
                placeholder="nanda@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="password" 
                className="input pl-12" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-bold shadow-indigo-500/25"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>

          <div className="flex items-center space-x-4 py-2">
             <div className="h-px flex-grow bg-white/5"></div>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">or continue with</span>
             <div className="h-px flex-grow bg-white/5"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 group"
          >
             <Fingerprint className="w-4 h-4 text-indigo-400 group-hover:scale-125 transition-transform" />
             <span>Google Authenticator</span>
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm font-medium">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1">Join GigSphere free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
