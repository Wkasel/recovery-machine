import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For now, redirect admin to sign-in until admin system is fully implemented
  redirect('/sign-in');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}