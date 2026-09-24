import { Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { PageLoader } from "@/components/common/PageLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { sectionsFor } from "@/components/admin/sections";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { section = "dashboard" } = useParams();
  const { role } = useAuth();
  const sections = sectionsFor(role);
  const active = sections.find((s) => s.id === section);

  // Unknown section, or one this role can't see: fall back to the dashboard.
  if (!active) return <Navigate to="/admin" replace />;
  const Section = active.component;

  return (
    // The header sits inside the content column, so the sidebar runs full height.
    <SidebarProvider style={{ "--header-height": "0px" } as React.CSSProperties}>
      <AdminSidebar sections={sections} activeId={active.id} />
      <SidebarInset className="min-w-0">
        <AdminHeader title={active.title} />
        <main className="flex-1 bg-muted/30 p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-4">
            <p className="text-sm text-muted-foreground">{active.description}</p>
            <ErrorBoundary resetKey={active.id}>
              <Suspense fallback={<PageLoader className="min-h-[50vh]" />}>
                <Section />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Admin;
