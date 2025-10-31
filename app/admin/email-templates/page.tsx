import { EmailTemplateManager } from "@/components/admin/EmailTemplateManager";

export default function AdminEmailTemplatesPage() {
  return <EmailTemplateManager />;
}

export const metadata = {
  title: "Email Templates - Recovery Machine Admin",
  description: "Manage automated email templates and communications",
};