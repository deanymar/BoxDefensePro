
import { useState, useEffect } from 'react';
import { User, Move, Box, Item, AppState, MoveStatus, CountType, ClaimResolution, ProtectionTier } from './types';

const STORAGE_KEY = 'box_defense_data_v13';
const PLATFORM_CUT_PERCENT = 0.15; 

const DUMMY_COMPANY: User = {
  id: 'comp_precision',
  companyName: 'Precision Movers',
  role: 'company',
  createdAt: new Date().toISOString()
};

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getOffsetDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const DEMO_MOVES: Move[] = [
  {
    id: 'move_1',
    companyId: 'comp_precision',
    customerPhone: '5551112222',
    customerName: 'Marcus Claimwell',
    moveDate: getTodayStr(), 
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: MoveStatus.CLAIM,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 249.00,
    platformFee: 37.35,
    claimOpenedDate: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'move_2',
    companyId: 'comp_precision',
    customerPhone: '5553334444',
    customerName: 'Jessica Porter',
    moveDate: getOffsetDate(-15),
    // Fix: Error in file store.ts on line 42: Type 'Date' is not assignable to type 'string'.
    // Ensure Date object is converted to ISO string.
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: MoveStatus.COMPLETED,
    protectionTier: ProtectionTier.STANDARD,
    protectionPrice: 199.00,
    platformFee: 29.85
  }
];

// Fix: Error in file App.tsx on line 3: Module '"./store"' has no exported member 'useStore'.
// Implementation of the useStore hook which manages application state and provides methods to modify it.
export const useStore = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      currentUser: null,
      moves: DEMO_MOVES,
      boxes: [],
      items: []
    };
  });

  const [showLanding, setShowLanding] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const loginCustomer = (phone: string) => {
    const user: User = {
      id: 'user_' + phone,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, currentUser: user }));
    setShowLanding(false);
  };

  const loginCompany = (companyName: string) => {
    const user: User = {
      id: 'comp_' + companyName.toLowerCase().replace(/\s+/g, '_'),
      companyName,
      role: 'company',
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, currentUser: user }));
    setShowLanding(false);
  };

  const loginAsDummyCompany = () => {
    setState(prev => ({ ...prev, currentUser: DUMMY_COMPANY }));
    setShowLanding(false);
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setShowLanding(true);
  };

  const addBox = (box: Box) => {
    setState(prev => ({ ...prev, boxes: [...prev.boxes, box] }));
  };

  const addItem = (item: Item) => {
    setState(prev => ({ ...prev, items: [...prev.items, item] }));
  };

  const updateItem = (updatedItem: Item) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === updatedItem.id ? updatedItem : i)
    }));
  };

  const updateMoveStatus = (moveId: string, status: MoveStatus) => {
    setState(prev => ({
      ...prev,
      moves: prev.moves.map(m => m.id === moveId ? { ...m, status } : m)
    }));
  };

  const createMove = (moveData: { customerPhone: string; customerName: string; moveDate: string; protectionTier: ProtectionTier; protectionPrice: number }) => {
    const newMove: Move = {
      id: 'move_' + Math.random().toString(36).substr(2, 9),
      companyId: state.currentUser?.id || 'unknown',
      customerPhone: moveData.customerPhone,
      customerName: moveData.customerName,
      moveDate: moveData.moveDate,
      createdAt: new Date().toISOString(),
      status: MoveStatus.CREATED,
      protectionTier: moveData.protectionTier,
      protectionPrice: moveData.protectionPrice,
      platformFee: moveData.protectionPrice * PLATFORM_CUT_PERCENT
    };
    setState(prev => ({ ...prev, moves: [...prev.moves, newMove] }));
  };

  const upgradeMoveTier = (moveId: string, price: number) => {
    setState(prev => ({
      ...prev,
      moves: prev.moves.map(m => m.id === moveId ? {
        ...m,
        protectionTier: ProtectionTier.ENHANCED,
        protectionPrice: price,
        platformFee: price * PLATFORM_CUT_PERCENT
      } : m)
    }));
  };

  const resolveMoveClaim = (moveId: string, resolution: ClaimResolution) => {
    setState(prev => ({
      ...prev,
      moves: prev.moves.map(m => m.id === moveId ? {
        ...m,
        status: MoveStatus.CLAIM_RESOLVED,
        claimResolution: resolution
      } : m)
    }));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return {
    ...state,
    showLanding,
    setShowLanding,
    isDarkMode,
    toggleDarkMode,
    loginCustomer,
    loginCompany,
    loginAsDummyCompany,
    logout,
    addBox,
    addItem,
    updateItem,
    updateMoveStatus,
    createMove,
    upgradeMoveTier,
    resolveMoveClaim
  };
};
