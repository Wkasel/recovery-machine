import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/utils/admin/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, admin, user } = await checkAdminAccess('operator');

  if (!isAdmin) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader admin={admin!} user={user!} />
      
      <div className="flex">
        <AdminSidebar admin={admin!} />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}