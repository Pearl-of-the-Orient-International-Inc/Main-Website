import { ScrollProgress } from "@/components/magic-ui/ScrollProgress";
import { ToolsComponent } from "@/components/ToolsComponent";
import { CookieConsent } from "@/components/website/CookieConsent";
import { Footer } from "@/components/website/Footer";
import { Navbar } from "@/components/website/Navbar";
import { ReactNode } from "react";

const WebsiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-white">
      <ScrollProgress className="top-0 z-60" />
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
      <ToolsComponent />
    </main>
  );
};

export default WebsiteLayout;
