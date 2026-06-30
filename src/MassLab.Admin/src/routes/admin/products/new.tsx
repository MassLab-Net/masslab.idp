import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ProductForm, type ProductFormData } from "./-product-form";
import { createProduct } from "@/lib/product-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "New Product — MassLab IAM" }] }),
  component: NewProductPage,
});

const EMPTY: ProductFormData = {
  sku: "",
  category: "Software",
  status: "Draft",
  price: 0,
  currency: "USD",
  stock: 0,
  tags: [],
  translations: {
    en: {
      name: "",
      description: "",
    },
    vi: {
      name: "",
      description: "",
    },
  },
};

function NewProductPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(data: ProductFormData) {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    createProduct(data);
    setSaving(false);
    toast.success(t("products.created"));
    navigate({ to: "/admin/products" });
  }

  return (
    <ProductForm
      initial={EMPTY}
      onSubmit={handleSubmit}
      isSaving={saving}
      title={t("products.newTitle")}
    />
  );
}
