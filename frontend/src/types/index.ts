// Type definitions for BathCrest

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string }[];
  category: { _id: string; name: string; slug: string } | string;
  categoryName: string;
  sku: string;
  stock: number;
  brand: string;
  material?: string;
  finish?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
  };
  warranty?: string;
  specifications: { key: string; value: string }[];
  reviews: Review[];
  ratings: number;
  numReviews: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: string;
  name: string;
  avatar?: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface CartItem {
  _id: string;
  product: string | Product;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  coupon?: string;
  couponDiscount: number;
}

export interface Order {
  _id: string;
  orderId: string;
  user: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'stripe' | 'razorpay' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
  };
  itemsTotal: number;
  shippingPrice: number;
  taxPrice: number;
  discountAmount: number;
  totalPrice: number;
  coupon?: string;
  orderStatus: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  validTill: string;
  isActive: boolean;
}

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  products?: T[];
  total: number;
  page: number;
  pages: number;
}
