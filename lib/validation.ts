import { z } from 'zod';

// Authentication Schemas
export const patronLoginSchema = z.object({
  email: z.string().email('Please enter a valid patron email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const patronSignupSchema = z.object({
  name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Valid email address is required'),
  phone: z.string().regex(/^(\+880|0)?1[3-9]\d{8}$/, 'Valid Bangladeshi mobile number required (e.g. +8801711000000)'),
  password: z.string().min(8, 'Password must be at least 8 characters with letters & numbers'),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  securityKey: z.string().optional(),
});

// Checkout & Order Schemas
export const checkoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  sku: z.string(),
  size: z.string(),
  color: z.string().optional(),
  quantity: z.number().int().positive().max(10),
  monogramText: z.string().max(5).optional(),
  monogramThread: z.enum(['ANTIQUE_GOLD', 'STERLING_SILVER', 'TONE_ON_TONE']).optional(),
});

export const checkoutSchema = z.object({
  patronName: z.string().min(2, 'Name is required').max(100),
  patronEmail: z.string().email('Valid email required'),
  patronPhone: z.string().min(8, 'Phone number required'),
  shippingAddress: z.string().min(5, 'Delivery address is required'),
  shippingCity: z.string().default('Dhaka'),
  shippingZone: z.string().default('Banani / Gulshan / Uttara Metro Express'),
  dispatchMethod: z.enum(['EXPRESS_CHAUFFEUR', 'STANDARD_NEXT_DAY', 'ATELIER_PICKUP']).default('EXPRESS_CHAUFFEUR'),
  doorstepTailorTrial: z.boolean().default(true),
  paymentMethod: z.enum(['BKASH', 'NAGAD', 'CARD', 'COD']),
  couponCode: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, 'Cart cannot be empty'),
  notes: z.string().max(500).optional(),
});

// Address Schema
export const addressSchema = z.object({
  label: z.string().min(2).max(50),
  recipientName: z.string().min(2).max(100),
  phone: z.string().min(8),
  street: z.string().min(5),
  area: z.string().min(2),
  city: z.string().default('Dhaka'),
  division: z.string().default('Dhaka'),
  postalCode: z.string().default('1213'),
  country: z.string().default('Bangladesh'),
  isDefault: z.boolean().default(false),
});

// Measurement Vault Schema
export const measurementSchema = z.object({
  collar: z.number().min(12).max(22),
  chest: z.number().min(30).max(60),
  waist: z.number().min(24).max(60),
  shoulder: z.number().min(14).max(26),
  sleeve: z.number().min(20).max(36),
  bicep: z.number().min(10).max(26),
  inseam: z.number().min(24).max(42),
  kurtaLength: z.number().min(34).max(54),
  monogramInitials: z.string().max(5).optional(),
  monogramThread: z.enum(['ANTIQUE_GOLD', 'STERLING_SILVER', 'TONE_ON_TONE']).optional(),
  monogramPlacement: z.enum(['CUFF', 'PLACKET_BASE', 'CHEST_POCKET']).optional(),
  tailorNotes: z.string().max(500).optional(),
});

// Bespoke Appointment Booking
export const bespokeAppointmentSchema = z.object({
  patronName: z.string().min(2).max(100),
  phone: z.string().min(8),
  email: z.string().email(),
  salonLocation: z.enum(['BANANI_11_FLAGSHIP', 'SYLHET_ARTISANAL_SUITE', 'PRIVATE_RESIDENCE']),
  occasion: z.enum(['ROYAL_WEDDING', 'CEREMONIAL_EID', 'WARDROBE_COMMISSION', 'OTHER']),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD required'),
  timeSlot: z.string().min(3),
  partySize: z.number().int().min(1).max(10).default(1),
  notes: z.string().max(500).optional(),
});

// Admin Product Create / Edit
export const productAdminSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  slug: z.string().min(2),
  bengaliName: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().min(10),
  editorialStory: z.string().optional(),
  category: z.string(),
  fabric: z.string(),
  weaveOrigin: z.string(),
  gsm: z.number().int().positive().optional().nullable(),
  basePrice: z.number().int().positive(),
  costPrice: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isImmediateStock: z.boolean().default(true),
});

// Admin Order Status Update
export const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PACKAGING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional(),
  chauffeurName: z.string().optional(),
  trackingNode: z.string().optional(),
  etaText: z.string().optional(),
});

// Coupon Validation Schema
export const couponValidateSchema = z.object({
  code: z.string().min(2).max(20),
  orderAmount: z.number().int().positive(),
});

export type PatronLoginInput = z.infer<typeof patronLoginSchema>;
export type PatronSignupInput = z.infer<typeof patronSignupSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
export type BespokeAppointmentInput = z.infer<typeof bespokeAppointmentSchema>;
export type ProductAdminInput = z.infer<typeof productAdminSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
