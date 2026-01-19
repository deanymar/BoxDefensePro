
import { db } from './db';
import { MoveFullDetail, DashboardSummary } from '../types';

const CACHE_KEY = 'box_defense_cache';

/**
 * CACHE ARCHITECTURE:
 * 1. Read-only optimization. 
 * 2. Aggregated/Denormalized structures.
 * 3. Idempotent regeneration.
 */

export const cache = {
  get: () => {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  /** CACHE GENERATION SCRIPT */
  generate: () => {
    const database = db.get();
    const store: any = {
      users: database.users,
      moves: database.moves,
      boxes: database.boxes,
      items: database.items,
      'dashboard-summary': {
        total_moves: database.moves.length,
        active_boxes: database.boxes.length,
        unverified_items: database.items.length,
        last_updated: new Date().toISOString()
      } as DashboardSummary,
      moves_detailed: {}
    };

    // Generate denormalized Move files (move_<id>.json)
    database.moves.forEach(move => {
      const fullMove: MoveFullDetail = {
        ...move,
        boxes: database.boxes
          .filter(b => b.move_id === move.id)
          .map(b => ({
            ...b,
            items: database.items.filter(i => i.box_id === b.id)
          }))
      };
      store.moves_detailed[`move_${move.id}`] = fullMove;
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
    console.log('CACHE: All JSON cache files regenerated from DB.');
  },

  /** READ ACCESSORS (Preferred over DB) */
  read: (file: string) => {
    const data = cache.get();
    if (file.startsWith('moves/move_')) {
      const id = file.replace('moves/move_', '');
      return data.moves_detailed?.[`move_${id}`] || null;
    }
    return data[file] || null;
  }
};
