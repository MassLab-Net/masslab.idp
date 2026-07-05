import { useDeferredValue, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import {
  type PermissionTreeItem,
  type PermissionTreeNode,
  buildPermissionTree,
  toPermissionDisplayName,
} from "@/components/permission-tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  permissions: PermissionTreeItem[];
  inheritedIds: string[];
  grantedIds: string[];
  deniedIds: string[];
  onChange: (value: { grantedIds: string[]; deniedIds: string[] }) => void;
  rootLabel?: string;
  rootDescription?: string;
  searchPlaceholder?: string;
  expandAllLabel?: string;
  collapseAllLabel?: string;
  emptyLabel?: string;
  inheritedLabel?: string;
  grantLabel?: string;
  denyLabel?: string;
  clearLabel?: string;
};

type OverrideMode = "inherit" | "grant" | "deny";

export function UserPermissionOverridesTree({
  permissions,
  inheritedIds,
  grantedIds,
  deniedIds,
  onChange,
  rootLabel = "User access",
  rootDescription,
  searchPlaceholder = "Search permissions...",
  expandAllLabel = "Expand all",
  collapseAllLabel = "Collapse all",
  emptyLabel = "No permissions found.",
  inheritedLabel = "Inherited",
  grantLabel = "Grant",
  denyLabel = "Deny",
  clearLabel = "Clear",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredPermissions = useMemo(() => {
    if (!normalizedQuery) {
      return permissions;
    }

    return permissions.filter((permission) =>
      [permission.name, permission.category, permission.description ?? ""].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [normalizedQuery, permissions]);

  const tree = useMemo(
    () => buildPermissionTree(filteredPermissions),
    [filteredPermissions],
  );
  const allNodeIds = useMemo(() => flattenNodeIds(tree), [tree]);
  const inheritedSet = useMemo(() => new Set(inheritedIds), [inheritedIds]);
  const grantedSet = useMemo(() => new Set(grantedIds), [grantedIds]);
  const deniedSet = useMemo(() => new Set(deniedIds), [deniedIds]);

  const setAllExpanded = (isExpanded: boolean) => {
    setOpen(Object.fromEntries(allNodeIds.map((id) => [id, isExpanded])));
  };

  const applyMode = (permissionIds: string[], mode: OverrideMode) => {
    const nextGranted = new Set(grantedIds);
    const nextDenied = new Set(deniedIds);

    for (const permissionId of permissionIds) {
      nextGranted.delete(permissionId);
      nextDenied.delete(permissionId);

      if (mode === "grant") {
        nextGranted.add(permissionId);
      } else if (mode === "deny") {
        nextDenied.add(permissionId);
      }
    }

    onChange({
      grantedIds: Array.from(nextGranted),
      deniedIds: Array.from(nextDenied),
    });
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            +{grantedIds.length} / -{deniedIds.length}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAllExpanded(true)}
          >
            {expandAllLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAllExpanded(false)}
          >
            {collapseAllLabel}
          </Button>
        </div>
      </div>

      {tree.length === 0 ? (
        <div className="px-4 py-8 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="p-3">
          <div className="relative ml-5">
            <div className="relative flex items-center gap-2 py-1.5">
              <div className="grid h-5 w-5 place-items-center rounded-sm border border-border bg-muted text-[10px] font-semibold text-muted-foreground">
                U
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {rootLabel}
                </div>
                {rootDescription ? (
                  <div className="truncate text-[11px] text-muted-foreground">
                    {rootDescription}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="ml-5 border-l border-dashed border-border pl-3 pb-1">
            {tree.map((node) => (
              <OverrideBranch
                key={node.id}
                node={node}
                open={open}
                setOpen={setOpen}
                forceExpanded={!!normalizedQuery}
                inheritedSet={inheritedSet}
                grantedSet={grantedSet}
                deniedSet={deniedSet}
                inheritedLabel={inheritedLabel}
                grantLabel={grantLabel}
                denyLabel={denyLabel}
                clearLabel={clearLabel}
                onApplyMode={applyMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type OverrideBranchProps = {
  node: PermissionTreeNode;
  open: Record<string, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  forceExpanded: boolean;
  inheritedSet: Set<string>;
  grantedSet: Set<string>;
  deniedSet: Set<string>;
  inheritedLabel: string;
  grantLabel: string;
  denyLabel: string;
  clearLabel: string;
  onApplyMode: (permissionIds: string[], mode: OverrideMode) => void;
};

function OverrideBranch({
  node,
  open,
  setOpen,
  forceExpanded,
  inheritedSet,
  grantedSet,
  deniedSet,
  inheritedLabel,
  grantLabel,
  denyLabel,
  clearLabel,
  onApplyMode,
}: OverrideBranchProps) {
  const isExpanded = forceExpanded || open[node.id] !== false;
  const grantCount = node.permissionIds.filter((permissionId) =>
    grantedSet.has(permissionId),
  ).length;
  const denyCount = node.permissionIds.filter((permissionId) =>
    deniedSet.has(permissionId),
  ).length;

  return (
    <div className="relative">
      <div className="relative flex flex-wrap items-center gap-2 py-1.5">
        <span
          aria-hidden
          className="absolute left-2 top-5 h-0 w-3 border-t border-dashed border-border"
        />
        <button
          type="button"
          onClick={() =>
            setOpen((current) => ({
              ...current,
              [node.id]: !(current[node.id] !== false),
            }))
          }
          className="grid h-5 w-5 place-items-center rounded-sm text-muted-foreground transition hover:bg-accent"
          aria-label={`Toggle ${node.label}`}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-90",
            )}
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{node.label}</div>
          <div className="text-[11px] text-muted-foreground">
            {grantCount > 0 ? `+${grantCount}` : "+0"} /{" "}
            {denyCount > 0 ? `-${denyCount}` : "-0"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onApplyMode(node.permissionIds, "inherit")}
          >
            {clearLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-700"
            onClick={() => onApplyMode(node.permissionIds, "grant")}
          >
            {grantLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-rose-200 text-rose-700"
            onClick={() => onApplyMode(node.permissionIds, "deny")}
          >
            {denyLabel}
          </Button>
        </div>
      </div>

      {isExpanded ? (
        <div className="ml-5 border-l border-dashed border-border pl-3 pb-1">
          {node.children.length > 0 ? (
            <div className="space-y-0.5">
              {node.children.map((child) => (
                <OverrideBranch
                  key={child.id}
                  node={child}
                  open={open}
                  setOpen={setOpen}
                  forceExpanded={forceExpanded}
                  inheritedSet={inheritedSet}
                  grantedSet={grantedSet}
                  deniedSet={deniedSet}
                  inheritedLabel={inheritedLabel}
                  grantLabel={grantLabel}
                  denyLabel={denyLabel}
                  clearLabel={clearLabel}
                  onApplyMode={onApplyMode}
                />
              ))}
            </div>
          ) : null}

          {node.permissions.length > 0 ? (
            <div className="space-y-0.5">
              {node.permissions.map((permission) => {
                const mode: OverrideMode = deniedSet.has(permission.id)
                  ? "deny"
                  : grantedSet.has(permission.id)
                    ? "grant"
                    : "inherit";

                return (
                  <div
                    key={permission.id}
                    className="relative rounded-md px-2 py-1.5 hover:bg-accent/40"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-5 h-0 w-3 border-t border-dashed border-border"
                    />
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">
                          {toPermissionDisplayName(permission)}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {permission.name}
                        </div>
                        {permission.description ? (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {permission.description}
                          </div>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {mode === "inherit" &&
                          inheritedSet.has(permission.id) ? (
                            <Badge variant="secondary">{inheritedLabel}</Badge>
                          ) : null}
                          {mode === "grant" ? (
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                              {grantLabel}
                            </Badge>
                          ) : null}
                          {mode === "deny" ? (
                            <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                              {denyLabel}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={mode === "inherit" ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            onApplyMode([permission.id], "inherit")
                          }
                        >
                          {clearLabel}
                        </Button>
                        <Button
                          type="button"
                          variant={mode === "grant" ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            mode === "grant" &&
                              "bg-emerald-600 text-white hover:bg-emerald-700",
                            mode !== "grant" &&
                              "border-emerald-200 text-emerald-700",
                          )}
                          onClick={() => onApplyMode([permission.id], "grant")}
                        >
                          {grantLabel}
                        </Button>
                        <Button
                          type="button"
                          variant={mode === "deny" ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            mode === "deny" &&
                              "bg-rose-600 text-white hover:bg-rose-700",
                            mode !== "deny" && "border-rose-200 text-rose-700",
                          )}
                          onClick={() => onApplyMode([permission.id], "deny")}
                        >
                          {denyLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function flattenNodeIds(nodes: PermissionTreeNode[]) {
  return nodes.flatMap((node) => [node.id, ...flattenNodeIds(node.children)]);
}
