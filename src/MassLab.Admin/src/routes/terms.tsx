import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, UserCheck, ShieldAlert, CreditCard, FileText, AlertTriangle, XCircle, Globe, RefreshCw, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MassLab IAM" },
      { name: "description", content: "MassLab IAM Terms of Service - The rules and guidelines for using our platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader showAuth={false} />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-brand-soft">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            {t("terms.badge")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("terms.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("terms.subtitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("terms.lastUpdated")}</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("terms.contents")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NavItem icon={UserCheck} label={t("terms.acceptanceTitle")} href="#acceptance" />
            <NavItem icon={ShieldAlert} label={t("terms.usageTitle")} href="#usage" />
            <NavItem icon={CreditCard} label={t("terms.paymentTitle")} href="#payment" />
            <NavItem icon={AlertTriangle} label={t("terms.limitationTitle")} href="#limitation" />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-12">
          {/* Introduction */}
          <Section id="intro" title={t("terms.introTitle")} icon={FileText}>
            <p className="text-muted-foreground">{t("terms.introDesc")}</p>
          </Section>

          {/* Acceptance */}
          <Section id="acceptance" title={t("terms.acceptanceTitle")} icon={UserCheck}>
            <p className="text-muted-foreground">{t("terms.acceptanceDesc")}</p>
          </Section>

          {/* Account Responsibilities */}
          <Section id="accounts" title={t("terms.accountsTitle")} icon={UserCheck}>
            <p className="text-muted-foreground">{t("terms.accountsDesc")}</p>
          </Section>

          {/* Acceptable Use */}
          <Section id="usage" title={t("terms.usageTitle")} icon={ShieldAlert}>
            <p className="mb-4 text-muted-foreground">{t("terms.usageDesc")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <UsageCard title={t("terms.usage1Title")} desc={t("terms.usage1Desc")} />
              <UsageCard title={t("terms.usage2Title")} desc={t("terms.usage2Desc")} />
              <UsageCard title={t("terms.usage3Title")} desc={t("terms.usage3Desc")} />
              <UsageCard title={t("terms.usage4Title")} desc={t("terms.usage4Desc")} />
            </div>
          </Section>

          {/* Payment */}
          <Section id="payment" title={t("terms.paymentTitle")} icon={CreditCard}>
            <p className="text-muted-foreground">{t("terms.paymentDesc")}</p>
          </Section>

          {/* Intellectual Property */}
          <Section id="ip" title={t("terms.intellectualTitle")} icon={FileText}>
            <p className="text-muted-foreground">{t("terms.intellectualDesc")}</p>
          </Section>

          {/* Limitation of Liability */}
          <Section id="limitation" title={t("terms.limitationTitle")} icon={AlertTriangle}>
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">{t("terms.limitationDesc")}</p>
              </CardContent>
            </Card>
          </Section>

          {/* Termination */}
          <Section id="termination" title={t("terms.terminationTitle")} icon={XCircle}>
            <p className="text-muted-foreground">{t("terms.terminationDesc")}</p>
          </Section>

          {/* Governing Law */}
          <Section id="governing" title={t("terms.governingTitle")} icon={Globe}>
            <p className="text-muted-foreground">{t("terms.governingDesc")}</p>
          </Section>

          {/* Changes */}
          <Section id="changes" title={t("terms.changesTitle")} icon={RefreshCw}>
            <p className="text-muted-foreground">{t("terms.changesDesc")}</p>
          </Section>

          {/* Contact */}
          <Section id="contact" title={t("terms.contactTitle")} icon={Mail}>
            <p className="text-muted-foreground">{t("terms.contactDesc")}</p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="mailto:legal@masslab.io">legal@masslab.io</a>
            </Button>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function NavItem({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:border-primary/30 hover:bg-accent">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-medium">{label}</span>
    </a>
  );
}

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function UsageCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
      </CardContent>
    </Card>
  );
}
