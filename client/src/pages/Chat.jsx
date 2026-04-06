import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, User, Search, MessageSquare, ShieldCheck, Sparkles, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (!user) return;
    fetchMessages();

    // Subscribe to real-time messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(full_name, avatar_url)
        `)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    } catch (err) {
      console.error('Fetch messages failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          content: newMessage.trim(),
          type: 'text'
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Send message failed', err);
      alert('Failed to transmit message through the sphere.');
    } finally {
      setSending(false);
    }
  };

  if (!user) return <div className="container py-20 text-center text-rose-400 font-bold uppercase tracking-widest">Unauthorized Access. Secure Connection Required.</div>;

  return (
    <div className="container px-6 py-12 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-6">
            <Link to="/dashboard" className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all">
               <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
               <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 lowercase">
                  Sphere <span className="text-indigo-400">Pulse</span> <MessageSquare className="w-6 h-6 text-indigo-400" />
               </h1>
               <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Secure Quantum Hub Active
               </p>
            </div>
         </div>
      </div>

      <div className="flex-grow flex gap-8 overflow-hidden">
         {/* Agents Sidebar */}
         <div className="w-80 hidden lg:flex flex-col gap-6">
            <div className="glass p-6 bg-white/[0.01] border-none rounded-[32px] space-y-6">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" className="input pl-10 h-12 bg-white/5 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" placeholder="Search Agents..." />
               </div>
               
               <div className="space-y-4">
                  <ActiveAgent name="Claude AI" status="Active Support" active />
                  <ActiveAgent name="System Admin" status="Online" />
                  <ActiveAgent name="Global Node" status="Standby" />
               </div>
            </div>
            
            <div className="glass p-8 bg-indigo-500/10 border-none rounded-[32px] flex flex-col items-center text-center space-y-4">
               <ShieldCheck className="w-10 h-10 text-indigo-400" />
               <div className="space-y-1">
                  <div className="text-white font-black uppercase text-xs tracking-widest">End-to-End Encryption</div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your missions stay within the sphere.</p>
               </div>
            </div>
         </div>

         {/* Chat Main Area */}
         <div className="flex-grow flex flex-col glass border-none bg-white/[0.01] rounded-[48px] overflow-hidden relative">
            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-10 space-y-8 scrollbar-hide"
            >
               {loading ? (
                  <div className="h-full flex items-center justify-center animate-pulse text-indigo-400 font-black uppercase tracking-[0.2em]">Synchronizing Stream...</div>
               ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                     <Sparkles className="w-12 h-12 text-indigo-500/20" />
                     <p className="text-slate-600 font-black uppercase tracking-widest text-sm">Sphere stream is quiet. Start a mission brief.</p>
                  </div>
               ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[70%] space-y-2 ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                          <div className={`p-6 rounded-[2rem] text-lg font-medium tracking-tight ${
                             msg.sender_id === user.id 
                             ? 'bg-indigo-500 text-white rounded-tr-none shadow-2xl shadow-indigo-500/20' 
                             : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                          }`}>
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                             {msg.sender_id === user.id ? 'You' : (msg.sender?.full_name || 'Agent')} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
               <input
                 type="text"
                 className="flex-grow input h-16 bg-white/[0.01] border-white/5 rounded-[2rem] px-8 text-lg font-medium focus:border-indigo-500/50 transition-all"
                 placeholder="Type your encrypted message..."
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
               />
               <button 
                 type="submit" 
                 disabled={sending || !newMessage.trim()}
                 className="w-16 h-16 rounded-[2rem] bg-indigo-500 shadow-2xl shadow-indigo-500/20 flex items-center justify-center text-white hover:scale-105 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
               >
                 {sending ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

const ActiveAgent = ({ name, status, active }) => (
  <div className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${active ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5'}`}>
     <div className="relative">
        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/5 flex items-center justify-center text-xs font-black text-slate-400">
           {name.charAt(0)}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a]"></div>
     </div>
     <div className="flex-grow">
        <div className="text-white font-black text-xs uppercase tracking-tight">{name}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{status}</div>
     </div>
  </div>
);

export default Chat;
