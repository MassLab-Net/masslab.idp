import { createFileRoute } from "@tanstack/react-router";
import { Book, Code, Shield, Users, Key, Building2, Zap, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — MassLab IAM" },
      { name: "description", content: "MassLab IAM Documentation - Learn how to integrate, configure, and use the platform." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-brand-soft">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-4">{t("docs.badge")}</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("docs.title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t("docs.subtitle")}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" asChild>
              <a href="#quickstart">{t("docs.quickstart")}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/masslab/iam-sdk" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2 h-4 w-4" /> GitHub SDK
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="quickstart" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">{t("docs.gettingStarted")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DocCard icon={Zap} title={t("docs.gs1Title")} description={t("docs.gs1Desc")} />
          <DocCard icon={Key} title={t("docs.gs2Title")} description={t("docs.gs2Desc")} />
          <DocCard icon={Users} title={t("docs.gs3Title")} description={t("docs.gs3Desc")} />
        </div>
      </section>

      {/* Core Concepts */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">{t("docs.coreConcepts")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DocCard icon={Users} title={t("docs.concept1Title")} description={t("docs.concept1Desc")} />
          <DocCard icon={Shield} title={t("docs.concept2Title")} description={t("docs.concept2Desc")} />
          <DocCard icon={Key} title={t("docs.concept3Title")} description={t("docs.concept3Desc")} />
          <DocCard icon={Building2} title={t("docs.concept4Title")} description={t("docs.concept4Desc")} />
          <DocCard icon={Code} title={t("docs.concept5Title")} description={t("docs.concept5Desc")} />
          <DocCard icon={Book} title={t("docs.concept6Title")} description={t("docs.concept6Desc")} />
        </div>
      </section>

      {/* Code Example */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">{t("docs.codeExample")}</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
            <Badge variant="outline" className="font-mono text-xs">TypeScript</Badge>
          </div>
          <pre className="overflow-x-auto p-4 text-sm">
            <code className="text-muted-foreground">{`import { MassLabIAM } from '@masslab/iam-sdk';

const iam = new MassLabIAM({
  tenantId: 'your-tenant-id',
  apiKey: process.env.MASSLAB_API_KEY,
});

// Check user permissions
const hasAccess = await iam.hasPermission({
  userId: 'usr_123',
  permission: 'iam.users.write',
});

console.log(hasAccess); // true or false

// List all roles for a tenant
const roles = await iam.roles.list();
console.log(roles);
// [{ id: 'role_admin', name: 'Administrator', ... }]`}</code>
          </pre>
        </div>
      </section>

      {/* API Reference */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">{t("docs.apiRef")}</h2>
        <div className="mt-6 space-y-3">
          {[
            { method: "GET", path: "/v1/users", desc: t("docs.apiUsers") },
            { method: "POST", path: "/v1/users", desc: t("docs.apiUsersCreate") },
            { method: "GET", path: "/v1/roles", desc: t("docs.apiRoles") },
            { method: "POST", path: "/v1/roles", desc: t("docs.apiRolesCreate") },
            { method: "GET", path: "/v1/permissions", desc: t("docs.apiPerms") },
            { method: "POST", path: "/v1/check", desc: t("docs.apiCheck") },
          ].map((api) => (
            <div key={api.path} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <Badge className={`font-mono text-xs ${api.method === "GET" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>
                {api.method}
              </Badge>
              <code className="flex-1 font-mono text-sm">{api.path}</code>
              <span className="text-sm text-muted-foreground">{api.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SDKs */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">{t("docs.sdks")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SdkCard name="TypeScript / Node.js" href="https://npmjs.com/package/@masslab/iam-sdk" />
          <SdkCard name="Python" href="https://pypi.org/project/masslab-iam" />
          <SdkCard name="Go" href="https://github.com/masslab/iam-go" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function DocCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <Card className="border-border bg-card shadow-card transition-all hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SdkCard({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-card"
    >
      <span className="font-medium">{name}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}
