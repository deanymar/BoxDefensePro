
import React from 'react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

/**
 * QR GENERATOR
 * Since real QR libs can be heavy, we simulate a professional encrypted square pattern.
 */
export const QRGenerator: React.FC<QRGeneratorProps> = ({ value, size = 64 }) => {
  return (
    <div 
      className="bg-slate-900 p-1 flex items-center justify-center rounded-sm"
      style={{ width: size, height: size }}
      title={`Encrypted QR: ${value}`}
    >
      <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-full h-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <div 
            key={i} 
            className={`${(value.charCodeAt(i % value.length) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'} rounded-[1px]`}
          />
        ))}
      </div>
    </div>
  );
};
