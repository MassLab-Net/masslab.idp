import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/">
              <Logo size={32} />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Enterprise Identity & Access Management for modern teams.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
              <li><a href="/docs#api" className="hover:text-foreground">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground">Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">{t("home.footerPrivacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">{t("home.footerTerms")}</Link></li>
              <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <span className="text-sm text-muted-foreground">© 2025 MassLab. All rights reserved.</span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
