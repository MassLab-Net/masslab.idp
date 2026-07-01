import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { clearLogoutInProgress, clearStoredSession } from "@/lib/auth-storage";

export const Route = createFileRoute("/logout-complete")({
  head: () => ({
    meta: [
      { title: "Signing out — MassLab IAM" },
      { name: "description", content: "Completing sign-out from MassLab IAM." },
    ],
  }),
  component: LogoutCompletePage,
});

function LogoutCompletePage() {
  useEffect(() => {
    clearStoredSession();
    clearLogoutInProgress();
    window.location.replace("/");
  }, []);

  return null;
}
