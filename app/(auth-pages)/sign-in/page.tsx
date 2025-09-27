"use client";

import { Suspense } from "react";
import { EnhancedSignInForm } from "@/components/auth/enhanced/forms/EnhancedSignInForm";

function SignInForm(): React.ReactElement {
  return <EnhancedSignInForm />;
}

export default function SignInPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
