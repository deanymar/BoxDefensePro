import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserRole, Move } from '../types';

interface AdminPanelProps {
  user: User;
  onSelectMove: (id: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onSelectMove, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'moves' | 'permissions' | 'config' | 'system'>('users');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const u = await api.listUsers(user);
      const m = await api.getMoves(user);
      setUsers(u);
      setMoves(m);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    await api.updateUserRole(userId, role, user);
    loadData();
  };

  const handleToggleFlag = async (userId: string) => {
    await api.toggleUserFlag(userId, user);
    loadData();
  };

  const NavItem: React.FC<{ id: typeof activeTab; icon: React.ReactNode; label: string }> = ({ id, icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${
        activeTab === id ? 'bg-blue-600 text-white border-r-4 border-blue-400 font-bold shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm uppercase tracking-widest font-black">{label}</span>
    </button>
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center p-8 text-slate-400 font-bold uppercase tracking-widest animate-pulse min-h-screen">
      Accessing Secure Admin Vault...
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-screen">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="font-bold uppercase text-sm tracking-tighter">Admin HQ</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Left Sidebar */}
      <aside className={`
        fixed inset-0 md:relative md:flex flex-col w-full md:w-72 bg-slate-950 text-white z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">BoxDefense<br/><span className="text-[10px] text-blue-500 tracking-[0.3em]">Administrator</span></h1>
          </div>
        </div>

        <nav className="flex-1 mt-4 md:mt-0">
          <NavItem id="users" label="User Registry" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>} />
          <NavItem id="moves" label="Surveillance" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>} />
          <NavItem id="permissions" label="RBAC Matrix" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>} />
          <NavItem id="config" label="System Config" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} />
          <NavItem id="system" label="Diagnostics" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>} />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 font-bold transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1l-1 1H3l-1-1V5l1-1h9l1 1v1"/></svg>
            Logout Terminated
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 md:h-screen overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Authenticated Administrator</p>
              <h2 className="text-4xl font-black text-slate-900 leading-tight capitalize">{activeTab.replace('-', ' ')}</h2>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500">Node Status: <span className="text-green-600">Encrypted</span></span>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'users' && (
              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u.id} className={`hover:bg-slate-50/80 transition-all ${u.is_flagged ? 'bg-red-50/50' : ''}`}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${u.is_flagged ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {u.phone.slice(-2)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.phone}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">REF: {u.id.slice(0,10)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
                            >
                              <option value="customer">Customer</option>
                              <option value="company">Company</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            {u.is_flagged ? (
                              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                Flagged Entity
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                                Verified
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => handleToggleFlag(u.id)}
                              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                                u.is_flagged ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-900/10' : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              {u.is_flagged ? 'Clear Signal' : 'Flag Source'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'moves' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moves.map(m => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMove(m.id)}
                    className="bg-white border border-slate-200 p-8 rounded-[3rem] flex items-center justify-between hover:border-blue-500 transition-all text-left shadow-sm group hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Move Instance</p>
                      <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">{m.id.slice(0, 16)}</p>
                      <div className="mt-3 flex gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-slate-200">{m.status}</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">LOG: {new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-4 rounded-3xl transition-all shadow-inner">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-10">
                <div className="flex justify-between items-start">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-slate-900">RBAC Logic Matrix</h3>
                    <p className="text-slate-500 text-sm">Control feature access levels across the identity spectrum.</p>
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">+ New Definition</button>
                </div>
                
                <div className="grid gap-6">
                  {[
                    { role: 'Admin', color: 'slate-900', perms: ['Full System CRUD', 'User Flagging', 'Role Management', 'Global Metrics', 'Config Updates'] },
                    { role: 'Customer', color: 'blue-600', perms: ['Create Moves', 'Add Boxes/Items', 'Photo Evidence', 'Sign Documents', 'CSV Export'] },
                    { role: 'Company', color: 'green-600', perms: ['Read Assigned Moves', 'Update Move Status', 'Download Evidence', 'Validate QR Codes'] }
                  ].map(r => (
                    <div key={r.role} className="border border-slate-200 p-8 rounded-[3rem] bg-slate-50/20 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${r.color}`}></div>
                          <h4 className={`text-xl font-black uppercase tracking-tight`}>{r.role} Profile</h4>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest bg-white px-5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 transition-all shadow-sm">Audit Capability</button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {r.perms.map(p => (
                          <span key={p} className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                 <h3 className="text-2xl font-black mb-8 uppercase tracking-tight text-slate-900">Inventory System Configuration</h3>
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Storage & Performance</h4>
                       <div className="space-y-4">
                          <label className="block">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Thumbnail Resolution</span>
                             <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option>300 x 200 (Default)</option>
                                <option>150 x 100 (Eco Mode)</option>
                                <option>600 x 400 (Legal HD)</option>
                             </select>
                          </label>
                          <label className="block">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cache Regeneration Rate</span>
                             <select className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option>Real-time (Write-through)</option>
                                <option>5 Minute Batches</option>
                                <option>Manual Only</option>
                             </select>
                          </label>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Security Protocol</h4>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div>
                                <p className="font-bold text-slate-900">AES-256 Box Signature</p>
                                <p className="text-[10px] text-slate-500 font-bold">Encrypted QR Generation</p>
                             </div>
                             <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                             <div>
                                <p className="font-bold text-slate-900">Force Biometric MFA</p>
                                <p className="text-[10px] text-slate-500 font-bold text-red-500 uppercase">requires Enterprise license</p>
                             </div>
                             <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-12 flex justify-end">
                    <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Save Global Config</button>
                 </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="bg-slate-950 text-white p-12 rounded-[3.5rem] shadow-2xl overflow-hidden relative border border-slate-800">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <div className="relative z-10 space-y-12">
                   <div>
                      <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase">Network Diagnostics</h3>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Global Node Status: Encrypted | Load: 4%</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Inventory Volume</p>
                      <p className="text-5xl font-black tracking-tighter">2.4<span className="text-xl text-blue-500">TB</span></p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Asset Count</p>
                      <p className="text-5xl font-black tracking-tighter">{moves.length * 12}</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Cloud Links</p>
                      <p className="text-5xl font-black tracking-tighter">12<span className="text-xl text-green-500">ms</span></p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                      <p className="text-red-400/50 text-[10px] font-black uppercase tracking-widest mb-2">Security Alerts</p>
                      <p className="text-5xl font-black tracking-tighter text-red-500">{users.filter(u => u.is_flagged).length}</p>
                    </div>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                     <p className="text-blue-100 font-bold italic leading-tight text-lg">"BoxDefense Engine is operating at peak efficiency. No immediate infrastructure interventions required."</p>
                     <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap">Run Full Sweep</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};