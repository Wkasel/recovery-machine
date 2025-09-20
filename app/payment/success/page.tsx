import { PaymentSuccess } from "@/components/payments/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
