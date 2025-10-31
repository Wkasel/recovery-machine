import { AdminServerWrapper } from "@/components/admin/AdminServerWrapper";
import ExportsManager from "@/components/admin/ExportsManager";

export default function AdminExportsPage() {
  return (
    <AdminServerWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Data Exports</h1>
          <p className="text-muted-foreground font-light">Export business data for analysis and reporting</p>
        </div>
        <ExportsManager />
      </div>
    </AdminServerWrapper>
  );
}