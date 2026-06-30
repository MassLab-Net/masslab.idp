import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Clock3, CircleDollarSign, MoreHorizontal, ShoppingCart, SlidersHorizontal, Truck, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { initials } from "@/components/app-sidebar";
import { PageHeader } from "../tenant/organizations";
import { StatusPill } from "@/components/status-pill";
import { useOrders, type Order } from "@/lib/order-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({ meta: [{ title: "Orders — MassLab IAM" }] }),
  component: OrdersPage,
});

type SortKey = "number" | "customerName" | "total" | "createdAt";
type SortDir = "asc" | "desc";

function statusVariant(status: string) {
  const v = status.toLowerCase();
  if (v === "delivered" || v === "paid" || v === "fulfilled") return "success" as const;
  if (v === "processing" || v === "shipped" || v === "partial") return "info" as const;
  if (v === "pending" || v === "unfulfilled") return "warning" as const;
  if (v === "cancelled" || v === "failed" || v === "refunded") return "danger" as const;
  return "neutral" as const;
}

const orderStatusLabelKey: Record<string, "orders.status.pending" | "orders.status.processing" | "orders.status.shipped" | "orders.status.delivered" | "orders.status.cancelled" | "orders.status.refunded"> = {
  Pending: "orders.status.pending",
  Processing: "orders.status.processing",
  Shipped: "orders.status.shipped",
  Delivered: "orders.status.delivered",
  Cancelled: "orders.status.cancelled",
  Refunded: "orders.status.refunded",
};

const paymentStatusLabelKey: Record<string, "orders.payment.pending" | "orders.payment.paid" | "orders.payment.failed" | "orders.payment.refunded"> = {
  Pending: "orders.payment.pending",
  Paid: "orders.payment.paid",
  Failed: "orders.payment.failed",
  Refunded: "orders.payment.refunded",
};

const fulfillmentStatusLabelKey: Record<string, "orders.fulfillment.unfulfilled" | "orders.fulfillment.partial" | "orders.fulfillment.fulfilled"> = {
  Unfulfilled: "orders.fulfillment.unfulfilled",
  Partial: "orders.fulfillment.partial",
  Fulfilled: "orders.fulfillment.fulfilled",
};

function compareOrders(a: Order, b: Order, key: SortKey, dir: SortDir) {
  const va = a[key];
  const vb = b[key];
  const left = typeof va === "string" ? va.toLowerCase() : va;
  const right = typeof vb === "string" ? vb.toLowerCase() : vb;
  if (left < right) return dir === "asc" ? -1 : 1;
  if (left > right) return dir === "asc" ? 1 : -1;
  return 0;
}

