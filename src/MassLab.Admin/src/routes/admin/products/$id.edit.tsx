import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProductForm, type ProductFormData } from "./-product-form";
import { getProductById, getProductTitle, updateProduct } from "@/lib/product-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Product — MassLab IAM" }] }),
  component: EditProductPage,
});

function EditProductPage() {
  const { t, lang } = useI18n();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const product = getProductById(id);
  const initial = useMemo<ProductFormData | null>(
    () =>
      product
        ? {
            sku: product.sku,
            category: product.category,
            status: product.status,
            price: product.price,
            currency: product.currency,
            stock: product.stock,
            tags: [...product.tags],
            translations: {
              en: {
                name: product.translations.en.name,
                description: product.translations.en.description,
              },
              vi: {
                name: product.translations.vi.name,
                description: product.translations.vi.description,
              },
            },
          }
        : null,
    [product],
  );

  if (!product || !initial) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-4xl font-bold text-gradient-brand">404</div>
        <div className="text-lg font-semibold">{t("products.notFound")}</div>
        <p className="text-sm text-muted-foreground">{t("products.notFoundDesc")}</p>
      </div>
    );
  }

  async function handleSubmit(_data: ProductFormData) {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateProduct(id, _data);
    setSaving(false);
    toast.success(t("products.updated"));
    navigate({ to: "/admin/products" });
  }

  return (
    <ProductForm
      initial={initial}
      onSubmit={handleSubmit}
      isSaving={saving}
      title={`${t("products.editTitle")}: ${getProductTitle(product, lang)}`}
    />
  );
}
