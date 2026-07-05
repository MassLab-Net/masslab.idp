import type { Dispatch, SetStateAction } from "react";
import { useDeferredValue, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PermissionTreeItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export type PermissionTreeNode = {
  id: string;
  label: string;
  path: string[];
  children: PermissionTreeNode[];
  permissions: PermissionTreeItem[];
  permissionIds: string[];
};

export type PermissionOverrideState = {
  inheritedIds: string[];
  grantedIds: string[];
  deniedIds: string[];
};

export type PermissionOverrideLabels = {
  grantLabel?: string;
  denyLabel?: string;
  summaryLabel?: string;
};

type BaseProps = {
  permissions: PermissionTreeItem[];
  rootLabel?: string;
  rootDescription?: string;
  searchPlaceholder?: string;
  expandAllLabel?: string;
  collapseAllLabel?: string;
  emptyLabel?: string;
  readOnly?: boolean;
};

type SelectionProps = BaseProps & {
  selected: string[];
  onChange: (next: string[]) => void;
  selectedLabel?: string;
  overrides?: never;
  onOverrideChange?: never;
  overrideLabels?: never;
};

type OverrideProps = BaseProps & {
  selected?: never;
  onChange?: never;
  selectedLabel?: never;
  overrides: PermissionOverrideState;
  onOverrideChange: (value: PermissionOverrideState) => void;
  overrideLabels?: PermissionOverrideLabels;
};

type Props = SelectionProps | OverrideProps;

type OverrideMode = "inherit" | "grant" | "deny";

type EffectiveBranchMode = {
  kind: "selection";
  selectedLabel: string;
};

type OverrideBranchMode = {
  kind: "override";
  overrides: PermissionOverrideState;
  labels: Required<PermissionOverrideLabels>;
  onChange: (value: PermissionOverrideState) => void;
};

type TreeMode = EffectiveBranchMode | OverrideBranchMode;

const CATEGORY_SPLITTER = /\s*(?:\/|>|:|\\|\|)\s*|\./;
const DEFAULT_OVERRIDE_LABELS = {
  grantLabel: "Grant",
  denyLabel: "Deny",
  summaryLabel: "customized",
} satisfies Required<PermissionOverrideLabels>;

function isOverrideProps(props: Props): props is OverrideProps {
  return "overrides" in props;
}

export function PermissionTree(props: Props) {
  const {
    permissions,
    rootLabel = "Permissions",
    rootDescription,
    searchPlaceholder = "Search permissions...",
    expandAllLabel = "Expand all",
    collapseAllLabel = "Collapse all",
    emptyLabel = "No permissions found.",
    readOnly,
  } = props;
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

  const overrideProps = isOverrideProps(props) ? props : null;
  const selectionProps = isOverrideProps(props) ? null : props;

  const mode: TreeMode = overrideProps
    ? {
        kind: "override",
        overrides: overrideProps.overrides,
        labels: {
          ...DEFAULT_OVERRIDE_LABELS,
          ...(overrideProps.overrideLabels ?? {}),
        },
        onChange: overrideProps.onOverrideChange,
      }
    : {
        kind: "selection",
        selectedLabel: selectionProps!.selectedLabel ?? "selected",
      };

  const effectiveSelected = useMemo(
    () =>
      mode.kind === "override"
        ? getEffectivePermissionIds(mode.overrides)
        : selectionProps!.selected,
    [mode, selectionProps],
  );
  const effectiveSelectedSet = useMemo(
    () => new Set(effectiveSelected),
    [effectiveSelected],
  );

  const setAllExpanded = (isExpanded: boolean) => {
    setOpen(Object.fromEntries(allNodeIds.map((id) => [id, isExpanded])));
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    if (readOnly) {
      return;
    }

    if (mode.kind === "override") {
      mode.onChange(applyOverrideChecked(mode.overrides, [permissionId], checked));
      return;
    }

    const next = new Set(selectionProps!.selected);
    if (checked) {
      next.add(permissionId);
    } else {
      next.delete(permissionId);
    }

    selectionProps!.onChange(Array.from(next));
  };

  const toggleNode = (permissionIds: string[], checked: boolean) => {
    if (readOnly) {
      return;
    }

    if (mode.kind === "override") {
      mode.onChange(applyOverrideChecked(mode.overrides, permissionIds, checked));
      return;
    }

    const next = new Set(selectionProps!.selected);
    for (const permissionId of permissionIds) {
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
    }

    selectionProps!.onChange(Array.from(next));
  };

  const summaryValue =
      mode.kind === "override"
      ? `${mode.overrides.grantedIds.length + mode.overrides.deniedIds.length} ${mode.labels.summaryLabel}`
      : `${selectionProps!.selected.length} ${mode.selectedLabel}`;

  const rootGlyph = mode.kind === "override" ? "U" : "R";

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
            {summaryValue}
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
                {rootGlyph}
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
              <PermissionBranch
                key={node.id}
                node={node}
                open={open}
                setOpen={setOpen}
                selectedSet={effectiveSelectedSet}
                readOnly={readOnly}
                forceExpanded={!!normalizedQuery}
                mode={mode}
                onToggleNode={toggleNode}
                onTogglePermission={togglePermission}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type PermissionBranchProps = {
  node: PermissionTreeNode;
  open: Record<string, boolean>;
  setOpen: Dispatch<SetStateAction<Record<string, boolean>>>;
  selectedSet: Set<string>;
  readOnly?: boolean;
  forceExpanded: boolean;
  mode: TreeMode;
  onToggleNode: (permissionIds: string[], checked: boolean) => void;
  onTogglePermission: (permissionId: string, checked: boolean) => void;
};

function PermissionBranch({
  node,
  open,
  setOpen,
  selectedSet,
  readOnly,
  forceExpanded,
  mode,
  onToggleNode,
  onTogglePermission,
}: PermissionBranchProps) {
  const checkedCount = node.permissionIds.filter((permissionId) =>
    selectedSet.has(permissionId),
  ).length;
  const allChecked =
    checkedCount > 0 && checkedCount === node.permissionIds.length;
  const partialChecked =
    checkedCount > 0 && checkedCount < node.permissionIds.length;
  const isExpanded = forceExpanded || open[node.id] !== false;
  const hasChildren = node.children.length > 0 || node.permissions.length > 0;
  const overrideSummary =
    mode.kind === "override"
      ? summarizeOverrideState(node.permissionIds, mode.overrides)
      : null;

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
          className="grid h-5 w-5 place-items-center rounded-sm text-muted-foreground transition hover:bg-accent disabled:opacity-40"
          aria-label={`Toggle ${node.label}`}
          disabled={!hasChildren}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-90",
              !hasChildren && "opacity-0",
            )}
          />
        </button>
        <Checkbox
          checked={allChecked ? true : partialChecked ? "indeterminate" : false}
          onCheckedChange={(value) =>
            onToggleNode(node.permissionIds, value === true)
          }
          disabled={readOnly}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{node.label}</div>
          <div className="text-[11px] text-muted-foreground">
            {checkedCount}/{node.permissionIds.length}
          </div>
        </div>
        {overrideSummary && mode.kind === "override" ? (
          <div className="flex flex-wrap items-center gap-2">
            {overrideSummary.grantedCount > 0 ? (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                +{overrideSummary.grantedCount} {mode.labels.grantLabel}
              </Badge>
            ) : null}
            {overrideSummary.deniedCount > 0 ? (
              <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                -{overrideSummary.deniedCount} {mode.labels.denyLabel}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="ml-5 border-l border-dashed border-border pl-3 pb-1">
          {node.children.length > 0 ? (
            <div className="space-y-0.5">
              {node.children.map((child) => (
                <PermissionBranch
                  key={child.id}
                  node={child}
                  open={open}
                  setOpen={setOpen}
                  selectedSet={selectedSet}
                  readOnly={readOnly}
                  forceExpanded={forceExpanded}
                  mode={mode}
                  onToggleNode={onToggleNode}
                  onTogglePermission={onTogglePermission}
                />
              ))}
            </div>
          ) : null}

          {node.permissions.length > 0 ? (
            <div className="space-y-0.5">
              {node.permissions.map((permission) => {
                const checked = selectedSet.has(permission.id);
                const permissionOverrideMode =
                  mode.kind === "override"
                    ? getPermissionOverrideBadgeMode(
                        permission.id,
                        mode.overrides,
                      )
                    : null;

                return (
                  <div
                    key={permission.id}
                    className={cn(
                      "relative rounded-md px-2 py-1.5 transition hover:bg-accent/40",
                      readOnly && "hover:bg-transparent",
                    )}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-5 h-0 w-3 border-t border-dashed border-border"
                    />
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <label
                        className={cn(
                          "flex min-w-0 flex-1 cursor-pointer items-start gap-2",
                          readOnly && "cursor-default",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            onTogglePermission(permission.id, value === true)
                          }
                          disabled={readOnly}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm">
                              {toPermissionDisplayName(permission)}
                            </div>
                            {permissionOverrideMode && mode.kind === "override" ? (
                              <>
                                {permissionOverrideMode === "grant" ? (
                                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                                    {mode.labels.grantLabel}
                                  </Badge>
                                ) : null}
                                {permissionOverrideMode === "deny" ? (
                                  <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                                    {mode.labels.denyLabel}
                                  </Badge>
                                ) : null}
                              </>
                            ) : null}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {permission.name}
                          </div>
                          {permission.description ? (
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {permission.description}
                            </div>
                          ) : null}
                        </div>
                      </label>
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

function getEffectivePermissionIds(overrides: PermissionOverrideState) {
  const granted = new Set(overrides.grantedIds);
  const denied = new Set(overrides.deniedIds);
  const effective = new Set(overrides.inheritedIds);

  for (const permissionId of granted) {
    effective.add(permissionId);
  }

  for (const permissionId of denied) {
    effective.delete(permissionId);
  }

  return Array.from(effective);
}

function getPermissionOverrideBadgeMode(
  permissionId: string,
  overrides: PermissionOverrideState,
): Exclude<OverrideMode, "inherit"> | null {
  if (overrides.deniedIds.includes(permissionId)) {
    return "deny";
  }

  if (overrides.grantedIds.includes(permissionId)) {
    return "grant";
  }

  return null;
}

function applyOverrideChecked(
  overrides: PermissionOverrideState,
  permissionIds: string[],
  checked: boolean,
): PermissionOverrideState {
  const inheritedSet = new Set(overrides.inheritedIds);
  const nextGranted = new Set(overrides.grantedIds);
  const nextDenied = new Set(overrides.deniedIds);

  for (const permissionId of permissionIds) {
    nextGranted.delete(permissionId);
    nextDenied.delete(permissionId);

    if (checked) {
      if (!inheritedSet.has(permissionId)) {
        nextGranted.add(permissionId);
      }
    } else if (inheritedSet.has(permissionId)) {
      nextDenied.add(permissionId);
    }
  }

  return {
    inheritedIds: overrides.inheritedIds,
    grantedIds: Array.from(nextGranted),
    deniedIds: Array.from(nextDenied),
  };
}

function summarizeOverrideState(
  permissionIds: string[],
  overrides: PermissionOverrideState,
) {
  const grantedSet = new Set(overrides.grantedIds);
  const deniedSet = new Set(overrides.deniedIds);
  let grantedCount = 0;
  let deniedCount = 0;

  for (const permissionId of permissionIds) {
    if (deniedSet.has(permissionId)) {
      deniedCount += 1;
      continue;
    }

    if (grantedSet.has(permissionId)) {
      grantedCount += 1;
    }
  }

  return { grantedCount, deniedCount };
}

export function buildPermissionTree(
  permissions: PermissionTreeItem[],
): PermissionTreeNode[] {
  const roots = new Map<string, MutablePermissionTreeNode>();

  for (const permission of permissions) {
    const segments = splitCategory(permission.category);
    let currentMap = roots;
    let currentNode: MutablePermissionTreeNode | undefined;
    const path: string[] = [];

    for (const segment of segments) {
      path.push(segment);
      const key = path.join("/");
      let nextNode = currentMap.get(key);

      if (!nextNode) {
        nextNode = {
          id: key,
          label: segment,
          path: [...path],
          children: new Map(),
          permissions: [],
        };
        currentMap.set(key, nextNode);
      }

      currentNode = nextNode;
      currentMap = nextNode.children;
    }

    if (!currentNode) {
      continue;
    }

    currentNode.permissions.push(permission);
  }

  return Array.from(roots.values()).map(finalizeNode).sort(compareTreeNodes);
}

type MutablePermissionTreeNode = {
  id: string;
  label: string;
  path: string[];
  children: Map<string, MutablePermissionTreeNode>;
  permissions: PermissionTreeItem[];
};

function finalizeNode(node: MutablePermissionTreeNode): PermissionTreeNode {
  const children = Array.from(node.children.values())
    .map(finalizeNode)
    .sort(compareTreeNodes);
  const permissions = [...node.permissions].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const permissionIds = [
    ...permissions.map((permission) => permission.id),
    ...children.flatMap((child) => child.permissionIds),
  ];

  return {
    id: node.id,
    label: node.label,
    path: node.path,
    children,
    permissions,
    permissionIds,
  };
}

function compareTreeNodes(left: PermissionTreeNode, right: PermissionTreeNode) {
  return left.label.localeCompare(right.label);
}

function flattenNodeIds(nodes: PermissionTreeNode[]): string[] {
  return nodes.flatMap((node) => [node.id, ...flattenNodeIds(node.children)]);
}

export function splitCategory(category: string) {
  const parts = category
    .split(CATEGORY_SPLITTER)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : ["Ungrouped"];
}

export function toPermissionDisplayName(permission: PermissionTreeItem) {
  const categoryPath = splitCategory(permission.category).join(".");
  if (permission.name.startsWith(`${categoryPath}.`)) {
    return permission.name.slice(categoryPath.length + 1);
  }

  return permission.name;
}
