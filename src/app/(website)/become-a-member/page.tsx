import { AuthGuard } from "@/components/providers/AuthGuard";
import { BecomeMemberWizard } from "./_components/BecomeMemberWizard";

export default function BecomeMemberPage() {
  return (
    <AuthGuard>
      <BecomeMemberWizard />
    </AuthGuard>
  );
}
