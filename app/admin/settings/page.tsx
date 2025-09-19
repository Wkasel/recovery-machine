import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/utils/admin/auth';
import { BusinessSettingsManager } from '@/components/admin/settings/BusinessSettingsManager';
import { Skeleton } from '@/components/ui/skeleton';

export default async function AdminSettingsPage() {
  const { isAdmin, admin } = await checkAdminAccess('super_admin');

  if (!isAdmin || admin?.role !== 'super_admin') {
    redirect('/admin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your business configuration, policies, and system settings.
        </p>
      </div>

      <Suspense fallback={<SettingsLoadingSkeleton />}>
        <BusinessSettingsManager />
      </Suspense>
    </div>
  );
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}