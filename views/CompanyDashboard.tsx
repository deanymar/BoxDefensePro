
import React, { useState, useMemo } from 'react';
import { User, Move, Box, Item, MoveStatus, CountType, ClaimResolution, ProtectionTier } from '../types';
import { Button, Card, Badge, Input, Modal, Select, SelectOption } from '../components/UI';
import { 
  Shield, Box as BoxIcon, ChevronRight, ShieldCheck, Download, Search, 
  Plus, User as UserIcon, CheckCircle, AlertCircle, Eye, 
  TrendingUp, Wallet, BarChart3, Activity, 
  Truck, PackageCheck, AlertTriangle, FileSignature, Receipt,
  DollarSign, Printer, Settings, Sparkles, Home, ArrowRight, Info, Zap, List, Filter, Globe, Archive, Clock as ClockIcon
} from 'lucide-react';
import { formatPhone } from '../constants';
import { RelocationLedgerPDF } from '../components/PDFDocuments';

interface CompanyDashboardProps {
  store: any;
}

type TabType = 'overview' | 'moves' | 'revenue';
type FilterStatus = 'all' | 'active' | 'completed' | MoveStatus;

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedMoveId, setSelectedMoveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [viewingLedgerId, setViewingLedgerId] = useState<string | null>(null);
  
  const [isCreatingMove, setIsCreatingMove] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newMoveDate, setNewMoveDate] = useState('');
  const [newProtectionTier, setNewProtectionTier] = useState<ProtectionTier>(ProtectionTier.STANDARD);
  const [newProtectionPrice, setNewProtectionPrice] = useState('199');

  const today = new Date().toISOString().split('T')[0];

  const allMoves = useMemo(() => 
    store.moves.filter((m: Move) => m.companyId === store.currentUser.id),
    [store.moves, store.currentUser.id]
  );

  const metrics = useMemo(() => {
    // Precise KPI Recalculation logic
    const liveTodayList = allMoves.filter((m: Move) => m.moveDate === today);
    const packingList = allMoves.filter((m: Move) => m.status === MoveStatus.PACKING || m.status === MoveStatus.CREATED);
    const auditReadyList = allMoves.filter((m: Move) => 
      [MoveStatus.SIGNED_MOVER, MoveStatus.SIGNED_CUSTOMER, MoveStatus.FORM_GENERATED].includes(m.status)
    );
    const openClaimsList = allMoves.filter((m: Move) => m.status === MoveStatus.CLAIM);
    const settledList = allMoves.filter((m: Move) => 
      m.status === MoveStatus.COMPLETED || m.status === MoveStatus.CLAIM_RESOLVED
    );

    let grossRev = 0;
    let payouts = 0;
    allMoves.forEach((m: Move) => {
      grossRev += m.protectionPrice || 0;
      if (m.status === MoveStatus.CLAIM_RESOLVED && m.claimResolution) {
        payouts += m.claimResolution.payoutAmount;
      }
    });

    return { 
      liveToday: { count: liveTodayList.length, items: liveTodayList, targetFilter: 'all' as FilterStatus },
      packing: { count: packingList.length, items: packingList, targetFilter: MoveStatus.PACKING },
      audit: { count: auditReadyList.length, items: auditReadyList, targetFilter: MoveStatus.SIGNED_MOVER },
      claims: { count: openClaimsList.length, items: openClaimsList, targetFilter: MoveStatus.CLAIM },
      settled: { count: settledList.length, items: settledList, targetFilter: 'completed' as FilterStatus },
      grossRev,
      netProfit: grossRev - payouts
    };
  }, [allMoves, today]);

  const filterOptions: SelectOption[] = [
    { value: 'all', label: 'Global Portfolio', description: 'View all move registries', icon: Globe },
    { value: 'active', label: 'All Active Moves', description: 'Currently in progress', icon: Activity },
    { value: 'completed', label: 'All Finalized History', description: 'Settled move files', icon: Archive },
    ...Object.values(MoveStatus).map(status => ({
      value: status,
      label: status.replace('_', ' ').toUpperCase(),
      description: `Registry status: ${status.replace('_', ' ')}`,
      icon: ClockIcon
    }))
  ];

  const filteredMoves = useMemo(() => 
    allMoves.filter((m: Move) => {
      const searchMatch = m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.customerPhone.includes(searchTerm.replace(/\D/g, ''));
      
      if (filterStatus === 'all') return searchMatch;
      if (filterStatus === 'active') return searchMatch && m.status !== MoveStatus.COMPLETED && m.status !== MoveStatus.CLAIM_RESOLVED;
      if (filterStatus === 'completed') return searchMatch && (m.status === MoveStatus.COMPLETED || m.status === MoveStatus.CLAIM_RESOLVED);
      
      return searchMatch && m.status === filterStatus;
    }),
    [allMoves, searchTerm, filterStatus]
  );

  const handleCreateMove = (e: React.FormEvent) => {
    e.preventDefault();
    store.createMove({
      customerPhone: newCustPhone,
      customerName: newCustName,
      moveDate: newMoveDate,
      protectionTier: newProtectionTier,
      protectionPrice: parseFloat(newProtectionPrice) || 0
    });
    setIsCreatingMove(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewMoveDate('');
  };

  const StatusKPI = ({ label, metric, color, description, icon: Icon, targetFilter }: { label: string, metric: { count: number, items: Move[] }, color: string, description: string, icon?: any, targetFilter: FilterStatus }) => (
    <Card 
      onClick={() => {
        setFilterStatus(targetFilter);
        setActiveTab('moves');
      }}
      className="p-8 border-none bg-white dark:bg-slate-900 shadow-xl group relative overflow-visible cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
    >
      <div className={`absolute top-0 right-0 p-4 ${color.replace('text-', 'bg-')} opacity-5 group-hover:opacity-10 transition-opacity`}>
        {Icon ? <Icon className="w-16 h-16" /> : <Activity className="w-16 h-16" />}
      </div>
      
      <div className="absolute inset-x-0 top-full pt-4 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0">
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 w-full min-w-[240px] pointer-events-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-3 border-b border-white/10 pb-2 flex items-center justify-between">
            <span className="flex items-center"><List className="w-3 h-3 mr-1" /> Client Registry: {label}</span>
            <span className="text-[8px] text-white/40 font-medium">Click Card to Filter</span>
          </p>
          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
            {metric.items.length > 0 ? metric.items.map(m => (
              <div key={m.id} className="text-xs font-bold flex justify-between gap-4 py-1.5 border-b border-white/5 last:border-0 hover:text-emerald-400 transition-colors">
                <span className="truncate">{m.customerName}</span>
                <span className="opacity-40 text-[9px] font-mono shrink-0">#{m.id.slice(-4)}</span>
              </div>
            )) : <p className="text-[10px] opacity-40 italic py-3 text-center">No active records in this stage</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</h4>
        <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
      </div>
      <h2 className={`text-5xl font-black ${color}`}>{metric.count}</h2>
      <p className="text-[9px] text-slate-400 mt-2 font-bold italic">{description}</p>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col no-print">
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b-2 border-slate-100 dark:border-slate-800 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('overview')}>
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 text-white transition-all group-hover:scale-105">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {store.currentUser.companyName}
              </h1>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 flex items-center">
                <Activity className="w-3 h-3 mr-1" /> Precision Dashboard
              </p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
             {(['overview', 'moves', 'revenue'] as const).map(tab => (
               <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
               >
                 {tab}
               </button>
             ))}
          </nav>

          <div className="flex items-center space-x-4">
             <Button variant="ghost" size="sm" icon={Home} onClick={() => store.setShowLanding(true)} className="text-[10px] uppercase font-black">Landing</Button>
             <Button variant="success" size="md" icon={Plus} onClick={() => setIsCreatingMove(true)} className="rounded-xl">Add Move</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-12 pb-32">
        
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Direct Logistics KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatusKPI label="Active Today" metric={metrics.liveToday} targetFilter="all" color="text-emerald-600" description="Moves dispatched on current date" icon={Truck} />
              <StatusKPI label="Documentation" metric={metrics.packing} targetFilter={MoveStatus.PACKING} color="text-blue-500" description="Clients currently itemizing" icon={PackageCheck} />
              <StatusKPI label="Verification" metric={metrics.audit} targetFilter={MoveStatus.SIGNED_MOVER} color="text-amber-500" description="Ledgers awaiting carrier review" icon={FileSignature} />
              <StatusKPI label="Liability Alerts" metric={metrics.claims} targetFilter={MoveStatus.CLAIM} color="text-red-500" description="Damage reports requiring audit" icon={AlertTriangle} />
              <StatusKPI label="Finalized" metric={metrics.settled} targetFilter="completed" color="text-slate-800 dark:text-white" description="Settled and archived moves" icon={CheckCircle} />
            </div>

            {/* Registry Flow Pipeline */}
            <section className="space-y-6">
               <div className="flex justify-between items-center px-2">
                 <h3 className="text-xl font-black flex items-center dark:text-white italic">
                   <ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" /> Operational Pipeline Flow
                 </h3>
                 <Badge variant="emerald">Real-time Logistics Registry</Badge>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { title: 'Registry', count: metrics.liveToday.count, sub: 'Field Activity', color: 'emerald' },
                    { title: 'Documentation', count: metrics.packing.count, sub: 'Inventory In-Progress', color: 'blue' },
                    { title: 'Audit Ready', count: metrics.audit.count, sub: 'Awaiting Verification', color: 'amber' },
                    { title: 'Settlement', count: metrics.claims.count, sub: 'Open Liabilities', color: 'red' }
                  ].map((step, idx) => (
                    <Card key={idx} className="p-8 border-none bg-white dark:bg-slate-900 shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{step.title}</h4>
                        <Badge variant={step.color as any}>{step.count}</Badge>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                        <div className={`h-full transition-all bg-${step.color}-500`} style={{ width: '100%' }} />
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{step.sub}</p>
                    </Card>
                  ))}
               </div>
            </section>

            {/* Documentation Integrity Section */}
            <Card className="p-10 bg-slate-900 text-white border-none relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5"><Zap className="w-64 h-64" /></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                <div className="space-y-6 max-w-xl">
                  <h3 className="text-2xl font-black text-emerald-400 flex items-center uppercase tracking-tighter italic">
                    <ShieldCheck className="w-8 h-8 mr-4" /> Documentation Integrity Vault
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                      Our system ensures every piece of evidence—from photo documentation to digital signatures—is automatically verified. This creates a secure, indisputable record of item condition prior to transport.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        'Verified Photo Timestamps',
                        'Geo-Tagged Digital Signatures',
                        'Real-time Liability Sync',
                        'Immutable Chain-of-Custody'
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right border-l border-white/10 pl-10 md:pl-20 py-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Portfolio Protection</p>
                  <h2 className="text-6xl font-black text-white italic tracking-tighter">98.4%</h2>
                  <p className="text-[9px] font-bold text-emerald-500 mt-2 uppercase tracking-widest">Enterprise Compliance</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Moves Tab */}
        {activeTab === 'moves' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-6 top-[3.2rem] -translate-y-1/2 w-5 h-5 text-slate-300" />
                <Input 
                  label="Search Inventory"
                  placeholder="Client name or phone..."
                  className="pl-16 bg-white dark:bg-slate-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-5">
                <Select 
                  label="Cargo Status Registry"
                  options={filterOptions}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val as FilterStatus)}
                />
              </div>

              <div className="md:col-span-3">
                <Button variant="success" size="xl" fullWidth icon={Plus} onClick={() => setIsCreatingMove(true)} className="rounded-2xl shadow-xl py-4">New Client Move</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {filteredMoves.length > 0 ? filteredMoves.map(move => (
                 <Card 
                  key={move.id} 
                  className={`group border-none ${selectedMoveId === move.id ? 'ring-4 ring-emerald-500' : 'bg-white dark:bg-slate-900 shadow-xl'}`} 
                  onClick={() => setSelectedMoveId(selectedMoveId === move.id ? null : move.id)}
                 >
                    <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                       <div className="flex items-center space-x-6 w-full md:w-auto">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${move.status === MoveStatus.CLAIM ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             <UserIcon className="w-8 h-8" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                               <h4 className="font-black text-2xl text-slate-900 dark:text-white">{move.customerName}</h4>
                               {move.protectionTier === ProtectionTier.ENHANCED && (
                                 <Badge variant="emerald">Enhanced Policy</Badge>
                               )}
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
                               {formatPhone(move.customerPhone)} • Move Date: <span className="text-slate-700 dark:text-slate-300 font-black">{move.moveDate === today ? 'TODAY' : move.moveDate}</span>
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-12 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cargo Status</p>
                             <Badge variant={move.status === MoveStatus.CLAIM ? 'red' : 'emerald'}>{move.status.replace('_', ' ')}</Badge>
                          </div>
                          <ChevronRight className={`w-8 h-8 text-slate-300 transition-transform ${selectedMoveId === move.id ? 'rotate-90 text-emerald-600' : ''}`} />
                       </div>
                    </div>
                    {selectedMoveId === move.id && (
                      <div className="p-8 pt-0 border-t-2 border-slate-50 dark:border-slate-800 animate-in slide-in-from-top-4 flex flex-wrap gap-4 mt-4">
                          <Button size="lg" icon={Eye} onClick={(e) => { e.stopPropagation(); setViewingLedgerId(move.id); }} className="flex-1">Audit Ledger</Button>
                          <Button variant="secondary" size="lg" icon={Settings} onClick={(e) => { e.stopPropagation(); }} className="flex-1">Client Settings</Button>
                      </div>
                    )}
                 </Card>
               )) : (
                 <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="font-black text-slate-400 uppercase tracking-widest">No matching registry records found</p>
                    <Button variant="ghost" onClick={() => setFilterStatus('all')} className="mt-4 text-[10px] uppercase font-black">Reset View</Button>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-10 bg-white dark:bg-slate-900 border-l-8 border-emerald-500">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 text-emerald-600">Total Portfolio Sales</h4>
                   <h2 className="text-5xl font-black dark:text-white">${metrics.grossRev.toLocaleString()}</h2>
                   <div className="mt-8 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full w-fit">
                      <TrendingUp className="w-4 h-4 mr-2" /> Positive Trend
                   </div>
                </Card>
                <Card className="p-10 bg-white dark:bg-slate-900 border-l-8 border-blue-500">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 text-blue-600">Net Retained Profit</h4>
                   <h2 className="text-5xl font-black text-blue-600">${metrics.netProfit.toLocaleString()}</h2>
                   <p className="mt-8 text-xs font-bold text-blue-400 italic">Accrued Pre-Claims</p>
                </Card>
             </div>
          </div>
        )}
      </main>

      {/* New Move Modal */}
      <Modal isOpen={isCreatingMove} onClose={() => setIsCreatingMove(false)} title="Initialize New Client Move">
        <form onSubmit={handleCreateMove} className="space-y-6">
          <Input label="Customer Full Legal Name" placeholder="e.g. Jonathan Wright" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} required />
          <Input label="Verified Phone ID" placeholder="(555) 555-5555" value={newCustPhone} onChange={(e) => setNewCustPhone(formatPhone(e.target.value))} required />
          <Input label="Scheduled Move Date" type="date" value={newMoveDate} onChange={(e) => setNewMoveDate(e.target.value)} required />
          
          <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 space-y-6">
             <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Protection Builder</h4>
             </div>
             <div className="grid grid-cols-2 gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl">
                <button type="button" onClick={() => setNewProtectionTier(ProtectionTier.STANDARD)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newProtectionTier === ProtectionTier.STANDARD ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Standard</button>
                <button type="button" onClick={() => setNewProtectionTier(ProtectionTier.ENHANCED)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newProtectionTier === ProtectionTier.ENHANCED ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}>Enhanced</button>
             </div>
          </div>

          <Button fullWidth size="xl" variant="success" type="submit" className="shadow-2xl">Deploy Portfolio Link</Button>
        </form>
      </Modal>

      {/* Audit Modal */}
      <Modal isOpen={!!viewingLedgerId} onClose={() => setViewingLedgerId(null)} title="Compliance Ledger Audit" className="max-w-4xl">
         <div className="flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {store.moves.find((m: Move) => m.id === viewingLedgerId) && (
                 <RelocationLedgerPDF 
                   id="ledger-audit-pdf"
                   move={store.moves.find((m: Move) => m.id === viewingLedgerId)!}
                   boxes={store.boxes.filter((b: Box) => b.moveId === viewingLedgerId)}
                   items={store.items.filter((i: Item) => store.boxes.filter((b: Box) => b.moveId === viewingLedgerId).some(b => b.id === i.boxId))}
                 />
               )}
            </div>
            <div className="flex gap-4 mt-8 no-print pt-6 border-t-2 border-slate-100 dark:border-slate-800">
               <Button variant="secondary" className="flex-1" size="lg" onClick={() => setViewingLedgerId(null)}>Exit Audit</Button>
               <Button variant="primary" className="flex-1" size="lg" icon={Printer} onClick={() => window.print()}>Print Certified Ledger</Button>
            </div>
         </div>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        
        @media print {
          body * { visibility: hidden; }
          #ledger-audit-pdf, #ledger-audit-pdf * { visibility: visible; }
          #ledger-audit-pdf { position: absolute; left: 0; top: 0; width: 100%; height: auto; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};
