
import { db } from '../services/db';
import { MoveFullDetail, DashboardSummary } from '../types';

/**
 * SERVER-SIDE CACHE GENERATOR
 * Generates and provides access to JSON cache files.
 */
export const serverCache = {
  // Simulation of file storage
  _storageKey: 'box_defense_server_cache',

  generateAll: () => {
    const database = db.get();
    const cacheStore: Record<string, any> = {};

    // Generate root files
    cacheStore['users.json'] = database.users;
    cacheStore['moves.json'] = database.moves;
    cacheStore['boxes.json'] = database.boxes;
    cacheStore['items.json'] = database.items;
    cacheStore['dashboard-summary.json'] = {
      total_moves: database.moves.length,
      active_boxes: database.boxes.length,
      unverified_items: database.items.length,
      system_alerts: 0,
      last_updated: new Date().toISOString()
    } as DashboardSummary;

    // Generate detailed move files
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
      cacheStore[`moves/move_${move.id}.json`] = fullMove;
    });

    localStorage.setItem(serverCache._storageKey, JSON.stringify(cacheStore));
    console.log('SERVER: Cache JSON files regenerated from Source of Truth (DB).');
  },

  readFile: (filePath: string) => {
    const raw = localStorage.getItem(serverCache._storageKey);
    if (!raw) return null;
    const store = JSON.parse(raw);
    return store[filePath] || null;
  }
};
