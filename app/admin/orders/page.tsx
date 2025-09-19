import { PaymentManager } from '@/components/admin/PaymentManager';

export default function AdminOrdersPage() {
  return <PaymentManager />;
}

export const metadata = {
  title: 'Order Management - Recovery Machine Admin',
  description: 'Manage orders, payments, and refunds',
};