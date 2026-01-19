
import React from 'react';
import { Move, Box, Item } from '../types';
import { formatPhone } from '../constants';

interface RelocationLedgerProps {
  move: Move;
  boxes: Box[];
  items: Item[];
  customerNotes?: string;
  id: string;
}

export const RelocationLedgerPDF: React.FC<RelocationLedgerProps> = ({ move, boxes, items, customerNotes, id }) => {
  const itemsByBox = boxes.map((box) => ({
    box,
    boxItems: items.filter((i) => i.boxId === box.id)
  }));

  return (
    <div id={id} className="bg-white p-8 md:p-12 font-serif text-slate-900 border border-slate-200 shadow-inner rounded-xl overflow-y-auto">
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Relocation Ledger</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Certified Chain-of-Custody Document</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">MOVE ID: <span className="font-mono text-blue-600">#{move.id.slice(-6).toUpperCase()}</span></p>
          <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Client Details</h2>
          <p className="font-bold text-lg">{move.customerName}</p>
          <p className="text-sm text-slate-600 whitespace-nowrap">{formatPhone(move.customerPhone)}</p>
          <p className="text-sm text-slate-600">Relocation Date: {move.moveDate}</p>
        </section>
        <section className="text-right">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ledger Summary</h2>
          <p className="font-bold text-lg">{boxes.length} Storage Containers</p>
          <p className="text-sm text-slate-600">{items.length} Verified Items</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Active Registry</p>
        </section>
      </div>

      <div className="space-y-12">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Itemized Inventory Registry</h2>
        {itemsByBox.map(({ box, boxItems }, idx) => (
          <div key={box.id} className="space-y-6">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
              <h3 className="font-black text-lg uppercase">Container {idx + 1}: {box.name}</h3>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{box.photos.length} Verification Photos</span>
            </div>
            <div className="pl-6 space-y-6">
              {boxItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No items logged in this container.</p>
              ) : (
                boxItems.map((item: Item) => (
                  <div key={item.id} className="border-l-2 border-slate-100 pl-6 relative">
                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-200" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base leading-none">{item.name}</h4>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.description || 'No additional description provided.'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded">{item.quantity} Unit(s)</span>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mt-2">{item.countType.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {customerNotes && (
        <div className="mt-16 pt-8 border-t border-slate-100">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer Directives</h2>
          <div className="p-6 bg-slate-50 rounded-xl italic text-slate-700 text-sm leading-relaxed">
            "{customerNotes}"
          </div>
        </div>
      )}

      <div className="mt-20 grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Attestation</h3>
          <div className="h-20 border-b-2 border-slate-100 flex items-end pb-2">
            <p className="text-xs italic opacity-50">Signed digitally via verified phone ID</p>
          </div>
          <p className="text-xs font-bold">{move.customerName}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carrier Acknowledgement</h3>
          <div className="h-20 border-b-2 border-slate-100 flex items-end pb-2">
            <p className="text-xs italic opacity-30">Carrier Counter-Signature Required</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-[9px] text-center text-slate-300 uppercase font-bold tracking-[0.5em]">
        BoxDefense Verified Documentation Protocol
      </div>
    </div>
  );
};

interface DamageReportProps {
  move: Move;
  boxes: Box[];
  items: Item[];
  id: string;
}

export const DamageReportPDF: React.FC<DamageReportProps> = ({ move, boxes, items, id }) => {
  const damagedBoxes = boxes.filter(b => !!b.damageReport);
  const damagedItems = items.filter(i => !!i.damageReport);

  return (
    <div id={id} className="bg-white p-8 md:p-12 font-serif text-slate-900 border border-slate-200 shadow-inner rounded-xl overflow-y-auto">
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1 text-red-700">Damage Assessment Report</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Official Claim Evidence Log</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">CLAIM ID: <span className="font-mono text-red-600">#{move.id.slice(-6).toUpperCase()}-DA</span></p>
          <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Claimant</h2>
          <p className="font-bold text-lg">{move.customerName}</p>
          <p className="text-sm text-slate-600 whitespace-nowrap">{formatPhone(move.customerPhone)}</p>
        </section>
        <section className="text-right">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Incident Summary</h2>
          <p className="font-bold text-lg">{damagedBoxes.length + damagedItems.length} Total Incidents</p>
          <p className="text-sm text-slate-600">Move Date: {move.moveDate}</p>
          <p className="text-sm text-slate-600">Status: Under Review</p>
        </section>
      </div>

      <div className="space-y-12">
        {damagedBoxes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] border-b border-red-100 pb-2 text-red-700">Container Damage Incidents</h2>
            {damagedBoxes.map((box) => (
              <div key={box.id} className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                <h3 className="font-black text-lg mb-2">{box.name}</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">"{box.damageReport?.description}"</p>
                <div className="grid grid-cols-3 gap-4">
                  {box.damageReport?.photos.map((p, i) => (
                    <img key={i} src={p.data} className="w-full aspect-square object-cover rounded-xl border-2 border-white shadow-sm" alt="Box damage proof" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {damagedItems.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] border-b border-red-100 pb-2 text-red-700">Itemized Damage Incidents</h2>
            {damagedItems.map((item) => {
              const parentBox = boxes.find(b => b.id === item.boxId);
              return (
                <div key={item.id} className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg">{item.name}</h3>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Origin: {parentBox?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">"{item.damageReport?.description}"</p>
                  <div className="grid grid-cols-3 gap-4">
                    {item.damageReport?.photos.map((p, i) => (
                      <img key={i} src={p.data} className="w-full aspect-square object-cover rounded-xl border-2 border-white shadow-sm" alt="Item damage proof" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-20 grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Claimant Signature</h3>
          <div className="h-16 border-b-2 border-slate-100"></div>
          <p className="text-xs font-bold">{move.customerName}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assessor Signature</h3>
          <div className="h-16 border-b-2 border-slate-100"></div>
          <p className="text-xs text-slate-400 italic">Official Carrier Verification Required</p>
        </div>
      </div>
      
      <div className="mt-12 text-[9px] text-center text-slate-300 uppercase font-bold tracking-[0.5em]">
        BoxDefense Verified Claim Protocol - Confidential Evidence
      </div>
    </div>
  );
};

interface ClaimSettlementProps {
  move: Move;
  companyName: string;
  id: string;
}

export const ClaimSettlementPDF: React.FC<ClaimSettlementProps> = ({ move, companyName, id }) => {
  if (!move.claimResolution) return null;

  return (
    <div id={id} className="bg-white p-12 font-serif text-slate-900 border border-slate-200 shadow-inner rounded-xl overflow-y-auto">
      <div className="flex justify-between items-start border-b-4 border-emerald-600 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1 text-emerald-700">Claim Settlement Certificate</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal Release of Liability</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">SETTLEMENT ID: <span className="font-mono text-emerald-600">#{move.id.slice(-4).toUpperCase()}-RC</span></p>
          <p className="text-xs text-slate-500 mt-1">{new Date(move.claimResolution.resolutionDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Claimant</h2>
          <p className="font-bold text-lg">{move.customerName}</p>
          <p className="text-sm text-slate-600 whitespace-nowrap">{formatPhone(move.customerPhone)}</p>
        </section>
        <section className="text-right">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Resolved By</h2>
          <p className="font-bold text-lg">{companyName}</p>
          <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter text-emerald-600">Settled via {move.claimResolution.payer}</p>
        </section>
      </div>

      <div className="space-y-8 p-8 bg-slate-50 rounded-3xl border-2 border-slate-100">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Claim Period</h4>
            <p className="text-lg font-bold">{move.claimResolution.durationDays} Days Total</p>
            <p className="text-xs text-slate-500">Opened: {new Date(move.claimOpenedDate || '').toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Consideration</h4>
            <p className="text-3xl font-black text-emerald-700">${move.claimResolution.payoutAmount.toLocaleString()}</p>
            <p className="text-xs text-slate-500 italic">Full and Final Settlement</p>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resolution & Outcome Notes</h3>
        <div className="p-8 bg-white border border-slate-100 rounded-2xl italic text-sm leading-relaxed text-slate-700 shadow-sm">
          "{move.claimResolution.outcomeNotes}"
        </div>
      </div>

      <div className="mt-20 space-y-8 text-xs leading-relaxed text-slate-500">
        <p>This document serves as a final and binding agreement regarding relocation claim #{move.id.slice(-6)}. The Claimant acknowledges receipt of the consideration stated above and hereby releases the Carrier and its agents from all further liability related to the transit period documented in Ledger Registry #{move.id.slice(-6)}.</p>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-12">
        <div className="space-y-2">
          <div className="h-16 border-b-2 border-slate-100 flex items-end">
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Settled Electronically</p>
          </div>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Carrier Authorized Signature</p>
        </div>
        <div className="space-y-2">
          <div className="h-16 border-b-2 border-slate-100"></div>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Claimant Signature</p>
        </div>
      </div>
    </div>
  );
};
