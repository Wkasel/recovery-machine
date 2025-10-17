import { AdminServerWrapper } from "@/components/admin/AdminServerWrapper";
import NotificationsManager from "@/components/admin/NotificationsManager";

export default function AdminNotificationsPage() {
  return (
    <AdminServerWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Notifications</h1>
          <p className="text-muted-foreground font-light">Configure email and SMS notification settings</p>
        </div>
        <NotificationsManager />
      </div>
    </AdminServerWrapper>
  );
}