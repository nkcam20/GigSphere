import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Briefcase, Star, Clock, Globe, Shield, Rocket } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`);
        setProfile(res.data.data.user);
        setReviews(res.data.data.reviews);
      } catch (err) {
        console.error('Fetch profile failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="container py-20 text-center animate-pulse text-4xl font-black text-indigo-400">Loading Sphere profile...</div>;
  if (!profile) return <div className="container py-20 text-center">User not found</div>;

  return (
    <div className="container px-6 py-12 animate-fade">
       {/* Hero Header */}
       <div className="glass p-12 mb-12 border-none bg-white/[0.02] flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="badge bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black uppercase text-[10px] tracking-widest px-4 py-2">
                {profile.role} Path Verified
             </div>
          </div>
          
          <div className="w-40 h-40 rounded-[48px] bg-slate-800 flex items-center justify-center font-black text-6xl text-indigo-400 border-8 border-indigo-500/10 shadow-2xl shadow-indigo-500/20">
             {profile.avatar_url ? (
               <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-[40px]" />
             ) : (
               profile.full_name?.charAt(0)
             )}
          </div>
          
          <div className="flex-grow space-y-4 text-center md:text-left">
             <h1 className="text-6xl font-black text-white tracking-tighter">{profile.full_name}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center text-yellow-500">
                   {[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= Math.round(profile.avg_rating || 5) ? 'fill-current' : 'text-slate-700'}`} />)}
                   <span className="text-white font-black ml-2">{profile.avg_rating || '5.0'}</span>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center">
                   <Clock className="w-3 h-3 mr-2" />
                   On Sphere since 2026
                </div>
             </div>
          </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Skills */}
          <div className="space-y-8">
             <div className="glass p-10 border-none bg-white/[0.01]">
                <h3 className="text-xl font-black text-indigo-400 mb-6 flex items-center">
                   <Briefcase className="w-5 h-5 mr-3" />
                   Professional Bio
                </h3>
                <p className="text-slate-400 leading-relaxed font-bold italic">
                   “{profile.bio || 'Elite professional dedicated to technical excellence and cross-platform innovation on the Sphere.'}”
                </p>
             </div>

             <div className="glass p-10 border-none bg-white/[0.01]">
                <h3 className="text-xl font-black text-secondary mb-6 flex items-center">
                   <Rocket className="w-5 h-5 mr-3" />
                   Core Protocol Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                   {profile.skills?.map((skill, i) => (
                     <span key={i} className="px-4 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 border-white/10 bg-white/5">{skill}</span>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column: Experience/Reviews */}
          <div className="lg:col-span-2 space-y-8">
             <h2 className="text-4xl font-black text-white tracking-tight flex items-center">
                <Globe className="w-8 h-8 mr-4 text-indigo-400" />
                Network Feedback
             </h2>
             
             <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="glass p-8 border-none bg-white/[0.02] hover:bg-white/[0.04] transition-all transform hover:-translate-x-1">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-indigo-400 border border-white/5 text-sm">{review.reviewer?.full_name?.charAt(0)}</div>
                           <div>
                              <h4 className="font-bold text-white leading-none">{review.reviewer?.full_name}</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Project Partner</p>
                           </div>
                        </div>
                        <div className="flex items-center text-yellow-500 text-sm font-black">
                           <Star className="w-3 h-3 mr-1 fill-current" />
                           {review.rating}.0
                        </div>
                     </div>
                     <p className="text-slate-400 font-medium leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-2">
                        {review.comment}
                     </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="py-20 text-center glass border-dashed bg-transparent border-white/5">
                     <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No network logs recorded yet.</p>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;
