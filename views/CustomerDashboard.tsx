
import React, { useState, useEffect } from 'react';
import { Move, Box, Item, CountType, MoveStatus, PhotoWithMeta, DamageReport, ProtectionTier } from '../types';
import { Button, Card, Badge, Modal, Input } from '../components/UI';
import { Plus, Camera, Scan, FileText, Download, ShieldCheck, Box as BoxIcon, Calendar, Info, Loader2, Image as ImageIcon, CheckCircle, AlertCircle, X, Check, Printer, Eye, FileWarning, Link as LinkIcon, Send, Share2, Mail, Smartphone, Shield } from 'lucide-react';
import { compressImage, downloadFile, formatPhone } from '../constants';
import { RelocationLedgerPDF, DamageReportPDF } from '../components/PDFDocuments';

interface CustomerDashboardProps {
  moves: Move[];
  store: any;
  onSelectBox: (id: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ moves, store, onSelectBox }) => {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(0);
  const activeMove = moves[selectedMoveIndex];

  const [isAddingBox, setIsAddingBox] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [newBoxName, setNewBoxName] = useState('');
  const [newBoxPhotos, setNewBoxPhotos] = useState<PhotoWithMeta[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLiabilityModalOpen, setIsLiabilityModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDamagePreviewOpen, setIsDamagePreviewOpen] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [isReportingDamage, setIsReportingDamage] = useState<string | null>(null);
  const [damagePhotos, setDamagePhotos] = useState<PhotoWithMeta[]>([]);
  const [damageDesc, setDamageDesc] = useState('');

  const [notifyMover, setNotifyMover] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyPhone, setNotifyPhone] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const moveBoxes = activeMove ? store.boxes.filter((b: Box) => b.moveId === activeMove.id) : [];
  const moveItems = store.items.filter((i: Item) => moveBoxes.some((b: Box) => b.id === i.boxId));
  const damagedInMove = moveBoxes.some(b => b.damageReport) || moveItems.some(i => i.damageReport);

  const createBox = () => {
    if (!newBoxName || !activeMove) return;
    store.addBox({
      id: 'box_' + Math.random().toString(36).substr(2, 9),
      moveId: activeMove.id,
      name: newBoxName,
      photos: newBoxPhotos,
      createdAt: new Date().toISOString()
    });
    if (notifyMover && (notifyEmail || notifyPhone)) {
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
    }
    setNewBoxName('');
    setNewBoxPhotos([]);
    setIsAddingBox(false);
  };

  if (moves.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center relative">
          <BoxIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <div className="absolute -top-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="max-w-xs space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Awaiting Mover Link</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Your logistics partner will dispatch your secure inventory link once verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-48 no-print">
      {/* Simulation Toast for Link Dispatched */}
      {showNotificationToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-4 border-emerald-500">
              <Send className="w-5 h-5 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-widest whitespace-nowrap">Secure Inventory Link Dispatched!</span>
           </div>
        </div>
      )}

      <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 shadow-sm p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
         <div className="flex items-center space-x-5">
            <div className={`p-4 rounded-2xl ${activeMove.protectionTier === ProtectionTier.ENHANCED ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'}`}>
               <Shield className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Move ID: #{activeMove.id.slice(-6).toUpperCase()}</h3>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
                 Protection Status: <span className={activeMove.protectionTier === ProtectionTier.ENHANCED ? 'text-emerald-600 font-black' : 'text-slate-400'}>{activeMove.protectionTier.toUpperCase()}</span>
               </p>
            </div>
         </div>
         {activeMove.protectionTier === ProtectionTier.ENHANCED && (
           <Badge variant="emerald">Enterprise Enhanced Policy</Badge>
         )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button variant="primary" size="md" fullWidth icon={FileText} onClick={() => setIsLiabilityModalOpen(true)} className="rounded-xl shadow-lg font-black">Mover Ledger</Button>
        <Button variant="secondary" size="md" fullWidth icon={Share2} onClick={() => setIsSharing(true)} className="rounded-xl shadow-lg font-black">Share Live Tracker</Button>
        <Button variant="success" size="md" fullWidth icon={Download} onClick={() => setIsExporting(true)} className="rounded-xl shadow-lg font-black">Export CSV</Button>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center"><BoxIcon className="w-6 h-6 mr-3 text-emerald-600" /> Active Cargo</h3>
          <Badge variant="emerald">{moveBoxes.length} Documented Boxes</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {moveBoxes.map((box: Box) => (
            <Card key={box.id} onClick={() => onSelectBox(box.id)} className={box.damageReport ? 'ring-4 ring-red-500 border-red-500' : ''}>
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {box.photos[0] ? <img src={box.photos[0].data} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-300"><ImageIcon className="w-10 h-10 mb-2" /><span className="text-[10px] font-black uppercase">No Photo</span></div>}
                {box.damageReport && <div className="absolute top-2 right-2"><Badge variant="red">Claim Active</Badge></div>}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{box.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{store.items.filter((i: Item) => i.boxId === box.id).length} Items</p>
              </div>
            </Card>
          ))}
          <button onClick={() => setIsAddingBox(true)} className="aspect-square bg-white dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 transition-all group">
            <Plus className="w-10 h-10 mb-3 group-hover:scale-125 transition-transform" /><span className="font-black text-sm uppercase">Protect New Box</span>
          </button>
        </div>
      </section>

      {/* Modals remain mostly the same but updated labels to match B2B flow */}
      <Modal isOpen={isAddingBox} onClose={() => setIsAddingBox(false)} title="New Cargo Protection">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Documentation Photos (Max 4)</label>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 relative overflow-hidden">
                  {newBoxPhotos[idx] ? <img src={newBoxPhotos[idx].data} className="w-full h-full object-cover" /> : <label className="flex items-center justify-center h-full cursor-pointer"><Camera className="w-6 h-6 text-slate-300" /><input type="file" accept="image/*" capture="environment" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const res = await compressImage(file);
                      setNewBoxPhotos(prev => [...prev, res]);
                    }
                  }} /></label>}
                </div>
              ))}
            </div>
          </div>
          <Input label="Box Descriptor / Room" placeholder="e.g. Living Room Fragiles" value={newBoxName} onChange={(e) => setNewBoxName(e.target.value)} />
          <Button fullWidth variant="success" size="xl" onClick={createBox} disabled={!newBoxName}>Finalize & Send Tracker</Button>
        </div>
      </Modal>

      <Modal isOpen={isSharing} onClose={() => setIsSharing(false)} title="Share Secure Tracker">
        <form onSubmit={(e) => { e.preventDefault(); setShowNotificationToast(true); setTimeout(() => { setShowNotificationToast(false); setIsSharing(false); }, 2000); }} className="space-y-6">
           <Input label="Mover Email" type="email" placeholder="logistics@mover.com" required />
           <Button fullWidth variant="success" size="xl" type="submit" icon={Send}>Send Live Tracker Link</Button>
        </form>
      </Modal>

      <Modal isOpen={isLiabilityModalOpen} onClose={() => setIsLiabilityModalOpen(false)} title="Verify Mover Ledger">
        <div className="space-y-6">
          <textarea className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 rounded-2xl outline-none h-40 text-sm font-medium" placeholder="Directives for movers..." value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} />
          <Button fullWidth size="xl" onClick={() => { setIsLiabilityModalOpen(false); setIsPreviewModalOpen(true); }} icon={Eye}>Review Document Preview</Button>
        </div>
      </Modal>

      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Ledger Preview (PDF)" className="max-w-4xl">
        <div className="flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto">
             <RelocationLedgerPDF id="ledger-pdf" move={activeMove} boxes={moveBoxes} items={moveItems} customerNotes={customerNotes} />
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="secondary" size="lg" onClick={() => setIsPreviewModalOpen(false)} className="flex-1">Close</Button>
            <Button variant="primary" size="lg" icon={Printer} onClick={() => window.print()} className="flex-1">Print Proof</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
