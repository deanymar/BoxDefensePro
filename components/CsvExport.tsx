
import React from 'react';
import { MoveFullDetail } from '../types';

interface CsvExportProps {
  move: MoveFullDetail;
}

export const CsvExport: React.FC<CsvExportProps> = ({ move }) => {
  const generateCsv = () => {
    const headers = ['Move ID', 'Box Name', 'Item Name', 'Quantity', 'Weight (LBS)', 'Type', 'Description', 'Timestamp'];
    const rows = [headers];

    move.boxes.forEach(box => {
      box.items.forEach(item => {
        rows.push([
          move.id,
          box.name,
          item.name,
          item.quantity.toString(),
          (item.weight || 0).toString(),
          item.count_type,
          item.description || '',
          item.created_at
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Move_Inventory_${move.id.slice(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={generateCsv}
      title="Export CSV"
      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-green-600 hover:bg-green-50 transition-all"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
  );
};