function OrdersPage() {
  const { t } = useI18n();
  const orders = useOrders();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const pageSize = 8;
  const activeFilters =
    (statusFilter !== "all" ? 1 : 0) + (paymentFilter !== "all" ? 1 : 0) + (fulfillmentFilter !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return [...orders]
      .filter((order) => {
        const matchesQuery =
          !query ||
          order.number.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.organization.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query));
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
        const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillmentStatus === fulfillmentFilter;
        return matchesQuery && matchesStatus && matchesPayment && matchesFulfillment;
      })
      .sort((a, b) => compareOrders(a, b, sortKey, sortDir));
  }, [orders, q, statusFilter, paymentFilter, fulfillmentFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  function resetFilters() {
    setStatusFilter("all");
    setPaymentFilter("all");
    setFulfillmentFilter("all");
    setPage(1);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function SortBtn({ col }: { col: SortKey }) {
    return (
      <button type="button" onClick={() => toggleSort(col)} className="inline-flex items-center gap-1 hover:text-foreground">
        <ArrowUpDown className={cn("h-3 w-3", sortKey === col ? "text-primary" : "text-muted-foreground")} />
      </button>
    );
  }

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: t("orders.stat.total"), value: orders.length, icon: ShoppingCart },
    { label: t("orders.stat.revenue"), value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(revenue), icon: CircleDollarSign },
    { label: t("orders.stat.pending"), value: orders.filter((o) => o.status === "Pending" || o.status === "Processing").length, icon: Clock3 },
    { label: t("orders.stat.fulfilled"), value: orders.filter((o) => o.fulfillmentStatus === "Fulfilled").length, icon: Truck },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t("orders.title")} subtitle={t("orders.subtitle")} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary">
                <stat.icon className="h-5 w-5" />
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
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={t("orders.search")}
              className="h-9 pl-9"
            />
            <ShoppingCart className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("orders.filter.statusAll")}</SelectItem>
              <SelectItem value="Pending">{t("orders.status.pending")}</SelectItem>
              <SelectItem value="Processing">{t("orders.status.processing")}</SelectItem>
              <SelectItem value="Shipped">{t("orders.status.shipped")}</SelectItem>
              <SelectItem value="Delivered">{t("orders.status.delivered")}</SelectItem>
              <SelectItem value="Cancelled">{t("orders.status.cancelled")}</SelectItem>
              <SelectItem value="Refunded">{t("orders.status.refunded")}</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-1.5 h-4 w-4" /> {t("orders.filters")}
                {activeFilters > 0 && <Badge className="ml-2 h-5 bg-gradient-brand px-1.5 text-[10px] text-primary-foreground">{activeFilters}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-semibold">{t("orders.filters")}</div>
                <button type="button" className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50" onClick={resetFilters} disabled={activeFilters === 0}>{t("common.reset")}</button>
              </div>
              <div className="space-y-4 p-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("orders.filter.payment")}</Label>
                  <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("orders.filter.paymentAll")}</SelectItem>
                      <SelectItem value="Pending">{t("orders.payment.pending")}</SelectItem>
                      <SelectItem value="Paid">{t("orders.payment.paid")}</SelectItem>
                      <SelectItem value="Failed">{t("orders.payment.failed")}</SelectItem>
                      <SelectItem value="Refunded">{t("orders.payment.refunded")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t("orders.filter.fulfillment")}</Label>
                  <Select value={fulfillmentFilter} onValueChange={(v) => { setFulfillmentFilter(v); setPage(1); }}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("orders.filter.fulfillmentAll")}</SelectItem>
                      <SelectItem value="Unfulfilled">{t("orders.fulfillment.unfulfilled")}</SelectItem>
                      <SelectItem value="Partial">{t("orders.fulfillment.partial")}</SelectItem>
                      <SelectItem value="Fulfilled">{t("orders.fulfillment.fulfilled")}</SelectItem>
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
            {filtered.length} {t("common.of")} {orders.length}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("orders.col.order")} <SortBtn col="number" /></TableHead>
              <TableHead>{t("orders.col.customer")} <SortBtn col="customerName" /></TableHead>
              <TableHead>{t("orders.col.status")}</TableHead>
              <TableHead>{t("orders.col.payment")}</TableHead>
              <TableHead>{t("orders.col.fulfillment")}</TableHead>
              <TableHead>{t("orders.col.total")} <SortBtn col="total" /></TableHead>
              <TableHead>{t("orders.col.created")} <SortBtn col="createdAt" /></TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((order) => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-accent/40">
                <TableCell>
                  <Link to="/admin/orders/$id" params={{ id: order.id }} className="font-medium">
                    {order.number}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/admin/orders/$id" params={{ id: order.id }} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                      {initials(order.customerName)}
                    </div>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell><StatusPill variant={statusVariant(order.status)}>{t(orderStatusLabelKey[order.status])}</StatusPill></TableCell>
                <TableCell><StatusPill variant={statusVariant(order.paymentStatus)}>{t(paymentStatusLabelKey[order.paymentStatus])}</StatusPill></TableCell>
                <TableCell><StatusPill variant={statusVariant(order.fulfillmentStatus)}>{t(fulfillmentStatusLabelKey[order.fulfillmentStatus])}</StatusPill></TableCell>
                <TableCell className="font-medium">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.total)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/admin/orders/$id" params={{ id: order.id }}>{t("common.edit")}</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  {t("orders.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="text-sm text-muted-foreground">
              {t("orders.page")} {page} / {totalPages}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>«</Button>
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>‹</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const number = start + index;
                if (number > totalPages) return null;
                return (
                  <Button key={number} variant={number === page ? "default" : "outline"} size="sm" className={number === page ? "bg-gradient-brand text-primary-foreground" : ""} onClick={() => setPage(number)}>
                    {number}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>›</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</Button>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
}
