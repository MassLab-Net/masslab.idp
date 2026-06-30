import { Link } from "@tanstack/react-router";
import { ArrowLeft, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type ProductCategory, type ProductStatus } from "@/lib/mock-data";
import { type ProductDraft } from "@/lib/product-store";
import { useI18n } from "@/lib/i18n";

export type ProductFormData = ProductDraft;

export function ProductForm({
  initial,
  onSubmit,
  isSaving,
  title,
  backTo = "/admin/products/",
}: {
  initial: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isSaving: boolean;
  title: string;
  backTo?: string;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState<ProductFormData>(initial);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const locales: Array<keyof ProductDraft["translations"]> = ["en", "vi"];

  useEffect(() => {
    setForm(initial);
    setTagInput("");
    setErrors({});
  }, [initial]);

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function setTranslation<L extends keyof ProductDraft["translations"], K extends keyof ProductDraft["translations"][L]>(
    lang: L,
    key: K,
    value: ProductDraft["translations"][L][K],
  ) {
    setForm((f) => ({
      ...f,
      translations: {
        ...f.translations,
        [lang]: {
          ...f.translations[lang],
          [key]: value,
        },
      },
    }));
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || form.tags.includes(tag)) {
      setTagInput("");
      return;
    }
    set("tags", [...form.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", form.tags.filter((t) => t !== tag));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.sku.trim()) errs.sku = t("products.errSku");
    if (form.price < 0) errs.price = t("products.errPrice");
    if (form.stock < 0) errs.stock = t("products.errStock");
    const hasMissingName = locales.some((lang) => !form.translations[lang].name.trim());
    if (hasMissingName) errs.translations = t("products.errName");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to={backTo}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("products.formSubtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{t("products.sectionBasic")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="sku">
                      {t("products.colSku")} <span className="text-destructive">*</span>
                    </Label>
                    <Input id="sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="ML-01001" />
                    {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("products.category")}</Label>
                    <Select value={form.category} onValueChange={(v) => set("category", v as ProductCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t("products.localization")}</Label>
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                    </TabsList>
                    {locales.map((lang) => (
                      <TabsContent key={lang} value={lang} className="mt-4 space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor={`name-${lang}`}>
                            {t("products.colName")} ({lang.toUpperCase()}) <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`name-${lang}`}
                            value={form.translations[lang].name}
                            onChange={(e) => setTranslation(lang, "name", e.target.value)}
                            placeholder={lang === "en" ? "IAM Enterprise Suite" : "Bộ IAM doanh nghiệp"}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`description-${lang}`}>{t("products.description")} ({lang.toUpperCase()})</Label>
                          <Textarea
                            id={`description-${lang}`}
                            rows={3}
                            value={form.translations[lang].description}
                            onChange={(e) => setTranslation(lang, "description", e.target.value)}
                            placeholder={t("products.descriptionPlaceholder")}
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  {errors.translations && <p className="text-xs text-destructive">{errors.translations}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{t("products.sectionPricing")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="price">
                    {t("products.price")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.price}
                      onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                      className="pl-7"
                    />
                  </div>
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>{t("products.currency")}</Label>
                  <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="VND">VND</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{t("products.sectionTags")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder={t("products.tagPlaceholder")}
                      className="pl-9"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={addTag}>
                    {t("products.addTag")}
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1.5 pr-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="rounded hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{t("products.sectionStatus")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{t("products.colStatus")}</Label>
                  <Select value={form.status} onValueChange={(v) => set("status", v as ProductStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">{t("products.statusActive")}</SelectItem>
                      <SelectItem value="Draft">{t("products.statusDraft")}</SelectItem>
                      <SelectItem value="Archived">{t("products.statusArchived")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label htmlFor="stock">{t("products.colStock")}</Label>
                  <Input id="stock" type="number" min={0} value={form.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} />
                  {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSaving} className="bg-gradient-brand text-primary-foreground shadow-elegant hover:opacity-95">
                {isSaving ? t("products.saving") : t("products.save")}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to={backTo}>{t("common.cancel")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
