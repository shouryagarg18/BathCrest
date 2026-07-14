const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://measure-worship-fiber-mean.trycloudflare.com/api';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' };
  const token = localStorage.getItem('bathcrest_token');
  return {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `API Error ${res.status}`);
  return data;
}

// Auth
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; phone?: string }) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  updateProfile: (data: unknown) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  addAddress: (data: unknown) =>
    request('/auth/addresses', { method: 'POST', body: JSON.stringify(data) }),
  deleteAddress: (id: string) =>
    request(`/auth/addresses/${id}`, { method: 'DELETE' }),
};

// Products
export const productsAPI = {
  getAll: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/products?${qs}`);
  },
  getById: (id: string) => request(`/products/${id}`),
  getBySlug: (slug: string) => request(`/products/slug/${slug}`),
  getFeatured: () => request('/products/featured'),
  getBestSellers: () => request('/products/bestsellers'),
  create: (data: unknown) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  addReview: (id: string, data: { rating: number; comment: string; title?: string }) =>
    request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
};

// Categories
export const categoriesAPI = {
  getAll: () => request('/categories'),
  create: (data: unknown) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/categories/${id}`, { method: 'DELETE' }),
};

// Cart
export const cartAPI = {
  get: () => request('/cart'),
  add: (productId: string, quantity = 1) =>
    request('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (productId: string, quantity: number) =>
    request('/cart/update', { method: 'PUT', body: JSON.stringify({ productId, quantity }) }),
  remove: (productId: string) => request(`/cart/remove/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart/clear', { method: 'DELETE' }),
};

// Wishlist
export const wishlistAPI = {
  get: () => request('/wishlist'),
  toggle: (productId: string) =>
    request(`/wishlist/toggle/${productId}`, { method: 'POST' }),
  remove: (productId: string) =>
    request(`/wishlist/remove/${productId}`, { method: 'DELETE' }),
};

// Orders
export const ordersAPI = {
  create: (data: unknown) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/orders/my-orders'),
  getById: (id: string) => request(`/orders/${id}`),
  markPaid: (id: string, paymentResult: unknown) =>
    request(`/orders/${id}/pay`, { method: 'PUT', body: JSON.stringify({ paymentResult }) }),
};

// Coupons
export const couponsAPI = {
  validate: (code: string, orderTotal: number) =>
    request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, orderTotal }) }),
};

// Payments
export const paymentsAPI = {
  createIntent: (amount: number) =>
    request('/payments/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) }),
  simulateSuccess: (orderId: string, paymentMethod: string) =>
    request('/payments/simulate-success', { method: 'POST', body: JSON.stringify({ orderId, paymentMethod }) }),
};

// Admin
export const adminAPI = {
  getStats: () => request('/admin/stats'),
  getUsers: (page = 1) => request(`/admin/users?page=${page}`),
};
