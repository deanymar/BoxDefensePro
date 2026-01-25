
import React, { useState, useMemo } from 'react';
import { Box, Item, CountType, PhotoWithMeta, DamageReport, MoveStatus } from '../types';
import { Button, Card, Badge, Modal, Input, Select, SelectOption } from '../components/UI';
import { ArrowLeft, Plus, Camera, Trash2, MoreVertical, Clock, ChevronRight, Info, AlertTriangle, Loader2, Image as ImageIcon, AlertCircle, CheckCircle, Zap, Wine, Layers } from 'lucide-react';
import { COUNT_TYPE_HELP, suggestCountType, compressImage } from '../constants';

interface BoxDetailProps {
  box: Box;
  store: any;
  onBack: () => void;
}

export const BoxDetailView: React.FC<BoxDetailProps> = ({ box, store, onBack }) => {
  const boxItems = store.items.filter((i: Item) => i.boxId === box.id);
  const activeMove = store.moves.find((m: any) => m.id === box.moveId);
  const isMoveDatePassed = activeMove ? new Date().toISOString().split('T')[0] >= activeMove.moveDate : false;
  
  const canReportDamage = isMoveDatePassed && activeMove && (
    activeMove.status === MoveStatus.SIGNED_CUSTOMER || 
    activeMove.status === MoveStatus.SIGNED_MOVER || 
    activeMove.status === MoveStatus.CLAIM || 
    activeMove.status === MoveStatus.CLAIM_RESOLVED ||
    activeMove.status === MoveStatus.COMPLETED
  );

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isReportingItemDamage, setIsReportingItemDamage] = useState<string | null>(null);
  const [damagePhotos, setDamagePhotos] = useState<PhotoWithMeta[]>([]);
  const [damageDesc, setDamageDesc] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [countType, setCountType] = useState<CountType>(CountType.MISC);
  const [quantityStr, setQuantityStr] = useState('1');
  const [itemPhotos, setItemPhotos] = useState<PhotoWithMeta[]>([]);
  const [suggestion, setSuggestion] = useState<{ type: CountType; message: string } | null>(null);

  const classificationOptions: SelectOption[] = [
    { 
      value: CountType.EXACT, 
      label: 'Exact Count', 
      description: 'For valuables (TVs, Laptops, Jewelry). Precisely counted.',
      icon: Zap
    },
    { 
      value: CountType.BREAKABLE, 
      label: 'Breakable (Approx)', 
      description: 'For fragile items (Plates, Glasses). Approximate count accepted.',
      icon: Wine
    },
    { 
      value: CountType.MISC, 
      label: 'Misc (Approx)', 
      description: 'For bulk items (Utensils, Books, Toys). Sufficient for insurance.',
      icon: Layers
    }
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setItemName(val);
    setSuggestion(suggestCountType(val));
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && itemPhotos.length < 4) {
      const result = await compressImage(file);
      setItemPhotos(prev => [...prev, result]);
    }
  };

  const handleDamagePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && damagePhotos.length < 6) {
      const result = await compressImage(file);
      setDamagePhotos(prev => [...prev, result]);
    }
  };

  const saveItem = () => {
    if (!itemName) return;
    
    if (itemPhotos.length === 0) {
      if (!confirm('No item photo was taken. Documenting items with photos is recommended for insurance. Save anyway?')) {
        return;
      }
    }

    const finalQuantity = parseInt(quantityStr) || 1;
    
    if (editingItem) {
      store.updateItem({
        ...editingItem,
        name: itemName,
        description: itemDesc,
        countType,
        quantity: finalQuantity,
        photos: itemPhotos
      });
    } else {
      const newItem: Item = {
        id: 'item_' + Math.random().toString(36).substr(2, 9),
        boxId: box.id,
        name: itemName,
        description: itemDesc,
        countType,
        quantity: finalQuantity,
        photos: itemPhotos,
        createdAt: new Date().toISOString()
      };
      store.addItem(newItem);
    }

    resetForm();
    setIsAddingItem(false);
  };

  const resetForm = () => {
    setItemName('');
    setItemDesc('');
    setCountType(CountType.MISC);
    setQuantityStr('1');
    setItemPhotos([]);
    setEditingItem(null);
    setSuggestion(null);
  };

  const startEdit = (item: Item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description || '');
    setCountType(item.countType);
    setQuantityStr(item.quantity.toString());
    setItemPhotos(item.photos);
    setIsAddingItem(true);
  };

  const updateQuantity = (delta: number) => {
    const current = parseInt(quantityStr) || 0;
    setQuantityStr(Math.max(1, current + delta).toString());
  };

  const submitItemDamage = () => {
    if (!isReportingItemDamage) return;
    const report: DamageReport = {
      photos: damagePhotos,
      description: damageDesc,
      createdAt: new Date().toISOString()
    };
    
    const item = store.items.find((i: Item) => i.id === isReportingItemDamage);
    if (item) {
      store.updateItem({ ...item, damageReport: report });
    }
    
    store.updateMoveStatus(activeMove.id, MoveStatus.CLAIM);
    setIsReportingItemDamage(null);
    setDamagePhotos([]);
    setDamageDesc('');
  };

  return (
    <div className="flex-1 pb-32 overflow-y-auto">
      <section className="bg-white dark:bg-slate-900 p-6 border-b-2 border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="flex items-center text-slate-400 font-black text-xs mb-8 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{box.name}</h2>
        <Badge variant="blue">{boxItems.length} Verified Items</Badge>
      </section>

      <section className="p-6 space-y-4">
        {boxItems.length === 0 ? (
          <div className="text-center py-20 px-8 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
             <AlertTriangle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
             <h4 className="font-black text-slate-900">Box empty</h4>
             <Button className="mt-8" size="lg" icon={Plus} onClick={() => setIsAddingItem(true)}>Add Item</Button>
          </div>
        ) : (
          boxItems.map((item: Item) => (
            <Card key={item.id} className={`p-5 transition-all ${item.damageReport ? 'ring-4 ring-red-500 ring-offset-4 dark:ring-offset-slate-900 border-red-500' : ''}`} onClick={() => startEdit(item)}>
              <div className="flex items-start">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-black text-slate-800 dark:text-white text-xl">{item.name}</h4>
                      {item.damageReport && <Badge variant="red">Claim Active</Badge>}
                   </div>
                   <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-1">{item.description}</p>
                   <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">Qty: {item.quantity}</span>
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">{item.photos.length} Photos</span>
                   </div>
                   {canReportDamage && !item.damageReport && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); setIsReportingItemDamage(item.id); }}
                        className="mt-4 text-[10px] font-black uppercase text-red-600 border-2 border-red-50 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
                     >
                       Report Damage
                     </button>
                   )}
                </div>
                {item.photos[0] && (
                  <img src={item.photos[0].data} className="w-20 h-20 rounded-2xl object-cover ml-4" />
                )}
              </div>
            </Card>
          ))
        )}
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <Button fullWidth size="xl" icon={Plus} onClick={() => setIsAddingItem(true)} className="shadow-2xl">
            Log New Item
          </Button>
        </div>
      </div>

      <Modal isOpen={isAddingItem} onClose={() => { setIsAddingItem(false); resetForm(); }} title="Item Documentation">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Item Name</label>
            <Input placeholder='e.g. Sony TV' value={itemName} onChange={handleNameChange} className="text-lg font-bold" required />
            {suggestion && <p className="text-[11px] text-blue-600 font-bold">{suggestion.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Quantity Verification</label>
            <div className="flex items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-sm">
               <button onClick={() => updateQuantity(-1)} className="text-3xl font-black text-slate-300 p-2 hover:text-red-500 transition-colors">-</button>
               <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantityStr} 
                onChange={(e) => setQuantityStr(e.target.value.replace(/\D/g, ''))}
                onFocus={(e) => e.target.select()}
                className="flex-1 text-center font-black text-3xl text-slate-900 dark:text-white bg-transparent outline-none" 
               />
               <button onClick={() => updateQuantity(1)} className="text-3xl font-black text-blue-600 p-2 hover:scale-110 transition-transform">+</button>
            </div>
          </div>

          <div className="space-y-2">
            <Select 
              label="Classification"
              options={classificationOptions}
              value={countType}
              onChange={(val) => setCountType(val as CountType)}
            />
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black text-slate-500 uppercase">Item Evidence (Max 4)</label>
             <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map(idx => (
                  <div key={idx} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    {itemPhotos[idx] ? (
                      <img src={itemPhotos[idx].data} className="w-full h-full object-cover" />
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <Camera className="w-5 h-5 text-slate-300" />
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
                      </label>
                    )}
                  </div>
                ))}
             </div>
          </div>

          <Button fullWidth size="xl" onClick={saveItem} disabled={!itemName}>Save to Box</Button>
        </div>
      </Modal>

      <Modal isOpen={!!isReportingItemDamage} onClose={() => setIsReportingItemDamage(null)} title="Item Damage Claim">
         <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
               {[...Array(6)].map((_, idx) => (
                 <div key={idx} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 relative overflow-hidden">
                   {damagePhotos[idx] ? (
                     <img src={damagePhotos[idx].data} className="w-full h-full object-cover" />
                   ) : (
                     <label className="flex items-center justify-center h-full cursor-pointer">
                       <Camera className="w-5 h-5 text-slate-300" />
                       <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleDamagePhotoCapture} />
                     </label>
                   )}
                 </div>
               ))}
            </div>
            <textarea 
              className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none h-32 text-sm"
              placeholder="Explain how the item was damaged..."
              value={damageDesc}
              onChange={(e) => setDamageDesc(e.target.value)}
            />
            <Button fullWidth variant="danger" size="xl" onClick={submitItemDamage} disabled={damagePhotos.length === 0 || !damageDesc}>Submit Item Claim</Button>
         </div>
      </Modal>
    </div>
  );
};
