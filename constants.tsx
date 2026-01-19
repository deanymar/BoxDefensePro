
import React from 'react';
import { CountType } from './types';

export const COUNT_TYPE_HELP: Record<CountType, string> = {
  [CountType.EXACT]: '💡 Use for individual valuables like TVs, laptops, jewelry, artwork, furniture. Each item is counted precisely.',
  [CountType.BREAKABLE]: '💡 Use for fragile items like plates, glasses, dishes. Approximate count is acceptable for insurance claims. Examples: ~12 dinner plates, ~24 wine glasses',
  [CountType.MISC]: '💡 Use for bulk items like utensils, office supplies, books, toys. Approximate count is sufficient for insurance. Examples: ~50 kitchen utensils, ~100 books'
};

export const formatPhone = (value: string) => {
  if (!value) return '';
  const phoneNumber = value.replace(/\D/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const suggestCountType = (itemName: string) => {
  const name = itemName.toLowerCase();
  
  const breakableKeywords = ['plate', 'glass', 'mug', 'cup', 'dish', 'bowl', 'wine', 'fragile', 'vase'];
  const miscKeywords = ['utensil', 'fork', 'spoon', 'knife', 'silverware', 'cutlery', 'office', 'supply', 'book', 'toy', 'clothes', 'shoe'];
  const exactKeywords = ['tv', 'television', 'laptop', 'computer', 'jewelry', 'watch', 'ring', 'painting', 'art', 'camera', 'console'];
  
  if (breakableKeywords.some(kw => name.includes(kw))) {
    return { type: CountType.BREAKABLE, message: '💡 Suggested: Breakable (Approx) - Perfect for fragile dishware' };
  }
  if (miscKeywords.some(kw => name.includes(kw))) {
    return { type: CountType.MISC, message: '💡 Suggested: Misc (Approx) - Perfect for bulk items' };
  }
  if (exactKeywords.some(kw => name.includes(kw))) {
    return { type: CountType.EXACT, message: '💡 Suggested: Exact Count - Valuable item should be counted precisely' };
  }
  
  return null;
};

export const compressImage = (file: File, maxSizeMB = 1): Promise<{ data: string; timestamp: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const timestamp = new Date().toISOString();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const maxDimension = 1200; 
        if (width > height && width > maxDimension) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        
        let quality = 0.7;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        
        while (base64.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve({ data: base64, timestamp });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const downloadFile = (content: string, filename: string, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
