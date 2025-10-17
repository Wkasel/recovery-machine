import { UserManager } from "@/components/admin/UserManager";

export default function AdminUsersPage() {
  return <UserManager />;
}

export const metadata = {
  title: "User Management - Recovery Machine Admin",
  description: "Manage users, profiles, and credits",
};
