import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { MessageSquare, Send, CheckCircle, Package, DollarSign, Clock, ShieldCheck, User, Zap } from 'lucide-react';
import { format } from 'date-fns';

const ContractDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const socketRef = useRef();
  const msgsEndRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cRes, mRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/contracts`), // Fetching all since I don't have individual GET yet
          axios.get(`http://localhost:5000/api/chat/${id}`)
        ]);
        
        const currentContract = cRes.data.data.contracts.find(c => c.id === id);
        setContract(currentContract);
        setMessages(mRes.data.data.messages);
      } catch (err) {
        console.error('Fetch data failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Socket Setup
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join_contract', id);
    
    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/chat/send', { contract_id: id, content: newMessage });
      setNewMessage('');
    } catch (err) {
      console.error('Send message failed', err);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await axios.post('http://localhost:5000/api/contracts/checkout', { contract_id: id });
      window.location.href = res.data.data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setPaying(false);
    }
  };

  const handleDelivery = async () => {
    try {
      await axios.post(`http://localhost:5000/api/contracts/${id}/deliver`);
      alert('Mission marked as delivered! Awaiting client approval.');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Delivery marking failed');
    }
  };

  const handleApproval = async () => {
    try {
      await axios.post(`http://localhost:5000/api/contracts/${id}/approve`);
      alert('Mission approved and funds released!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  if (loading) return <div className="container py-20 text-center animate-pulse font-black text-4xl text-slate-700">Connecting to Sphere...</div>;
  if (!contract) return <div className="container py-20 text-center">Contract Not Found</div>;

  const otherUser = user.role === 'client' ? contract.freelancer : contract.client;

  return (
    <div className="container px-6 grid lg:grid-cols-3 gap-12 py-12 animate-fade">
       {/* Left Column: Mission Chat */}
       <div className="lg:col-span-2 glass border-none flex flex-col h-[750px] shadow-2xl relative overflow-hidden bg-white/[0.02]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-indigo-400 border border-white/10">{otherUser?.full_name?.charAt(0)}</div>
                <div>
                   <h3 className="font-black text-white">{otherUser?.full_name}</h3>
                   <div className="flex items-center text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 shadow-lg shadow-emerald-500/50"></div>
                      Mission Active
                   </div>
                </div>
             </div>
             <div className="flex items-center space-x-2 badge border-none bg-indigo-500/10 text-indigo-400 px-4 py-2 font-bold uppercase text-[9px] tracking-widest">
                <Zap className="w-3 h-3 mr-2" />
                Live Channel
             </div>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 max-w-[80%] rounded-[20px] ${msg.sender_id === user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/10'}`}>
                   <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2 px-1">
                   {format(new Date(msg.sent_at), 'HH:mm')}
                </span>
              </div>
            ))}
            <div ref={msgsEndRef}></div>
          </div>

          <form onSubmit={handleSendMessage} className="p-8 border-t border-white/5 bg-white/[0.01]">
             <div className="relative group">
                <input 
                  type="text" 
                  className="input pl-14 pr-14 py-5 rounded-[24px] bg-white/5 border border-white/10 shadow-lg" 
                  placeholder="Transmit message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white transition-all transform hover:scale-110 active:scale-95 shadow-lg shadow-indigo-500/25">
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </form>
       </div>

       {/* Right Column: Mission Control */}
       <div className="space-y-8 animate-slide">
          {/* Mission Status Card */}
          <div className="glass p-10 border-none bg-indigo-500/10 shadow-2xl shadow-indigo-500/5">
             <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Phase: {contract.status}</div>
             <h2 className="text-3xl font-black text-white leading-tight mb-8">Mission Control</h2>
             
             <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between group">
                   <div className="flex items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                      <DollarSign className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Budget
                   </div>
                   <div className="text-xl font-black text-white">${contract.amount}</div>
                </div>
                
                <div className="flex items-center justify-between group">
                   <div className="flex items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                      <Clock className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Milestone
                   </div>
                   <div className="text-sm font-black text-white">Full Delivery</div>
                </div>

                <div className="flex items-center justify-between group">
                   <div className="flex items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                      <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" /> Security
                   </div>
                   <div className="text-[10px] font-black text-indigo-400 uppercase">Stripe Protected</div>
                </div>
             </div>

             <div className="pt-10 space-y-4">
                {user.role === 'client' && contract.status === 'active' && (
                  <button onClick={handlePayment} disabled={paying} className="btn btn-primary w-full py-5 text-sm font-black uppercase tracking-widest shadow-indigo-500/30">
                    {paying ? 'Processing...' : 'Deposit Funds'}
                  </button>
                )}
                
                {user.role === 'freelancer' && contract.status === 'active' && (
                   <button onClick={handleDelivery} className="btn btn-primary w-full py-5 text-sm font-black uppercase tracking-widest shadow-indigo-500/30">
                      Submit Delivery
                   </button>
                )}

                {user.role === 'client' && contract.status === 'delivered' && (
                   <button onClick={handleApproval} className="btn btn-primary w-full py-5 text-sm font-black uppercase tracking-widest shadow-indigo-500/30">
                      Release Funds
                   </button>
                )}

                {contract.status === 'completed' && (
                   <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-black uppercase tracking-widest text-xs">
                      <CheckCircle className="w-6 h-6 mx-auto mb-3" />
                      Mission Success
                   </div>
                )}
             </div>
          </div>

          {/* User Preview */}
          <div className="glass p-10 border-none bg-white/[0.01]">
             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Partner Profile</h3>
             <div className="flex items-center space-x-4 mb-4">
               <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-2xl text-indigo-400 border border-white/5">{otherUser?.full_name?.charAt(0)}</div>
               <div>
                  <h4 className="font-bold text-white text-lg leading-none">{otherUser?.full_name}</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">{user.role === 'client' ? 'Elite Freelancer' : 'Hiring Partner'}</p>
               </div>
             </div>
             <p className="text-xs text-slate-500 font-medium italic leading-relaxed py-4 border-t border-white/5 mt-6">
                “Excellent communication and technical execution throughout the project lifecycle.”
             </p>
          </div>
       </div>
    </div>
  );
};

export default ContractDetails;
