import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function StripeCancelPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <XCircle className="w-10 h-10 text-gray-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Payment Cancelled</h1>
        <p className="text-xl text-muted-foreground">
          Your payment was not completed
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What happened?</CardTitle>
          <CardDescription>
            You cancelled the payment process before it was completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't worry - no charges were made to your card. Your booking was not confirmed and
            your selected time slot may still be available.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Need help?</p>
                <p>
                  If you experienced an issue during checkout or have questions about pricing,
                  please contact our support team at{" "}
                  <a href="mailto:support@therecoverymachine.co" className="underline">
                    support@therecoverymachine.co
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href="/book">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
