
export enum MoveStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED'
}

export enum CountType {
  EXACT = 'EXACT',
  BROKEN = 'BROKEN',
  OTHER = 'OTHER'
}

export type UserRole = 'customer' | 'company' | 'admin';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  company_name?: string;
  is_flagged?: boolean;
  created_at: string;
}

export interface PhotoMetadata {
  id: string;
  original_url: string;
  thumbnail_url: string;
  created_at: string;
}

export interface Move {
  id: string;
  user_id: string;
  assigned_company_id?: string;
  status: MoveStatus;
  created_at: string;
}

export interface Box {
  id: string;
  move_id: string;
  name: string;
  photos: PhotoMetadata[];
  qr_code?: string; // Encrypted string or ID
  created_at: string;
}

export interface Item {
  id: string;
  box_id: string;
  name: string;
  description: string;
  count_type: CountType;
  quantity: number;
  weight?: number; // Optional inventory weight field
  photos: PhotoMetadata[];
  created_at: string;
}

export interface DashboardSummary {
  total_moves: number;
  active_boxes: number;
  unverified_items: number;
  system_alerts: number;
  last_updated: string;
}

export interface MoveFullDetail extends Move {
  boxes: (Box & { items: Item[] })[];
  customer_phone?: string;
  company_name?: string;
}
