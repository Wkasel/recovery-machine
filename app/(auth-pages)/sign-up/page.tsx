import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import MagicLink from "@/components/auth/MagicLink";
import PhoneSignIn from "@/components/auth/PhoneSignIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "sonner";

export default function Signup() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex-1 flex flex-col items-center justify-center min-w-80 max-w-md mx-auto p-4">
        <div className="w-full">
          <h1 className="text-2xl font-medium mb-2">Sign up</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Already have an account?{" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-in">
              Sign in
            </Link>
          </p>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="google">
              <GoogleSignInButton />
            </TabsContent>
            <TabsContent value="magic-link">
              <MagicLink />
            </TabsContent>
            <TabsContent value="phone">
              <PhoneSignIn />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
