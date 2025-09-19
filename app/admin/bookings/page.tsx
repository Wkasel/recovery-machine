import { BookingManager } from '@/components/admin/BookingManager';

export default function AdminBookingsPage() {
  return <BookingManager />;
}

export const metadata = {
  title: 'Booking Management - Recovery Machine Admin',
  description: 'Manage bookings, schedule conflicts, and calendar view',
};