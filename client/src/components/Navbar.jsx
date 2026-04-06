import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut, ChevronDown, MessageSquare, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300 border-none shadow-2xl mx-4 my-2 rounded-[32px] bg-white/[0.02] backdrop-blur-3xl">
      <div className="container px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
            <Rocket className="text-white w-7 h-7 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white font-sans tracking-tighter leading-none">GigSphere</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none mt-1">AI Marketplace</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          <NavLink to="/gigs" className={({isActive}) => `text-xs font-black uppercase tracking-widest transition-all hover:text-white ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>Browse Missions</NavLink>
          
          {user && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-white ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                <LayoutDashboard className="w-4 h-4" />
                Command
              </NavLink>
              <NavLink to="/chat" className={({isActive}) => `flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-white ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                <div className="relative">
                   <MessageSquare className="w-4 h-4" />
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border-2 border-[#0f172a]"></span>
                </div>
                Pulse
              </NavLink>
            </>
          )}

          {user?.role === 'client' && (
            <NavLink to="/post-gig" className="btn btn-primary h-12 px-6 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 group">
               Launch Mission
               <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </NavLink>
          )}

          {user ? (
            <div className="relative h-12 flex items-center">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 group focus:outline-none bg-white/5 px-4 py-2 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-indigo-400">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-black text-white uppercase tracking-tight">{user.full_name?.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-56 glass animate-slide shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden py-2 border border-white/10 rounded-3xl bg-[#0f172a]/95">
                  <div className="px-5 py-3 border-b border-white/5 mb-2">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Agent Identity</div>
                     <div className="text-sm font-black text-white uppercase truncate">{user.full_name}</div>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase text-slate-300 hover:bg-white/5 hover:text-white transition-all tracking-widest">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    Dashboard
                  </Link>
                  <Link to={`/profile/${user.id}`} className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase text-slate-300 hover:bg-white/5 hover:text-white transition-all tracking-widest">
                    <User className="w-4 h-4 text-indigo-400" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 text-xs font-black uppercase text-rose-400 hover:bg-rose-500/10 transition-all tracking-widest mt-2 border-t border-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all">Login</Link>
              <Link to="/register" className="btn btn-primary h-12 px-8 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-indigo-500/20">Join Sphere</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-3 rounded-2xl bg-white/5 text-slate-300 hover:text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-white/10 animate-fade p-8 space-y-6 rounded-b-[32px] bg-[#0f172a]/95 mx-[-16px]">
          <NavLink to="/gigs" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white">Browse missions</NavLink>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white flex items-center gap-3">
                 <LayoutDashboard className="w-4 h-4" />
                 Command
              </Link>
              <Link to="/chat" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white flex items-center gap-3">
                 <MessageSquare className="w-4 h-4" />
                 Pulse Chat
              </Link>
              <Link to={`/profile/${user.id}`} onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white flex items-center gap-3">
                 <User className="w-4 h-4" />
                 Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-rose-400 pt-6 border-t border-white/5 font-black uppercase text-xs tracking-widest flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Logout Identity
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-outline h-14 rounded-2xl text-xs font-black uppercase tracking-widest">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary h-14 rounded-2xl text-xs font-black uppercase tracking-widest">Join</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
