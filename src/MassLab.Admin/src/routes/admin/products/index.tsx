import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, MoreHorizontal, Package, Plus, Search, SlidersHorizontal, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

import { type Product, type ProductStatus } from "@/lib/mock-data";
import { deleteProduct, getProductDescription, getProductTitle, useProducts } from "@/lib/product-store";
import { StatusPill } from "@/components/status-pill";
import { PageHeader } from "../tenant/organizations";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({ meta: [{ title: "Products — MassLab IAM" }] }),
  component: ProductsPage,
});

type SortKey = "name" | "price" | "stock" | "createdAt";
type SortDir = "asc" | "desc";

function productStatusVariant(status: ProductStatus) {
  if (status === "Active") return "success" as const;
  if (status === "Draft") return "warning" as const;
  return "neutral" as const;
}

function compareProducts(a: Product, b: Product, key: SortKey, dir: SortDir, lang: "en" | "vi") {
  const va = key === "name" ? getProductTitle(a, lang) : a[key];
  const vb = key === "name" ? getProductTitle(b, lang) : b[key];
  const left = typeof va === "string" ? va.toLowerCase() : va;
  const right = typeof vb === "string" ? vb.toLowerCase() : vb;

  if (left < right) return dir === "asc" ? -1 : 1;
  if (left > right) return dir === "asc" ? 1 : -1;
  return 0;
}

function ProductsPage() {
  const { t, lang } = useI18n();
  const products = useProducts();

  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const pageSize = 8;
  const activeFilters = (categoryFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return [...products]
      .filter((product) => {
        const matchesQuery =
          !query ||
          product.translations.en.name.toLowerCase().includes(query) ||
          product.translations.vi.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.includes(query)) ||
          product.translations.en.description.toLowerCase().includes(query) ||
          product.translations.vi.description.toLowerCase().includes(query);
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => compareProducts(a, b, sortKey, sortDir, lang));
  }, [products, q, categoryFilter, statusFilter, sortKey, sortDir, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  function resetFilters() {
    setCategoryFilter("all");
    setStatusFilter("all");
    setPage(1);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function SortBtn({ col }: { col: SortKey }) {
    return (
      <button type="button" onClick={() => toggleSort(col)} className="inline-flex items-center gap-1 hover:text-foreground">
        <ArrowUpDown className={`h-3 w-3 ${sortKey === col ? "text-primary" : "text-muted-foreground"}`} />
      </button>
    );
  }

  const stats = [
    { label: t("products.statTotal"), value: products.length },
    { label: t("products.statActive"), value: products.filter((product) => product.status === "Active").length },
    { label: t("products.statDraft"), value: products.filter((product) => product.status === "Draft").length },
    { label: t("products.statArchived"), value: products.filter((product) => product.status === "Archived").length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products.title")}
        subtitle={t("products.subtitle")}
        action={
          <Button asChild className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
            <Link to="/admin/products/new">
              <Plus className="mr-1.5 h-4 w-4" /> {t("products.new")}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={t("products.search")}
              className="h-9 pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("products.filterAllStatus")}</SelectItem>
              <SelectItem value="Active">{t("products.statusActive")}</SelectItem>
              <SelectItem value="Draft">{t("products.statusDraft")}</SelectItem>
              <SelectItem value="Archived">{t("products.statusArchived")}</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-1.5 h-4 w-4" /> {t("products.filters")}
                {activeFilters > 0 && (
                  <Badge className="ml-2 h-5 bg-gradient-brand px-1.5 text-[10px] text-primary-foreground">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-semibold">{t("products.filters")}</div>
                <button
                  type="button"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                  onClick={resetFilters}
                  disabled={activeFilters === 0}
                >
                  {t("common.reset")}
                </button>
              </div>
              <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("products.category")}</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                      setCategoryFilter(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("common.all")}</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={resetFilters}>
              <X className="mr-1 h-3.5 w-3.5" /> {t("common.reset")}
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground">
            {filtered.length} {t("common.of")} {products.length}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t("products.colName")} <SortBtn col="name" />
              </TableHead>
              <TableHead>{t("products.colSku")}</TableHead>
              <TableHead>{t("products.colCategory")}</TableHead>
              <TableHead>{t("products.colStatus")}</TableHead>
              <TableHead>
                {t("products.colPrice")} <SortBtn col="price" />
              </TableHead>
              <TableHead>
                {t("products.colStock")} <SortBtn col="stock" />
              </TableHead>
              <TableHead>
                {t("products.colCreated")} <SortBtn col="createdAt" />
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((product) => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-accent/40">
                <TableCell>
                  <Link to="/admin/products/$id/edit" params={{ id: product.id }} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand-soft text-primary">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{getProductTitle(product, lang)}</div>
                      <div className="text-xs text-muted-foreground">{getProductDescription(product, lang)}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <code className="text-xs text-muted-foreground">{product.sku}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusPill variant={productStatusVariant(product.status)}>{product.status}</StatusPill>
                </TableCell>
                <TableCell className="font-medium">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(product.price)}
                </TableCell>
                <TableCell>
                  <span className={product.stock === 0 ? "font-medium text-destructive" : product.stock < 20 ? "font-medium text-warning" : ""}>
                    {product.stock === 0 ? t("products.outOfStock") : product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.createdAt}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/admin/products/$id/edit" params={{ id: product.id }}>
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(product)}>
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  {t("products.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="text-sm text-muted-foreground">
              {t("products.page")} {page} / {totalPages}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>
                «
              </Button>
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                ‹
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const number = start + index;
                if (number > totalPages) return null;
                return (
                  <Button
                    key={number}
                    variant={number === page ? "default" : "outline"}
                    size="sm"
                    className={number === page ? "bg-gradient-brand text-primary-foreground" : ""}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
                ›
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                »
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("products.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("products.deleteDesc")}{" "}
              <span className="font-medium text-foreground">
                {deleteTarget ? getProductTitle(deleteTarget, lang) : ""}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) return;
                deleteProduct(deleteTarget.id);
                toast.success(t("products.deleted"));
                setDeleteTarget(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
