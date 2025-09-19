import { Suspense } from 'react';
import { PaymentSuccess } from '@/components/payments/PaymentSuccess';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}