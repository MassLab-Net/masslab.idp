import {
  PermissionTree,
  type PermissionOverrideLabels,
  type PermissionOverrideState,
  type PermissionTreeItem,
} from "@/components/permission-tree";

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
  grantLabel?: string;
  denyLabel?: string;
};

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
  grantLabel = "Grant",
  denyLabel = "Deny",
}: Props) {
  const overrides: PermissionOverrideState = {
    inheritedIds,
    grantedIds,
    deniedIds,
  };
  const overrideLabels: PermissionOverrideLabels = {
    grantLabel,
    denyLabel,
  };

  return (
    <PermissionTree
      permissions={permissions}
      overrides={overrides}
      onOverrideChange={(value) =>
        onChange({
          grantedIds: value.grantedIds,
          deniedIds: value.deniedIds,
        })
      }
      overrideLabels={overrideLabels}
      rootLabel={rootLabel}
      rootDescription={rootDescription}
      searchPlaceholder={searchPlaceholder}
      expandAllLabel={expandAllLabel}
      collapseAllLabel={collapseAllLabel}
      emptyLabel={emptyLabel}
    />
  );
}
