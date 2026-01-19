
import { db } from '../services/db';
import { serverCache } from './cache-generator';
import { photoService } from '../services/photoService';
import { v4 as uuidv4 } from 'uuid';
import { User, Move, Box, Item, CountType, MoveStatus, UserRole } from '../types';

/**
 * Encrypts a string for QR code generation.
 * (Production should use a real crypto library like 'crypto-js')
 */
const encryptId = (id: string) => {
  return btoa(`SECURE-BOX-${id}`).replace(/=/g, '');
};

export const serverRouter = {
  getDashboard: async (requester: User) => {
    const summary = serverCache.readFile('dashboard-summary.json');
    return summary || { total_moves: 0, active_boxes: 0, unverified_items: 0, system_alerts: 0 };
  },

  listMoves: async (requester: User) => {
    const allMoves = serverCache.readFile('moves.json') || [];
    if (requester.role === 'admin') return allMoves;
    if (requester.role === 'customer') return allMoves.filter((m: Move) => m.user_id === requester.id);
    if (requester.role === 'company') return allMoves.filter((m: Move) => m.assigned_company_id === requester.id);
    return [];
  },

  listUsers: async (requester: User) => {
    if (requester.role !== 'admin') throw new Error('UNAUTHORIZED: Admin only');
    const state = db.get();
    return state.users;
  },

  updateUserRole: async (userId: string, newRole: UserRole, requester: User) => {
    if (requester.role !== 'admin') throw new Error('UNAUTHORIZED: Admin only');
    const state = db.get();
    const user = state.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      db.save(state);
      serverCache.generateAll();
    }
    return user;
  },

  toggleUserFlag: async (userId: string, requester: User) => {
    if (requester.role !== 'admin') throw new Error('UNAUTHORIZED: Admin only');
    const state = db.get();
    const user = state.users.find(u => u.id === userId);
    if (user) {
      user.is_flagged = !user.is_flagged;
      db.save(state);
      serverCache.generateAll();
    }
    return user;
  },

  updateMoveStatus: async (moveId: string, status: MoveStatus, requester: User) => {
    const state = db.get();
    const move = state.moves.find(m => m.id === moveId);
    if (!move) throw new Error('NOT_FOUND: Move not found');

    const canUpdate = requester.role === 'admin' || move.assigned_company_id === requester.id;
    if (!canUpdate) throw new Error('UNAUTHORIZED: Permission denied to update status');

    move.status = status;
    db.save(state);
    serverCache.generateAll();
    return move;
  },

  getMoveDetail: async (moveId: string, requester: User) => {
    const detailed = serverCache.readFile(`moves/move_${moveId}.json`);
    if (!detailed) throw new Error('NOT_FOUND: Record not in cache.');

    const hasAccess = 
      requester.role === 'admin' || 
      detailed.user_id === requester.id || 
      detailed.assigned_company_id === requester.id;

    if (!hasAccess) throw new Error('UNAUTHORIZED: Secure access violation.');
    return detailed;
  },

  createBox: async (moveId: string, name: string, photos: string[], requester: User) => {
    if (requester.role !== 'customer' && requester.role !== 'admin') {
      throw new Error('UNAUTHORIZED: WRITE_ACCESS_DENIED');
    }

    const state = db.get();
    const cloudPhotos = await Promise.all(photos.map(p => photoService.upload(p)));
    const boxId = uuidv4();

    const newBox: Box = {
      id: boxId,
      move_id: moveId,
      name,
      photos: cloudPhotos,
      qr_code: encryptId(boxId.slice(0, 8)),
      created_at: new Date().toISOString()
    };

    state.boxes.push(newBox);
    db.save(state);
    serverCache.generateAll();
    return newBox;
  },

  addItem: async (boxId: string, itemData: Partial<Item>, requester: User) => {
    if (requester.role !== 'customer' && requester.role !== 'admin') {
      throw new Error('UNAUTHORIZED: WRITE_ACCESS_DENIED');
    }

    const state = db.get();
    const newItem: Item = {
      id: uuidv4(),
      box_id: boxId,
      name: itemData.name || 'Generic Item',
      description: itemData.description || '',
      count_type: itemData.count_type || CountType.EXACT,
      quantity: itemData.quantity || 1,
      weight: itemData.weight || 0,
      photos: [],
      created_at: new Date().toISOString()
    };

    state.items.push(newItem);
    db.save(state);
    serverCache.generateAll();
    return newItem;
  }
};
