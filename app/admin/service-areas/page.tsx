import { AdminClientWrapper } from "@/components/admin/AdminClientWrapper";
import { ServiceAreaManager } from "@/components/admin/ServiceAreaManager";

export default function AdminServiceAreasPage() {
  return (
    <AdminClientWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Areas</h1>
          <p className="text-neutral-400">Manage service locations and coverage areas</p>
        </div>
        <ServiceAreaManager />
      </div>
    </AdminClientWrapper>
  );
}

export const metadata = {
  title: "Service Areas - Recovery Machine Admin",
  description: "Manage service locations and coverage areas",
};