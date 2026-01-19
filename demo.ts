
import { useState, useEffect } from 'react';
import { User, Move, Box, Item, AppState, MoveStatus, CountType, ClaimResolution, ProtectionTier } from './types';

const STORAGE_KEY = 'box_defense_data_v14';
const PLATFORM_CUT_PERCENT = 0.15; 

const DUMMY_COMPANY: User = {
  id: 'comp_precision',
  companyName: 'Precision Movers',
  role: 'company',
  plan: 'Professional',
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
    customerPhone: '5551110001',
    customerName: 'Marcus Miller',
    moveDate: getTodayStr(), 
    createdAt: getOffsetDate(-5),
    status: MoveStatus.CLAIM,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 249,
    platformFee: 37.35,
    claimOpenedDate: getOffsetDate(-1)
  },
  {
    id: 'move_2',
    companyId: 'comp_precision',
    customerPhone: '5551110002',
    customerName: 'Sarah Jenkins',
    moveDate: getTodayStr(),
    createdAt: getOffsetDate(-10),
    status: MoveStatus.PACKING,
    protectionTier: ProtectionTier.STANDARD,
    protectionPrice: 99,
    platformFee: 14.85
  },
  {
    id: 'move_3',
    companyId: 'comp_precision',
    customerPhone: '5551110003',
    customerName: 'David Chen',
    moveDate: getTodayStr(),
    createdAt: getOffsetDate(-2),
    status: MoveStatus.CREATED,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 299,
    platformFee: 44.85
  },
  {
    id: 'move_4',
    companyId: 'comp_precision',
    customerPhone: '5551110004',
    customerName: 'Elena Rodriguez',
    moveDate: getOffsetDate(2),
    createdAt: getOffsetDate(-4),
    status: MoveStatus.SIGNED_CUSTOMER,
    protectionTier: ProtectionTier.STANDARD,
    protectionPrice: 149,
    platformFee: 22.35
  },
  {
    id: 'move_5',
    companyId: 'comp_precision',
    customerPhone: '5551110005',
    customerName: 'Robert Wilson',
    moveDate: getOffsetDate(-1),
    createdAt: getOffsetDate(-20),
    status: MoveStatus.COMPLETED,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 399,
    platformFee: 59.85
  },
  {
    id: 'move_6',
    companyId: 'comp_precision',
    customerPhone: '5551110006',
    customerName: 'Amina Khan',
    moveDate: getTodayStr(),
    createdAt: getOffsetDate(-1),
    status: MoveStatus.FORM_GENERATED,
    protectionTier: ProtectionTier.STANDARD,
    protectionPrice: 120,
    platformFee: 18
  },
  {
    id: 'move_7',
    companyId: 'comp_precision',
    customerPhone: '5551110007',
    customerName: 'Thomas Shelby',
    moveDate: getOffsetDate(5),
    createdAt: getOffsetDate(-3),
    status: MoveStatus.CREATED,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 500,
    platformFee: 75
  },
  {
    id: 'move_8',
    companyId: 'comp_precision',
    customerPhone: '5551110008',
    customerName: 'Linda Carter',
    moveDate: getTodayStr(),
    createdAt: getOffsetDate(-8),
    status: MoveStatus.CLAIM,
    protectionTier: ProtectionTier.STANDARD,
    protectionPrice: 89,
    platformFee: 13.35,
    claimOpenedDate: getOffsetDate(-2)
  },
  {
    id: 'move_9',
    companyId: 'comp_precision',
    customerPhone: '5551110009',
    customerName: 'Gary Vayner',
    moveDate: getOffsetDate(-12),
    createdAt: getOffsetDate(-30),
    status: MoveStatus.CLAIM_RESOLVED,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 299,
    platformFee: 44.85,
    claimResolution: {
      payoutAmount: 150,
      payer: 'company',
      resolutionDate: getOffsetDate(-2),
      outcomeNotes: 'Glassware damage during loading. Full internal payout.',
      durationDays: 4
    }
  },
  {
    id: 'move_10',
    companyId: 'comp_precision',
    customerPhone: '5551110010',
    customerName: 'Oprah W.',
    moveDate: getTodayStr(),
    createdAt: getOffsetDate(-1),
    status: MoveStatus.SIGNED_MOVER,
    protectionTier: ProtectionTier.ENHANCED,
    protectionPrice: 999,
    platformFee: 149.85
  }
];

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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

  const loginCompany = (companyName: string, plan: string = 'Logistics Basic') => {
    const user: User = {
      id: 'comp_' + companyName.toLowerCase().replace(/\s+/g, '_'),
      companyName,
      role: 'company',
      plan,
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

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const createMove = (moveData: any) => {
    const newMove: Move = {
      id: 'move_' + Math.random().toString(36).substr(2, 9),
      companyId: state.currentUser?.id || 'unknown',
      ...moveData,
      createdAt: new Date().toISOString(),
      status: MoveStatus.CREATED,
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

  const updateMoveStatus = (moveId: string, status: MoveStatus) => {
    setState(prev => ({
      ...prev,
      moves: prev.moves.map(m => m.id === moveId ? { ...m, status } : m)
    }));
  };

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
    createMove,
    upgradeMoveTier,
    resolveMoveClaim,
    updateMoveStatus,
    addBox: (box: Box) => setState(prev => ({ ...prev, boxes: [...prev.boxes, box] })),
    addItem: (item: Item) => setState(prev => ({ ...prev, items: [...prev.items, item] })),
    updateItem: (item: Item) => setState(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? item : i) }))
  };
};
