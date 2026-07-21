import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { markLogoutInProgress } from "@/lib/auth-storage";
import { buildLogoutUrl } from "@/lib/oidc";

export function AccessDenied() {
  const { session } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-lg border-destructive/20 shadow-card">
        <CardContent className="p-8 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-5 text-2xl font-bold">
            Bạn không có quyền truy cập
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Tài khoản hiện tại không có quyền sử dụng tính năng này. Vui lòng
            liên hệ quản trị viên để được cấp quyền, hoặc đăng nhập bằng một tài
            khoản khác.
          </p>
          <Button
            className="mt-6"
            disabled={!session}
            onClick={() => {
              if (!session) return;
              markLogoutInProgress();
              window.location.replace(buildLogoutUrl(session));
            }}
          >
            Đăng nhập bằng tài khoản khác
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
