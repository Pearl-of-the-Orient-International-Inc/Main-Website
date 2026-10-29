import { Suspense } from "react";
import { BecomeMemberWizard } from "./_components/BecomeMemberWizard";

export default function BecomeMemberPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fbf7]" />}>
      <BecomeMemberWizard />
    </Suspense>
  );
}
