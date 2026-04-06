import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Placeholder for auth context
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300 border-none shadow-xl mx-4 my-2 rounded-[24px]">
      <div className="container px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
            <Rocket className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-sans tracking-tight">GigSphere</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/gigs" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}>Browse Gigs</NavLink>
          {user?.role === 'client' && (
            <NavLink to="/post-gig" className="btn btn-primary btn-xs px-4 py-2">Post a Gig</NavLink>
          )}

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 group focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-indigo-500/30">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{user.fullName}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 glass animate-fade shadow-2xl overflow-hidden py-1 border border-white/10">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Dashboard</Link>
                  <Link to={`/profile/${user.id}`} className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">Your Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn btn-primary text-sm px-6">Join Free</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-fade p-6 space-y-4 rounded-b-[24px]">
          <NavLink to="/gigs" className="block text-slate-300 hover:text-white">Browse Gigs</NavLink>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-slate-300 hover:text-white">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-rose-400 pt-2 border-t border-white/5"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Join</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
