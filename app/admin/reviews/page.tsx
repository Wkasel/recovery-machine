import { AdminServerWrapper } from "@/components/admin/AdminServerWrapper";
import ReviewsManager from "@/components/admin/ReviewsManager";

export default function AdminReviewsPage() {
  return (
    <AdminServerWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Reviews Management</h1>
          <p className="text-muted-foreground font-light">Manage customer reviews and feedback</p>
        </div>
        <ReviewsManager />
      </div>
    </AdminServerWrapper>
  );
}