import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, LayoutGrid, Users, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const GigCard = ({ gig }) => {
  return (
    <div className="glass p-6 hover:border-indigo-500/50 transition-all group hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <span className="badge flex items-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Briefcase className="w-3 h-3 mr-1" />
          {gig.status === 'open' ? 'Immediate Start' : 'In Progress'}
        </span>
        <span className="text-xl font-bold text-emerald-400 flex items-center">
          <DollarSign className="w-5 h-5" />
          {gig.budget}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3 text-white line-clamp-1">{gig.title}</h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{gig.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {gig.skills_required.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-white/5">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10">
             {gig.client?.avatar_url ? (
               <img src={gig.client.avatar_url} alt="client" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">{gig.client?.full_name?.charAt(0) || 'C'}</div>
             )}
          </div>
          <span className="text-xs font-semibold text-slate-400">{gig.client?.full_name || 'Client'}</span>
        </div>
        
        <Link to={`/gigs/${gig.id}`} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest flex items-center">
          View Details
          <Clock className="ml-1 w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default GigCard;
