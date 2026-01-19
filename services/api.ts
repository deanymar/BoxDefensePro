
import { serverRouter } from '../server/router';
import { serverAuth } from '../server/auth';
import { User, UserRole, Item, MoveStatus } from '../types';

export const api = {
  login: async (identifier: string, role: UserRole) => {
    return await serverAuth.verifyIdentity(identifier, role);
  },

  getDashboard: async (user: User) => {
    return await serverRouter.getDashboard(user);
  },

  getMoves: async (user: User) => {
    return await serverRouter.listMoves(user);
  },

  getMoveDetail: async (id: string, user: User) => {
    return await serverRouter.getMoveDetail(id, user);
  },

  updateMoveStatus: async (id: string, status: MoveStatus, user: User) => {
    return await serverRouter.updateMoveStatus(id, status, user);
  },

  createBox: async (moveId: string, name: string, photos: string[], user: User) => {
    return await serverRouter.createBox(moveId, name, photos, user);
  },

  addItem: async (boxId: string, data: Partial<Item>, user: User) => {
    return await serverRouter.addItem(boxId, data, user);
  },

  // Admin specific
  listUsers: async (user: User) => {
    return await serverRouter.listUsers(user);
  },

  updateUserRole: async (userId: string, role: UserRole, user: User) => {
    return await serverRouter.updateUserRole(userId, role, user);
  },

  toggleUserFlag: async (userId: string, user: User) => {
    return await serverRouter.toggleUserFlag(userId, user);
  }
};
