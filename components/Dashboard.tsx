import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Move, DashboardSummary, MoveStatus } from '../types';
import { AdminPanel } from './AdminPanel';

interface DashboardProps {
  user: User;
  onSelectMove: (id: string) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectMove, onLogout }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allMoves, setAllMoves] = useState<Move[]>([]);
  const [filteredMoves, setFilteredMoves] = useState<Move[]>([]);
  const [statusFilter, setStatusFilter] = useState<MoveStatus | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const loadData = async () => {
      const s = await api.getDashboard(user);
      const m = await api.getMoves(user);
      setSummary(s);
      setAllMoves(m);
    };
    loadData();
  }, [user]);

  useEffect(() => {
    let result = [...allMoves];
    
    if (statusFilter !== 'ALL') {
      result = result.filter(m => m.status === statusFilter);
    }
    
    if (dateRange.start) {
      result = result.filter(m => new Date(m.created_at) >= new Date(dateRange.start));
    }
    
    if (dateRange.end) {
      result = result.filter(m => new Date(m.created_at) <= new Date(dateRange.end));
    }

    setFilteredMoves(result);
  }, [allMoves, statusFilter, dateRange]);

  if (user.role === 'admin') {
    return <AdminPanel user={user} onSelectMove={onSelectMove} onLogout={onLogout} />;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {user.role === 'company' ? user.company_name : 'Control Center'}
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            {user.role === 'company' ? 'Carrier Operations Portal' : 'Personal Inventory Protection'}
          </p>
        </div>
      </div>

      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Projects</p>
          <p className="text-2xl md:text-3xl font-black text-blue-600">{allMoves.length}</p>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <p className="text-2xl md:text-3xl font-black text-slate-800">Normal</p>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assets</p>
          <p className="text-2xl md:text-3xl font-black text-slate-800">{summary?.unverified_items || 0}</p>
        </div>
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alerts</p>
          <p className="text-2xl md:text-3xl font-black text-amber-500">0</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl text-white">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
           Filter Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">By Status</label>
            <div className="relative">
               <select 
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as any)}
                 className="w-full bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
               >
                 <option value="ALL">All Statuses</option>
                 {Object.values(MoveStatus).map(s => (
                   <option key={s} value={s}>{s}</option>
                 ))}
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
               </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">From Date</label>
            <input 
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 invert-calendar"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">To Date</label>
            <input 
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 invert-calendar"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
          {user.role === 'company' ? 'Assigned Move Files' : 'Documentation Records'} ({filteredMoves.length})
        </h3>
        
        {filteredMoves.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching records found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMoves.map(move => (
              <button
                key={move.id}
                onClick={() => onSelectMove(move.id)}
                className="group w-full bg-white border border-slate-200 p-6 md:p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-500 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.98]"
              >
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Move Hash</p>
                  <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{move.id.slice(0, 12)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      move.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {move.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(move.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-3 md:p-4 rounded-3xl transition-all shadow-inner">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};