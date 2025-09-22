import { AdminClientWrapper } from "@/components/admin/AdminClientWrapper";
import NotificationsManager from "@/components/admin/NotificationsManager";

export default function AdminNotificationsPage() {
  return (
    <AdminClientWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-neutral-400">Configure email and SMS notification settings</p>
        </div>
        <NotificationsManager />
      </div>
    </AdminClientWrapper>
  );
}