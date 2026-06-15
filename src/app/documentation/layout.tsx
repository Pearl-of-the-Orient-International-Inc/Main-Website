import { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/Theme";
import { DocsHeader } from "@/components/documentations/Header";
import { DocsSidebar } from "@/components/documentations/Sidebar";
import { OnThisPage } from "@/components/documentations/OnThisPage";
import { DocsProvider } from "@/lib/docs-context";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const DocsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DocsProvider>
        <DocsHeader />
        <div className="grid py-5 lg:px-20 px-4 lg:grid-cols-[260px_minmax(0,1fr)_200px] gap-5">
          <div className="hidden lg:block">
            <DocsSidebar />
          </div>
          <main className="p-5">{children}</main>
          <div className="hidden lg:block">
            <OnThisPage />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 lg:hidden block">
          <ThemeSwitcher />
        </div>
      </DocsProvider>
    </ThemeProvider>
  );
};

export default DocsLayout;
