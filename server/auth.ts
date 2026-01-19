import { db } from '../services/db';
import { User, UserRole } from '../types';

/**
 * SERVER-SIDE AUTHENTICATION
 * Handles identity verification and role assignment.
 */
export const serverAuth = {
  verifyIdentity: async (identifier: string, expectedRole: UserRole): Promise<User> => {
    const database = db.get();
    // Normalize phone formatting for search
    const cleanId = identifier.trim();
    const user = database.users.find(u => u.phone === cleanId || u.phone.replace(/-/g, '') === cleanId.replace(/-/g, ''));

    if (!user) {
      throw new Error('ACCESS_DENIED: Identity not found in secure registry.');
    }

    // Ensure the user trying to log in matches the portal role
    if (user.role !== expectedRole) {
       console.error(`Auth mismatch: User ${user.phone} has role ${user.role} but tried to log in as ${expectedRole}`);
       throw new Error(`ACCESS_DENIED: User role (${user.role}) does not match the requested portal (${expectedRole}).`);
    }

    // In production, this would return a signed JWT
    return user;
  }
};