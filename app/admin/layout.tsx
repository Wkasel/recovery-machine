import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  // For now, redirect admin to sign-in until admin system is fully implemented
  redirect("/sign-in");

  // This return is never reached due to redirect above

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
