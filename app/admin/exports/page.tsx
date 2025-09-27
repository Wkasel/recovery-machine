import { AdminClientWrapper } from "@/components/admin/AdminClientWrapper";
import ExportsManager from "@/components/admin/ExportsManager";

export default function AdminExportsPage() {
  return (
    <AdminClientWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Exports</h1>
          <p className="text-neutral-400">Export business data for analysis and reporting</p>
        </div>
        <ExportsManager />
      </div>
    </AdminClientWrapper>
  );
}