import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_MODULES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
  readOnly?: boolean;
  highlightDirect?: string[];
};

export function PermissionTree({ selected, onChange, readOnly, highlightDirect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PERMISSION_MODULES.map((m) => [m.id, true])),
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return PERMISSION_MODULES;
    const q = query.toLowerCase();
    return PERMISSION_MODULES.map((m) => ({
      ...m,
      permissions: m.permissions.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      ),
    })).filter((m) => m.permissions.length > 0);
  }, [query]);

  const toggleOne = (id: string) => {
    if (readOnly) return;
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const toggleModule = (modulePermIds: string[], allChecked: boolean) => {
    if (readOnly) return;
    onChange(
      allChecked
        ? selected.filter((x) => !modulePermIds.includes(x))
        : Array.from(new Set([...selected, ...modulePermIds])),
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <Badge variant="outline" className="font-normal">
          {selected.length} selected
        </Badge>
      </div>

      <div className="divide-y divide-border">
        {filtered.map((m) => {
          const ids = m.permissions.map((p) => p.id);
          const checkedCount = ids.filter((id) => selected.includes(id)).length;
          const allChecked = checkedCount === ids.length;
          const some = checkedCount > 0 && !allChecked;
          const isOpen = open[m.id] ?? true;

          return (
            <div key={m.id}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [m.id]: !isOpen }))}
                  className="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-accent"
                  aria-label="toggle module"
                >
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                </button>
                <Checkbox
                  checked={allChecked ? true : some ? "indeterminate" : false}
                  onCheckedChange={() => toggleModule(ids, allChecked)}
                  disabled={readOnly}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {checkedCount}/{ids.length} permissions
                  </div>
                </div>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-brand transition-all"
                    style={{ width: `${(checkedCount / ids.length) * 100}%` }}
                  />
                </div>
              </div>

              {isOpen && (
                <div className="ml-12 mr-3 mb-3 grid gap-1 border-l border-border pl-4">
                  {m.permissions.map((p) => {
                    const checked = selected.includes(p.id);
                    const isDirect = highlightDirect?.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent",
                          readOnly && "cursor-default",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleOne(p.id)}
                          disabled={readOnly}
                        />
                        <div className="flex-1">
                          <div className="text-sm">{p.name}</div>
                          <code className="text-[11px] text-muted-foreground">{p.id}</code>
                        </div>
                        {isDirect && (
                          <Badge variant="outline" className="border-primary/40 text-primary">
                            Direct
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
