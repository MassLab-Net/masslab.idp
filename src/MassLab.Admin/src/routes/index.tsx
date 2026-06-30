import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Users,
  Key,
  Building2,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MassLab IAM — Identity & Access for modern teams" },
      { name: "description", content: "Enterprise Identity & Access Management. Multi-tenant RBAC, SSO, and audit-ready compliance." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-brand opacity-[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-[0.06] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand opacity-[0.04] blur-3xl" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-sm font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            {t("home.badge")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t("home.hero1")} <span className="text-gradient-brand">{t("home.hero2")}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            {t("home.heroSub")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 gap-2 bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" asChild>
              <Link to="/auth">
                {t("home.startFree")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12" asChild>
              <Link to="/auth">{t("home.seeDemo")}</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {t("home.noCc")}
          </p>
        </div>

        {/* Hero visual - dashboard mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/30 px-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/20 p-6">
              <div className="grid h-full gap-4 md:grid-cols-4">
                <div className="hidden rounded-lg border border-border bg-background/80 md:block" />
                <div className="col-span-3 space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {["12,847", "156", "99.99%"].map((v, i) => (
                      <div key={i} className="rounded-xl border border-border bg-background/80 p-4">
                        <div className="text-2xl font-bold text-gradient-brand">{v}</div>
                        <div className="mt-1 h-3 w-16 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border bg-background/80 p-4">
                    <div className="mb-3 h-4 w-24 rounded bg-muted" />
                    <div className="grid gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-8 rounded bg-muted/50" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.featuresSub")}</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title={t("home.f1Title")}
              description={t("home.f1Desc")}
            />
            <FeatureCard
              icon={Users}
              title={t("home.f2Title")}
              description={t("home.f2Desc")}
            />
            <FeatureCard
              icon={Key}
              title={t("home.f3Title")}
              description={t("home.f3Desc")}
            />
            <FeatureCard
              icon={Building2}
              title={t("home.f4Title")}
              description={t("home.f4Desc")}
            />
            <FeatureCard
              icon={Lock}
              title={t("home.f5Title")}
              description={t("home.f5Desc")}
            />
            <FeatureCard
              icon={Zap}
              title={t("home.f6Title")}
              description={t("home.f6Desc")}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 rounded-2xl border border-border bg-gradient-brand-soft p-8 md:grid-cols-4">
          <StatCard value="12,000+" label={t("home.statTenants")} />
          <StatCard value="4.8M" label={t("home.statIdentities")} />
          <StatCard value="99.99%" label={t("home.statUptime")} />
          <StatCard value="50ms" label={t("home.statLatency")} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.testimonialsTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.testimonialsSub")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <TestimonialCard
              quote={t("home.t1Quote")}
              author={t("home.t1Author")}
              role={t("home.t1Role")}
              company="Contoso Bank"
            />
            <TestimonialCard
              quote={t("home.t2Quote")}
              author={t("home.t2Author")}
              role={t("home.t2Role")}
              company="Acme Corp"
            />
            <TestimonialCard
              quote={t("home.t3Quote")}
              author={t("home.t3Author")}
              role={t("home.t3Role")}
              company="Northwind Labs"
            />
          </div>
        </div>
      </section>

      {/* Compliance badges */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA", "PCI DSS"].map((cert) => (
            <div key={cert} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {cert}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("home.ctaTitle")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("home.ctaSub")}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 gap-2 bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" asChild>
                <Link to="/auth">
                  {t("home.getStarted")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 gap-2" asChild>
                <Link to="/auth">
                  <Globe className="h-4 w-4" /> {t("home.seeDemo")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// ── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="group border-border bg-card shadow-card transition-all hover:border-primary/30 hover:shadow-elegant">
      <CardContent className="p-6">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gradient-brand md:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// ── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
}) {
  return (
    <Card className="border-border bg-card shadow-card">
      <CardContent className="p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">"{quote}"</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-primary-foreground">
            {author.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="text-sm font-medium">{author}</div>
            <div className="text-xs text-muted-foreground">{role}, {company}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
