import { AdminServerWrapper } from "@/components/admin/AdminServerWrapper";
import { ServiceAreaManager } from "@/components/admin/ServiceAreaManager";

export default function AdminServiceAreasPage() {
  return (
    <AdminServerWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Service Areas</h1>
          <p className="text-muted-foreground font-light">Manage service locations and coverage areas</p>
        </div>
        <ServiceAreaManager />
      </div>
    </AdminServerWrapper>
  );
}

export const metadata = {
  title: "Service Areas - Recovery Machine Admin",
  description: "Manage service locations and coverage areas",
};