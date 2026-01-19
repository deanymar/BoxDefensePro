
import { v4 as uuidv4 } from 'uuid';
import { User, Move, Box, Item, MoveStatus, CountType, PhotoMetadata } from '../types';

const DB_KEY = 'box_defense_db';

interface DBState {
  users: User[];
  moves: Move[];
  boxes: Box[];
  items: Item[];
}

export const db = {
  get: (): DBState => {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { users: [], moves: [], boxes: [], items: [] };
  },

  save: (state: DBState) => {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  },

  migrate: () => {
    localStorage.removeItem(DB_KEY);
    db.save({ users: [], moves: [], boxes: [], items: [] });
    console.log('MIGRATION: DB Schema updated for Corporate and Admin roles.');
  },

  seed: () => {
    const state = db.get();
    
    // 1. Create Users (Admin, Customer, Corporate)
    const admin: User = { 
      id: 'u-admin', 
      phone: 'admin', 
      role: 'admin', 
      created_at: new Date().toISOString() 
    };
    const customer: User = { 
      id: 'u-1', 
      phone: '555-0101', 
      role: 'customer', 
      created_at: new Date().toISOString() 
    };
    const company: User = { 
      id: 'u-corp', 
      phone: '555-9999', 
      role: 'company', 
      company_name: 'Stellar Relocation LLC',
      created_at: new Date().toISOString() 
    };
    
    // 2. Create Moves
    const move1: Move = { 
      id: 'm-1', 
      user_id: customer.id, 
      assigned_company_id: company.id,
      status: MoveStatus.IN_PROGRESS, 
      created_at: new Date(Date.now() - 86400000).toISOString() 
    };

    // 3. Create Boxes with Simulated Cloud Photos
    const mockPhoto: PhotoMetadata = {
      id: 'p-1',
      original_url: 'https://picsum.photos/seed/box1/1200/800',
      thumbnail_url: 'https://picsum.photos/seed/box1/300/200',
      created_at: new Date().toISOString()
    };

    const box1: Box = {
      id: 'b-1',
      move_id: move1.id,
      name: 'Kitchen - Glassware',
      photos: [mockPhoto],
      created_at: new Date(Date.now() - 43200000).toISOString()
    };

    // 4. Create Items
    const item1: Item = {
      id: 'i-1',
      box_id: box1.id,
      name: 'Wine Glasses',
      description: 'Crystal set of 6',
      count_type: CountType.BROKEN,
      quantity: 6,
      photos: [],
      created_at: new Date(Date.now() - 43100000).toISOString()
    };

    state.users = [admin, customer, company];
    state.moves = [move1];
    state.boxes = [box1];
    state.items = [item1];

    db.save(state);
    console.log('SEED: Production-ready data with roles and company links injected.');
  }
};
