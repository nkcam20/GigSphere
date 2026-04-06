import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, Info, Rocket } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'freelancer', // Default
    bio: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(response.data.data.user, response.data.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-20">
      <div className="glass w-full max-w-2xl p-12 space-y-10 animate-fade">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white">Join the <span className="text-indigo-400">Sphere.</span></h2>
          <p className="text-slate-400 font-medium tracking-wide">Select your path and start building today.</p>
        </div>

        {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
             {/* Role Selection */}
             <div className="col-span-2 space-y-3">
               <label className="input-label">I'm joining as a...</label>
               <div className="grid grid-cols-2 gap-4">
                 <button 
                   type="button"
                   onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                   className={`p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all border ${formData.role === 'freelancer' ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                 >
                   <Briefcase className={formData.role === 'freelancer' ? 'text-indigo-400' : 'text-slate-400'} />
                   <span className={`font-bold ${formData.role === 'freelancer' ? 'text-white' : 'text-slate-400'}`}>Freelancer</span>
                 </button>
                 <button 
                   type="button"
                   onClick={() => setFormData({ ...formData, role: 'client' })}
                   className={`p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all border ${formData.role === 'client' ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                 >
                   <User className={formData.role === 'client' ? 'text-indigo-400' : 'text-slate-400'} />
                   <span className={`font-bold ${formData.role === 'client' ? 'text-white' : 'text-slate-400'}`}>Client</span>
                 </button>
               </div>
             </div>

            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input name="full_name" className="input pl-12" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input name="email" type="email" className="input pl-12" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input name="password" type="password" className="input pl-12" placeholder="********" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            {formData.role === 'freelancer' && (
              <div className="input-group">
                <label className="input-label">Skills (comma separated)</label>
                <div className="relative group">
                  <Rocket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input name="skills" className="input pl-12" placeholder="React, Node, Python" value={formData.skills} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-5 text-lg font-black tracking-wide shadow-indigo-500/25 uppercase">
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-black tracking-normal ml-2 hover:underline transition-all">SIGN IN HERE</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
