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

type Props = {
  permissions: PermissionTreeItem[];
  selected: string[];
  onChange: (next: string[]) => void;
  rootLabel?: string;
  rootDescription?: string;
  searchPlaceholder?: string;
  selectedLabel?: string;
  expandAllLabel?: string;
  collapseAllLabel?: string;
  emptyLabel?: string;
  readOnly?: boolean;
};

const CATEGORY_SPLITTER = /\s*(?:\/|>|:|\\|\|)\s*|\./;

export function PermissionTree({
  permissions,
  selected,
  onChange,
  rootLabel = "Permissions",
  rootDescription,
  searchPlaceholder = "Search permissions...",
  selectedLabel = "selected",
  expandAllLabel = "Expand all",
  collapseAllLabel = "Collapse all",
  emptyLabel = "No permissions found.",
  readOnly,
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
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const allNodeIds = useMemo(() => flattenNodeIds(tree), [tree]);

  const setAllExpanded = (isExpanded: boolean) => {
    setOpen(Object.fromEntries(allNodeIds.map((id) => [id, isExpanded])));
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    if (readOnly) {
      return;
    }

    const next = new Set(selected);
    if (checked) {
      next.add(permissionId);
    } else {
      next.delete(permissionId);
    }

    onChange(Array.from(next));
  };

  const toggleNode = (permissionIds: string[], checked: boolean) => {
    if (readOnly) {
      return;
    }

    const next = new Set(selected);
    for (const permissionId of permissionIds) {
      if (checked) {
        next.add(permissionId);
      } else {
        next.delete(permissionId);
      }
    }

    onChange(Array.from(next));
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
            {selected.length} {selectedLabel}
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
                R
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
                selectedSet={selectedSet}
                readOnly={readOnly}
                forceExpanded={!!normalizedQuery}
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

  const descendants = [...node.children, ...node.permissions];

  return (
    <div className="relative">
      <div className="relative flex items-center gap-2 py-1.5">
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

                return (
                  <label
                    key={permission.id}
                    className={cn(
                      "relative flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 transition hover:bg-accent/40",
                      readOnly && "cursor-default",
                    )}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-5 h-0 w-3 border-t border-dashed border-border"
                    />
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        onTogglePermission(permission.id, value === true)
                      }
                      disabled={readOnly}
                    />
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
                    </div>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
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

function flattenNodeIds(nodes: PermissionTreeNode[]) {
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
