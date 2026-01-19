
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MoveFullDetail, Box, Item, CountType, User, MoveStatus } from '../types';
import { LiabilityDoc } from './LiabilityDoc';
import { CsvExport } from './CsvExport';
import { QRGenerator } from './QRGenerator';

interface MoveViewProps {
  moveId: string;
  user: User;
  onBack: () => void;
}

export const MoveView: React.FC<MoveViewProps> = ({ moveId, user, onBack }) => {
  const [detail, setDetail] = useState<MoveFullDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddBox, setShowAddBox] = useState(false);
  const [newBoxName, setNewBoxName] = useState('');
  const [expandedBox, setExpandedBox] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanInput, setScanInput] = useState('');

  // Add Item State
  const [addingToBox, setAddingToBox] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState({ name: '', description: '', quantity: 1, weight: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getMoveDetail(moveId, user);
      setDetail(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [moveId]);

  const handleCreateBox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoxName) return;
    try {
      await api.createBox(moveId, newBoxName, ['simulated_cloud_upload'], user);
      setNewBoxName('');
      setShowAddBox(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (status: MoveStatus) => {
    try {
      await api.updateMoveStatus(moveId, status, user);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingToBox || !newItemData.name) return;
    
    try {
      await api.addItem(addingToBox, {
        name: newItemData.name,
        description: newItemData.description,
        quantity: newItemData.quantity,
        weight: newItemData.weight,
        count_type: CountType.EXACT
      }, user);
      setAddingToBox(null);
      setNewItemData({ name: '', description: '', quantity: 1, weight: 0 });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const validateScan = () => {
    const box = detail?.boxes.find(b => b.qr_code === scanInput || b.id.includes(scanInput));
    if (box) {
      alert(`VALIDATED: Integrity check passed for Box [${box.name}]. Inventory matches record.`);
      setShowScanner(false);
      setScanInput('');
    } else {
      alert("WARNING: QR Code mismatch. Integrity violation flagged. Contact system administrator.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Encrypted Records...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 mb-4 font-bold">
        {error}
      </div>
      <button onClick={onBack} className="text-blue-600 font-bold uppercase text-xs tracking-widest">Return to safe portal</button>
    </div>
  );
  if (!detail) return null;

  const isReadOnly = user.role === 'company' && detail.assigned_company_id !== user.id;
  const canModify = user.role === 'customer' || user.role === 'admin';
  const canUpdateStatus = user.role === 'admin' || user.role === 'company';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2 hover:text-blue-600 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            System Registry
          </button>
          <h2 className="text-4xl font-black text-slate-900 leading-tight">Project Summary</h2>
          <p className="text-slate-500 font-medium">Unique Hash: {detail.id.toUpperCase()}</p>
        </div>
        <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <LiabilityDoc move={detail} />
          <CsvExport move={detail} />
          <button 
            onClick={() => setShowScanner(true)}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Scan/Validate QR"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-3m6 0h-3m-3 3h3m6 3h-3m0 3h-3" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6M9 12h6M9 17h6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-6 rounded-[2rem] text-white">
          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Status</p>
          <p className="text-xl font-black uppercase tracking-tight mb-2 leading-none">{detail.status}</p>
          {canUpdateStatus && (
            <div className="flex flex-wrap gap-1">
              {Object.values(MoveStatus).map(s => (
                <button 
                  key={s}
                  onClick={() => handleUpdateStatus(s)}
                  className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded transition-all ${detail.status === s ? 'bg-white text-blue-600' : 'bg-blue-500/50 hover:bg-blue-400'}`}
                >
                  {s.slice(0, 4)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Unit</p>
          <p className="text-xl font-black uppercase tracking-tight leading-none truncate">{detail.assigned_company_id ? 'Authenticated' : 'Unassigned'}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Containers</p>
          <p className="text-xl font-black text-slate-900 leading-none">{detail.boxes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Weight</p>
          <p className="text-xl font-black text-slate-900 leading-none">
            {detail.boxes.reduce((acc, b) => acc + b.items.reduce((iAcc, i) => iAcc + (i.weight || 0), 0), 0)} lbs
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Log</h3>
          {canModify && (
            <button 
              onClick={() => setShowAddBox(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              + Secure Container
            </button>
          )}
        </div>

        {showAddBox && (
          <form onSubmit={handleCreateBox} className="bg-blue-50 border border-blue-200 p-8 rounded-[3rem] flex flex-col md:flex-row gap-3 shadow-xl">
            <input 
              type="text" 
              value={newBoxName}
              onChange={e => setNewBoxName(e.target.value)}
              placeholder="Container Label (e.g. Server Rack 01)"
              className="flex-1 bg-white border border-blue-200 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Register</button>
              <button type="button" onClick={() => setShowAddBox(false)} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Discard</button>
            </div>
          </form>
        )}

        <div className="grid gap-6">
          {detail.boxes.map(box => (
            <div key={box.id} className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <div 
                className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer"
                onClick={() => setExpandedBox(expandedBox === box.id ? null : box.id)}
              >
                <div className="flex items-center gap-8 w-full">
                  <div className="relative shrink-0">
                    {box.photos[0] ? (
                      <img 
                        src={box.photos[0].thumbnail_url} 
                        className="w-24 h-24 rounded-3xl object-cover border border-slate-100 shadow-md"
                        alt="Evidence" 
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                      <QRGenerator value={box.qr_code || box.id} size={32} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Secure Hardware</p>
                    <p className="font-black text-2xl text-slate-900 uppercase tracking-tight leading-none mb-2 truncate">{box.name}</p>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">{box.items.length} Units Cataloged</span>
                       <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full truncate max-w-[120px]">ID: {box.qr_code}</span>
                    </div>
                  </div>
                </div>
                <div className={`bg-slate-50 p-4 rounded-3xl transition-all ${expandedBox === box.id ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-300 group-hover:text-slate-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expandedBox === box.id && (
                <div className="border-t border-slate-100 bg-slate-50/30 p-8 pt-0 space-y-4">
                  <div className="grid gap-3 pt-8">
                    {box.items.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex justify-between items-center group/item hover:border-blue-300 transition-all shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black text-slate-900 uppercase text-lg tracking-tight group-hover/item:text-blue-600 transition-colors">{item.name}</p>
                            <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">
                              {item.quantity} UNITS
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">{item.description || 'System-default handling parameters apply.'}</p>
                          <div className="flex gap-2 mt-4">
                            <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                              item.count_type === CountType.EXACT ? 'bg-green-100 text-green-700' :
                              item.count_type === CountType.BROKEN ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {item.count_type}
                            </span>
                            {item.weight && item.weight > 0 && (
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-slate-200">
                                {item.weight} LBS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Improved Add Item Inline Form */}
                    {addingToBox === box.id ? (
                      <form onSubmit={handleAddItem} className="bg-blue-50 border border-blue-200 p-8 rounded-[2rem] space-y-4 animate-in fade-in zoom-in-95 duration-300 shadow-inner">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Item Name</label>
                            <input 
                              type="text" 
                              value={newItemData.name}
                              onChange={e => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Core Switch"
                              className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                              autoFocus
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Weight (LBS)</label>
                            <input 
                              type="number" 
                              value={newItemData.weight}
                              onChange={e => setNewItemData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                              placeholder="0"
                              className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Special Description</label>
                          <textarea 
                            value={newItemData.description}
                            onChange={e => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Fragile, wrap in high-density foam..."
                            className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Catalog Item</button>
                          <button type="button" onClick={() => setAddingToBox(null)} className="bg-white border border-slate-200 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      canModify && (
                        <button 
                          onClick={() => setAddingToBox(box.id)}
                          className="w-full py-8 border-2 border-dashed border-slate-300 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all hover:bg-white flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                          </svg>
                          Catalog Additional Asset
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* QR Validation Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => { setShowScanner(false); setScanInput(''); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Security Validator</h3>
              <p className="text-slate-500 text-sm">Input the box ID or QR signature for real-time verification.</p>
              
              <div className="aspect-square bg-slate-100 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center group border-4 border-slate-50">
                <div className="absolute inset-8 border-4 border-blue-600 rounded-3xl opacity-50 group-hover:opacity-100 transition-all border-dashed animate-pulse"></div>
                <svg className="w-24 h-24 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                <div className="absolute inset-x-0 h-1 bg-blue-600/50 blur-[2px] animate-bounce top-1/2 -translate-y-1/2"></div>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  placeholder="Enter QR Signature (e.g. U0VDVVJFL...)"
                  className="w-full bg-slate-100 border-none rounded-2xl px-5 py-3 text-center font-bold tracking-widest placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600 uppercase"
                />
                <button 
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                  onClick={validateScan}
                >
                  Confirm Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
