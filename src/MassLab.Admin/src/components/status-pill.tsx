import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "neutral" | "info";

export function statusVariant(s: string): Variant {
  const v = s.toLowerCase();
  if (v === "active") return "success";
  if (v === "invited" || v === "pending") return "info";
  if (v === "suspended" || v === "disabled") return "danger";
  if (v === "starter") return "neutral";
  if (v === "business") return "info";
  if (v === "enterprise") return "success";
  return "neutral";
}

export function StatusPill({ variant = "neutral", children }: { variant?: Variant; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        variant === "success" && "border-success/30 bg-success/10 text-success",
        variant === "info" && "border-primary/30 bg-primary/10 text-primary",
        variant === "warning" && "border-warning/40 bg-warning/15 text-foreground",
        variant === "danger" && "border-destructive/30 bg-destructive/10 text-destructive",
        variant === "neutral" && "border-border bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "success" && "bg-success",
          variant === "info" && "bg-primary",
          variant === "warning" && "bg-warning",
          variant === "danger" && "bg-destructive",
          variant === "neutral" && "bg-muted-foreground/50",
        )}
      />
      {children}
    </span>
  );
}
