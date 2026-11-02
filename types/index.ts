export type Role = 'CUSTOMER' | 'SUPPORT_AGENT' | 'INVENTORY_MANAGER' | 'SUPER_ADMIN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKAGING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'BKASH' | 'NAGAD' | 'CARD' | 'COD';
export type DispatchMethod = 'EXPRESS_CHAUFFEUR' | 'STANDARD_NEXT_DAY' | 'ATELIER_PICKUP';

export interface CartItem {
  productId: string;
  variantId?: string;
  sku: string;
  title: string;
  image: string;
  size: string;
  color?: string;
  price: number;
  quantity: number;
  textileSpec?: string;
  monogramText?: string;
  monogramThread?: 'ANTIQUE_GOLD' | 'STERLING_SILVER' | 'TONE_ON_TONE';
}

export interface WishlistItem {
  productId: string;
  sku: string;
  title: string;
  image: string;
  price: number;
  size: string;
  category: string;
  fabric: string;
}

export interface SizingSpec {
  collar: number;
  chest: number;
  waist: number;
  shoulder: number;
  sleeve: number;
  bicep: number;
  inseam: number;
  kurtaLength: number;
}
