import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MoreHorizontal, Plus, Search, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { StatusPill, statusVariant } from "@/components/status-pill";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  identityFetch,
  type ClientApplicationDto,
  type CreateClientResult,
  type CommandResult,
} from "@/lib/identity-api";

export const Route = createFileRoute("/admin/access-control/clients")({
  head: () => ({ meta: [{ title: "Clients — MassLab IAM" }] }),
  component: ClientsPage,
});

type ClientEditorState = {
  id?: string;
  name: string;
  clientId: string;
  type: string;
  redirectUris: string[];
  postLogoutRedirectUris: string[];
  scopes: string;
  flows: string;
  enabled: boolean;
};

function ClientsPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [q, setQ] = useState("");
  const [clients, setClients] = useState<ClientApplicationDto[]>([]);
  const [editing, setEditing] = useState<ClientEditorState | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientApplicationDto | null>(null);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [busyClientId, setBusyClientId] = useState<string | null>(null);

  const [newRedirectUri, setNewRedirectUri] = useState("");
  const [newPostLogoutUri, setNewPostLogoutUri] = useState("");

  const refreshClients = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await loadClients(session, setClients);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshClients();
  }, [session]);

  const openCreateDialog = () => {
    setEditing({
      name: "",
      clientId: "",
      type: "Spa",
      redirectUris: [],
      postLogoutRedirectUris: [],
      scopes: "openid profile email",
      flows: "authorization_code refresh_token",
      enabled: true,
    });
    setNewRedirectUri("");
    setNewPostLogoutUri("");
  };

  const openEditDialog = (client: ClientApplicationDto) => {
    setEditing({
      id: client.id,
      name: client.name,
      clientId: client.clientId,
      type: client.type,
      redirectUris: [...client.redirectUris],
      postLogoutRedirectUris: [...client.postLogoutRedirectUris],
      scopes: client.allowedScopes,
      flows: client.allowedFlows,
      enabled: client.enabled,
    });
    setNewRedirectUri("");
    setNewPostLogoutUri("");
  };

  const addRedirectUri = () => {
    if (!editing || !newRedirectUri.trim()) return;
    if (editing.redirectUris.includes(newRedirectUri.trim())) {
      toast.error("URI already exists");
      return;
    }
    setEditing({
      ...editing,
      redirectUris: [...editing.redirectUris, newRedirectUri.trim()],
    });
    setNewRedirectUri("");
  };

  const removeRedirectUri = (index: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      redirectUris: editing.redirectUris.filter((_, i) => i !== index),
    });
  };

  const addPostLogoutUri = () => {
    if (!editing || !newPostLogoutUri.trim()) return;
    if (editing.postLogoutRedirectUris.includes(newPostLogoutUri.trim())) {
      toast.error("URI already exists");
      return;
    }
    setEditing({
      ...editing,
      postLogoutRedirectUris: [...editing.postLogoutRedirectUris, newPostLogoutUri.trim()],
    });
    setNewPostLogoutUri("");
  };

  const removePostLogoutUri = (index: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      postLogoutRedirectUris: editing.postLogoutRedirectUris.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!session || !editing) return;

    if (!editing.name.trim() || !editing.clientId.trim()) {
      toast.error("Name and Client ID are required");
      return;
    }

    setIsSaving(true);
    try {
      if (editing.id) {
        const result = await identityFetch<CommandResult>(
          session,
          `/api/admin/tenant/clients/${editing.id}/edit`,
          {
            method: "POST",
            body: JSON.stringify({
              name: editing.name,
              type: editing.type,
              redirectUris: editing.redirectUris,
              postLogoutRedirectUris: editing.postLogoutRedirectUris,
              scopes: editing.scopes,
              flows: editing.flows,
              enabled: editing.enabled,
            }),
          }
        );

        if (result.succeeded) {
          toast.success("Client updated successfully");
          setEditing(null);
          await refreshClients();
        } else {
          toast.error(result.errors?.[0] ?? "Failed to update client");
        }
      } else {
        const result = await identityFetch<CreateClientResult>(
          session,
          "/api/admin/tenant/clients",
          {
            method: "POST",
            body: JSON.stringify({
              name: editing.name,
              clientId: editing.clientId,
              type: editing.type,
              redirectUris: editing.redirectUris,
              postLogoutRedirectUris: editing.postLogoutRedirectUris,
              scopes: editing.scopes,
              flows: editing.flows,
            }),
          }
        );

        if (result.succeeded) {
          toast.success("Client created successfully");
          if (result.clientSecret) {
            setCreatedSecret(result.clientSecret);
          }
          setEditing(null);
          await refreshClients();
        } else {
          toast.error(result.errors?.[0] ?? "Failed to create client");
        }
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session || !deletingClient) return;

    setBusyClientId(deletingClient.id);
    try {
      const result = await identityFetch<CommandResult>(
        session,
        `/api/admin/tenant/clients/${deletingClient.id}/delete`,
        { method: "POST" }
      );

      if (result.succeeded) {
        toast.success("Client deleted successfully");
        setDeletingClient(null);
        await refreshClients();
      } else {
        toast.error(result.errors?.[0] ?? "Failed to delete client");
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setBusyClientId(null);
    }
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.clientId.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader title={t("nav.clients")} description="Manage OAuth/OIDC clients" />

      <div className="container mx-auto px-6 pb-6">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Client
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <p>No clients found</p>
              {q && <p className="text-sm">Try adjusting your search</p>}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <code className="text-xs">{client.clientId}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{client.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        variant={statusVariant(
                          client.enabled ? "Active" : "Disabled"
                        )}
                      >
                        {client.enabled ? "Active" : "Disabled"}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.allowedScopes}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(client)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingClient(client)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Client" : "Create Client"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editing?.name ?? ""}
                  onChange={(e) => setEditing((s) => s && { ...s, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={editing?.clientId ?? ""}
                  onChange={(e) =>
                    setEditing((s) => s && { ...s, clientId: e.target.value })
                  }
                  disabled={!!editing?.id}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editing?.type ?? "Spa"}
                  onValueChange={(value) => setEditing((s) => s && { ...s, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spa">SPA (Public)</SelectItem>
                    <SelectItem value="Web">Web (Confidential)</SelectItem>
                    <SelectItem value="Service">Service (M2M)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editing?.id && (
                <div className="space-y-2">
                  <Label htmlFor="enabled">Status</Label>
                  <Select
                    value={editing.enabled ? "enabled" : "disabled"}
                    onValueChange={(value) =>
                      setEditing((s) => s && { ...s, enabled: value === "enabled" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Redirect URIs</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/callback"
                  value={newRedirectUri}
                  onChange={(e) => setNewRedirectUri(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRedirectUri();
                    }
                  }}
                />
                <Button type="button" onClick={addRedirectUri} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {editing && editing.redirectUris.length > 0 && (
                <div className="space-y-1 mt-2">
                  {editing.redirectUris.map((uri, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2"
                    >
                      <code className="flex-1 text-sm">{uri}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeRedirectUri(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Post Logout Redirect URIs</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/logout"
                  value={newPostLogoutUri}
                  onChange={(e) => setNewPostLogoutUri(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPostLogoutUri();
                    }
                  }}
                />
                <Button type="button" onClick={addPostLogoutUri} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {editing && editing.postLogoutRedirectUris.length > 0 && (
                <div className="space-y-1 mt-2">
                  {editing.postLogoutRedirectUris.map((uri, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2"
                    >
                      <code className="flex-1 text-sm">{uri}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removePostLogoutUri(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scopes">Scopes</Label>
              <Input
                id="scopes"
                placeholder="openid profile email"
                value={editing?.scopes ?? ""}
                onChange={(e) => setEditing((s) => s && { ...s, scopes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flows">Flows</Label>
              <Input
                id="flows"
                placeholder="authorization_code refresh_token"
                value={editing?.flows ?? ""}
                onChange={(e) => setEditing((s) => s && { ...s, flows: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!createdSecret} onOpenChange={(open) => !open && setCreatedSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Secret</DialogTitle>
            <DialogDescription>
              Save this secret now. It will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Client Secret</Label>
            <div className="rounded-md bg-muted p-3">
              <code className="text-sm break-all">{createdSecret}</code>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(createdSecret ?? "");
                toast.success("Copied to clipboard");
              }}
            >
              Copy Secret
            </Button>
            <Button variant="outline" onClick={() => setCreatedSecret(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingClient}
        onOpenChange={(open) => !open && setDeletingClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingClient?.name}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!busyClientId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!busyClientId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {busyClientId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

async function loadClients(
  session: any,
  setClients: (clients: ClientApplicationDto[]) => void
) {
  const result = await identityFetch<ClientApplicationDto[]>(
    session,
    "/api/admin/tenant/clients"
  );
  setClients(result);
}
