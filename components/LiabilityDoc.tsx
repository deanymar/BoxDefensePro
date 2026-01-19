
import React from 'react';
import { MoveFullDetail } from '../types';

interface LiabilityDocProps {
  move: MoveFullDetail;
}

export const LiabilityDoc: React.FC<LiabilityDocProps> = ({ move }) => {
  const generateTxt = () => {
    let doc = `BOXDEFENSE - LEGALLY BINDING INVENTORY DOCUMENT\n`;
    doc += `Generated: ${new Date().toISOString()}\n`;
    doc += `==============================================\n\n`;
    doc += `MOVE ID: ${move.id}\n`;
    doc += `STATUS: ${move.status}\n`;
    doc += `USER ID: ${move.user_id}\n\n`;
    doc += `INVENTORY SUMMARY:\n`;
    doc += `----------------------------------------------\n`;

    move.boxes.forEach((box, bIdx) => {
      doc += `BOX #${bIdx + 1}: ${box.name} (${box.id})\n`;
      box.items.forEach((item, iIdx) => {
        doc += `  - [${item.count_type}] ${item.name} | Qty: ${item.quantity} | Weight: ${item.weight || 0} lbs | ${item.description || 'N/A'}\n`;
      });
      doc += `\n`;
    });

    doc += `\nLEGAL ACKNOWLEDGMENT:\n`;
    doc += `By signing below, both parties acknowledge that the photos and data recorded in this move file are the primary evidence for any insurance claims. All counts marked 'EXACT' are verified by visual inspection. Counts marked 'BROKEN' or 'OTHER' are approximations.\n\n`;
    doc += `CUSTOMER SIGNATURE: __________________________  DATE: _________\n`;
    doc += `CARRIER SIGNATURE:  __________________________  DATE: _________\n`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Liability_Doc_Move_${move.id.slice(0, 8)}.txt`;
    link.click();
  };

  return (
    <button 
      onClick={generateTxt}
      title="Download Liability Document"
      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
};
