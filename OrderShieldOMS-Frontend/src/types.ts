export type Page = 'dash' | 'orders' | 'create' | 'alerts' | 'users' | 'settings' | 'settings-courier' | 'settings-fraud' | 'settings-webhook' | 'profile' | 'tracking' | 'invoices' | 'products';

export interface Order {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: 'processing' | 'completed' | 'cancelled' | 'shipped' | 'flagged';
  fraudScore: number;
  date: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

export interface Incursion {
  id: string;
  type: 'order' | 'customer' | 'system';
  title: string;
  description: string;
  severity: 'critical' | 'review' | 'info';
  timestamp: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  issuedDate: string;
  dueDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst';
  avatar: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  category_id?: number;
  sku: string;
  stock: number;
}
