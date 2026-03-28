// ================================================================
// MOROCCO MALL SCREEN - TypeScript Types
// ================================================================

export type PackageName = 'starter' | 'impact' | 'premium' | 'exclusive';

export interface Package {
  id: PackageName;
  name: string;
  duration: number; // seconds
  price: number; // MAD
  description: string;
  bestFor: string;
  frequency: string;
  featured?: boolean;
  features: string[];
}

export type ContentType = 'image' | 'video';

export interface UploadedAsset {
  id: string;
  bookingId?: string;
  type: ContentType;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // seconds, for video
  createdAt: string;
}

export type BookingStatus =
  | 'draft'
  | 'uploaded'
  | 'pending_payment'
  | 'paid'
  | 'pending_review'
  | 'approved'
  | 'revision_requested'
  | 'rejected'
  | 'scheduled'
  | 'displayed'
  | 'cancelled'
  | 'refunded';

export interface TimeSlot {
  id: string;
  date: string; // ISO date string
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  isBlocked: boolean;
  bookingId?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  campaignTitle: string;
  message?: string;
  vatNumber?: string;
  invoiceRequested: boolean;
  agreeTerms: boolean;
  agreeContent: boolean;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  packageId: PackageName;
  package?: Package;
  asset?: UploadedAsset;
  assetId?: string;
  slotId?: string;
  slot?: TimeSlot;
  customer: CustomerInfo;
  paymentId?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentAmount?: number;
  adminNotes?: string;
  reviewNotes?: string[];
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  displayedAt?: string;
}

export interface ReviewNote {
  id: string;
  bookingId: string;
  adminId: string;
  note: string;
  type: 'internal' | 'customer_facing';
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'reviewer';
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  bookingId: string;
  type: string;
  recipient: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt?: string;
  createdAt: string;
}

// Booking flow state
export interface BookingFlowState {
  currentStep: 1 | 2 | 3 | 4 | 5;
  selectedPackage: Package | null;
  uploadedAsset: UploadedAsset | null;
  selectedSlot: TimeSlot | null;
  customerInfo: Partial<CustomerInfo>;
  bookingId: string | null;
  contentMode: 'fit' | 'fill';
}

// Screen config for perspective mapping
export interface ScreenConfig {
  // Corner coordinates [x, y] as percentages of image dimensions
  centralScreen: {
    topLeft: [number, number];
    topRight: [number, number];
    bottomRight: [number, number];
    bottomLeft: [number, number];
  };
  // Optional brightness/contrast tuning
  brightness: number; // 0-2, default 1
  contrast: number; // 0-2, default 1
  saturation: number; // 0-2, default 1
  // Optional overlay
  ledOverlay: boolean;
  glowIntensity: number; // 0-1
}

// Admin dashboard stats
export interface DashboardStats {
  totalBookings: number;
  pendingReview: number;
  approved: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  occupancyRate: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
