
export enum CountType {
  EXACT = 'exact',
  BREAKABLE = 'broken',
  MISC = 'other'
}

export enum MoveStatus {
  CREATED = 'created',
  PACKING = 'packing',
  FORM_GENERATED = 'form_generated',
  SIGNED_CUSTOMER = 'signed_customer',
  SIGNED_MOVER = 'signed_mover',
  CLAIM = 'claim',
  CLAIM_RESOLVED = 'claim_resolved', 
  COMPLETED = 'completed'
}

export enum ProtectionTier {
  STANDARD = 'standard',
  ENHANCED = 'enhanced'
}

export interface PhotoWithMeta {
  data: string;
  timestamp: string;
}

export interface DamageReport {
  photos: PhotoWithMeta[];
  description: string;
  createdAt: string;
}

export interface ClaimResolution {
  payoutAmount: number;
  payer: 'insurance' | 'company';
  resolutionDate: string;
  outcomeNotes: string;
  durationDays: number;
}

export interface Item {
  id: string;
  boxId: string;
  name: string;
  description?: string;
  countType: CountType;
  quantity: number;
  photos: PhotoWithMeta[];
  damageReport?: DamageReport;
  createdAt: string;
}

export interface Box {
  id: string;
  moveId: string;
  name: string;
  photos: PhotoWithMeta[];
  damageReport?: DamageReport;
  createdAt: string;
}

export interface Move {
  id: string;
  companyId: string;
  customerPhone: string;
  customerName: string;
  moveDate: string;
  createdAt: string;
  status: MoveStatus;
  protectionTier: ProtectionTier;
  protectionPrice: number;
  platformFee: number;
  claimOpenedDate?: string;
  claimResolution?: ClaimResolution;
}

export interface User {
  id: string;
  phone?: string;
  companyName?: string;
  role: 'customer' | 'company';
  plan?: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  moves: Move[];
  boxes: Box[];
  items: Item[];
}
