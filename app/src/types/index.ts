export interface StoreItem { id: string; name: string; category: string; price: number }

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  loyaltyPoints: number;
  loyaltyNumber?: string;
}

export interface Room {
  category: string;
  cost: number;
  createdAt: string;
  createdBy: string;
  desc: string;
  effectiveDate: string;
  expirationDate: string;
  name: string;
  org: string;
  sku: string;
  subcategory: string;
  upc: string;
  updatedAt: string;
  updatedBy: string;
  _id: string;
}

export interface FBItem {
  _id: string;
  name: string;
  category: 'food' | 'beverage';
  subcategory: 'breakfast' | 'main' | 'dessert' | 'alcoholic' | 'non-alcoholic';
  cost: number;
}

export interface SpaService {
  id: string;
  name: string;
  category: 'massage' | 'facial' | 'body' | 'nails' | 'package';
  duration: number;
  price: number;
}

export interface BaseTransaction {
  folioId: string;
  timestamp: string;
  total: number;
  tax: number;
  finalTotal: number;
  paymentType: 'direct' | 'room';
  reprice? : any;
  earnSummary?: any;
  offers?: any;
}

export interface FBTransaction extends BaseTransaction {
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  gratuity: number;
}

export interface SpaTransaction extends BaseTransaction {
  services: {
    serviceId: string;
    name: string;
    price: number;
  }[];
  gratuity: number;
}

export interface Reservation {
  id: string;
  folioId: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  status: 'reserved' | 'checked-in' | 'checked-out';
  room: Room;
  totalAmount: number;
  finalAmount: number;
  pointsApplied: number;
  pointsConversionRate: number;
  loyaltyNumber?: string;
  fbTransactions: FBTransaction[];
  spaTransactions: SpaTransaction[];
  earnSummary?: any;
  offers?: any;
}

export interface KeyValue {
  key: string;
  value: number;
}

export interface Product {
  category: string;
  cost: number;
  createdAt: string; // ISO string
  createdBy: string; // User ID
  effectiveDate: string; // ISO string
  expirationDate: string; // ISO string
  name: string;
  org: string; // Organization ID
  sku: string; // Stock Keeping Unit
  subcategory: string;
  updatedAt: string; // ISO string
  updatedBy: string; // User ID
  _id: string; // Unique identifier
  ext?: Ext;
}

export interface Ext {
  duration: number
}

export interface Ticket {
  id: string;
  balance: number;
  created: Date;
  fsp: number;
}

export interface TicketHistoryEntry {
  type: 'insert' | 'cashout';
  ticket: Ticket;
  timestamp: Date;
}

export interface Member {
  id: string;
  tier: string;
  points: number;
  lastPlayed: any;
}

export interface MemberPlay{
  amount: number;
  pointsEarned: number;
  timestamp: any;
}


export interface IEarnSummary {
  [key: string]: EarnSummaryItem[];
}

export interface EarnSummaryItem {
  varName: string;
  description: string;
  value: number;
  currencyCode: string;
  color: string;
  multiplier: number;
}