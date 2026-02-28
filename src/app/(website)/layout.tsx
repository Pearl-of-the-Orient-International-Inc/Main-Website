import { WebsiteShell } from "@/components/website/WebsiteShell";
import { ReactNode } from "react";

const WebsiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-white">
      <WebsiteShell>{children}</WebsiteShell>
    </main>
  );
};

export default WebsiteLayout;
