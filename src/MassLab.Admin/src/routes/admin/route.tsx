import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { useAuth } from "@/lib/auth";
import { isLogoutInProgress } from "@/lib/auth-storage";
import { beginLogin } from "@/lib/oidc";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { ready, session } = useAuth();
  const startedRef = useRef(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || session || startedRef.current || typeof window === "undefined") {
      return;
    }

    if (isLogoutInProgress()) {
      window.location.replace("/");
      return;
    }

    startedRef.current = true;
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    void beginLogin({ returnTo }).catch((reason: unknown) => {
      startedRef.current = false;
      setLoginError(reason instanceof Error ? reason.message : "Unable to start sign-in.");
    });
  }, [ready, session]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6" data-auth-loading="true">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-card">
          <h1 className="text-lg font-semibold text-foreground">Checking your sign-in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loginError ?? "Trying your Identity session before opening the admin workspace."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3.25rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
