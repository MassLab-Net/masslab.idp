import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Eye, Database, Users, Cookie, Mail, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MassLab IAM" },
      { name: "description", content: "MassLab IAM Privacy Policy - How we collect, use, and protect your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader showAuth={false} />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-brand-soft">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            {t("privacy.badge")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("privacy.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("privacy.subtitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("privacy.lastUpdated")}</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("privacy.contents")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NavItem icon={Database} label={t("privacy.collectTitle")} href="#collect" />
            <NavItem icon={Eye} label={t("privacy.useTitle")} href="#use" />
            <NavItem icon={Lock} label={t("privacy.securityTitle")} href="#security" />
            <NavItem icon={Users} label={t("privacy.rightsTitle")} href="#rights" />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-12">
          {/* Introduction */}
          <Section id="intro" title={t("privacy.introTitle")} icon={Shield}>
            <p className="text-muted-foreground">{t("privacy.introDesc")}</p>
          </Section>

          {/* Information We Collect */}
          <Section id="collect" title={t("privacy.collectTitle")} icon={Database}>
            <p className="mb-4 text-muted-foreground">{t("privacy.collectDesc")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard title={t("privacy.collect1Title")} desc={t("privacy.collect1Desc")} />
              <InfoCard title={t("privacy.collect2Title")} desc={t("privacy.collect2Desc")} />
              <InfoCard title={t("privacy.collect3Title")} desc={t("privacy.collect3Desc")} />
              <InfoCard title={t("privacy.collect4Title")} desc={t("privacy.collect4Desc")} />
            </div>
          </Section>

          {/* How We Use */}
          <Section id="use" title={t("privacy.useTitle")} icon={Eye}>
            <p className="mb-4 text-muted-foreground">{t("privacy.useDesc")}</p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>{t("privacy.use1")}</li>
              <li>{t("privacy.use2")}</li>
              <li>{t("privacy.use3")}</li>
              <li>{t("privacy.use4")}</li>
            </ul>
          </Section>

          {/* Information Sharing */}
          <Section id="share" title={t("privacy.shareTitle")} icon={Users}>
            <p className="text-muted-foreground">{t("privacy.shareDesc")}</p>
          </Section>

          {/* Security */}
          <Section id="security" title={t("privacy.securityTitle")} icon={Lock}>
            <p className="text-muted-foreground">{t("privacy.securityDesc")}</p>
          </Section>

          {/* Your Rights */}
          <Section id="rights" title={t("privacy.rightsTitle")} icon={Scale}>
            <p className="mb-4 text-muted-foreground">{t("privacy.rightsDesc")}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <RightCard title={t("privacy.rights1Title")} desc={t("privacy.rights1Desc")} />
              <RightCard title={t("privacy.rights2Title")} desc={t("privacy.rights2Desc")} />
              <RightCard title={t("privacy.rights3Title")} desc={t("privacy.rights3Desc")} />
            </div>
          </Section>

          {/* Cookies */}
          <Section id="cookies" title={t("privacy.cookiesTitle")} icon={Cookie}>
            <p className="text-muted-foreground">{t("privacy.cookiesDesc")}</p>
          </Section>

          {/* Contact */}
          <Section id="contact" title={t("privacy.contactTitle")} icon={Mail}>
            <p className="text-muted-foreground">{t("privacy.contactDesc")}</p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="mailto:privacy@masslab.io">privacy@masslab.io</a>
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

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
      </CardContent>
    </Card>
  );
}

function RightCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-gradient-brand-soft p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
