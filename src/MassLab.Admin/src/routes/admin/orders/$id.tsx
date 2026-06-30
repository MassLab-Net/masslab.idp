import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { StatusPill } from "@/components/status-pill";
import { PageHeader } from "../tenant/organizations";
import { getOrderById, updateOrder, type OrderDraft } from "@/lib/order-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/orders/$id")({
  head: () => ({ meta: [{ title: "Order — MassLab IAM" }] }),
  component: OrderDetailPage,
});

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

function OrderDetailPage() {
  const { t } = useI18n();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const order = getOrderById(id);
  const draft = useMemo<OrderDraft | null>(() => {
    if (!order) return null;
    return {
      number: order.number,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      organization: order.organization,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      currency: order.currency,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      notes: order.notes,
    };
  }, [order]);

  const [form, setForm] = useState<OrderDraft | null>(draft);

  useEffect(() => {
    setForm(draft);
  }, [draft]);

  if (!order || !form) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-4xl font-bold text-gradient-brand">404</div>
        <div className="text-lg font-semibold">{t("orders.notFound")}</div>
        <p className="text-sm text-muted-foreground">{t("orders.notFoundDesc")}</p>
      </div>
    );
  }

  function set<K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function saveChanges() {
    if (!form) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateOrder(id, form);
    setSaving(false);
    toast.success(t("orders.updated"));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("orders.detailTitle")} ${order.number}`}
        subtitle={t("orders.detailSubtitle")}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/orders">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> {t("common.cancel")}
              </Link>
            </Button>
            <Button onClick={saveChanges} disabled={saving} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
              {saving ? t("products.saving") : t("common.save")}
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("orders.status.label"), value: t(orderStatusLabelKey[order.status]), variant: statusVariant(order.status) },
          { label: t("orders.payment.label"), value: t(paymentStatusLabelKey[order.paymentStatus]), variant: statusVariant(order.paymentStatus) },
          { label: t("orders.fulfillment.label"), value: t(fulfillmentStatusLabelKey[order.fulfillmentStatus]), variant: statusVariant(order.fulfillmentStatus) },
          { label: t("orders.col.total"), value: new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency }).format(order.total), variant: "neutral" as const },
        ].map((item) => (
          <Card key={item.label} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="mt-2">
                <StatusPill variant={item.variant}>{item.value}</StatusPill>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border shadow-card">
            <CardHeader><CardTitle className="text-base">{t("orders.sectionCustomer")}</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t("orders.customerName")}</Label>
                <Input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t("orders.customerEmail")}</Label>
                <Input value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>{t("orders.organization")}</Label>
                <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4 text-primary" /> {t("orders.sectionItems")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orders.item.product")}</TableHead>
                    <TableHead>{t("orders.item.qty")}</TableHead>
                    <TableHead>{t("orders.item.price")}</TableHead>
                    <TableHead>{t("orders.item.total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <code className="text-xs text-muted-foreground">{item.productId}</code>
                      </TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(item.price)}</TableCell>
                      <TableCell>{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(item.qty * item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader><CardTitle className="text-base">{t("orders.sectionStatus")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t("orders.status.label")}</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v as OrderDraft["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">{t("orders.status.pending")}</SelectItem>
                    <SelectItem value="Processing">{t("orders.status.processing")}</SelectItem>
                    <SelectItem value="Shipped">{t("orders.status.shipped")}</SelectItem>
                    <SelectItem value="Delivered">{t("orders.status.delivered")}</SelectItem>
                    <SelectItem value="Cancelled">{t("orders.status.cancelled")}</SelectItem>
                    <SelectItem value="Refunded">{t("orders.status.refunded")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t("orders.payment.label")}</Label>
                <Select value={form.paymentStatus} onValueChange={(v) => set("paymentStatus", v as OrderDraft["paymentStatus"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">{t("orders.payment.pending")}</SelectItem>
                    <SelectItem value="Paid">{t("orders.payment.paid")}</SelectItem>
                    <SelectItem value="Failed">{t("orders.payment.failed")}</SelectItem>
                    <SelectItem value="Refunded">{t("orders.payment.refunded")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t("orders.fulfillment.label")}</Label>
                <Select value={form.fulfillmentStatus} onValueChange={(v) => set("fulfillmentStatus", v as OrderDraft["fulfillmentStatus"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unfulfilled">{t("orders.fulfillment.unfulfilled")}</SelectItem>
                    <SelectItem value="Partial">{t("orders.fulfillment.partial")}</SelectItem>
                    <SelectItem value="Fulfilled">{t("orders.fulfillment.fulfilled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader><CardTitle className="text-base">{t("orders.sectionSummary")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("orders.subtotal")}</span>
                <span className="font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(form.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("orders.shipping")}</span>
                <span className="font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(form.shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("orders.tax")}</span>
                <span className="font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(form.tax)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>{t("orders.total")}</span>
                <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: form.currency }).format(form.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader><CardTitle className="text-base">{t("orders.sectionNotes")}</CardTitle></CardHeader>
            <CardContent>
              <Textarea rows={5} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
