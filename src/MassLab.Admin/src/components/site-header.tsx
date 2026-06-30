import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Flag } from "@/components/flag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader({ showAuth = true }: { showAuth?: boolean }) {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 gap-2">
                <Flag lang={lang} className="h-3.5 w-5 rounded-sm shadow-sm" />
                <span className="hidden text-sm font-medium sm:inline">
                  {lang === "vi" ? "Tiếng Việt" : "English"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>{t("home.lang")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLang("en")} className="gap-2">
                <Flag lang="en" className="h-3.5 w-5 rounded-sm" /> English
                {lang === "en" && <span className="ml-auto text-primary">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("vi")} className="gap-2">
                <Flag lang="vi" className="h-3.5 w-5 rounded-sm" /> Tiếng Việt
                {lang === "vi" && <span className="ml-auto text-primary">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {showAuth && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">{t("home.login")}</Link>
              </Button>
              <Button size="sm" className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95" asChild>
                <Link to="/auth">{t("home.getStarted")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
