
export enum Category {
  PIZZA_RESTAURANT = 'Pizza/Restaurant',
  DELIVERY_SHOP = 'Delivery Shop',
  PHARMACY = 'Pharmacy',
  HARDWARE = 'Hardware',
  AUTO_SPARE_PARTS = 'Auto Spare Parts',
  GENERAL_STORE = 'General Store'
}

export enum Language {
  EN = 'English',
  UR = 'Urdu'
}

export enum PrinterType {
  THERMAL = 'Thermal',
  NORMAL = 'Normal'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export enum DriverStatus {
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  OFFLINE = 'Offline'
}

export interface CompanySettings {
  name: string;
  category: Category;
  language: Language;
  adminName: string;
  isWizardComplete: boolean;
}

export interface PrinterSettings {
  type: PrinterType;
  size: string;
  showLogo: boolean;
  header: string;
  footer: string;
}

export interface PaymentSettings {
  cashEnabled: boolean;
  jazzCashEnabled: boolean;
  easyPaisaEnabled: boolean;
  bankTransferEnabled: boolean;
  cardEnabled: boolean;
  otherLabel: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameUr: string;
  price: number;
  stock: number;
  category: string;
  // Category specific
  batchNo?: string;
  expiryDate?: string;
  manufacturer?: string;
  brand?: string;
  partNumber?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  lastAssignedAt?: string;
  activeOrdersCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  type: 'Dine-in' | 'Takeaway' | 'Delivery';
  driverId?: string;
  createdAt: string;
  paymentMethod: string;
}
