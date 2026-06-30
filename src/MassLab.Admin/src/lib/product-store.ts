import { useSyncExternalStore } from "react";

import { PRODUCTS, type Product } from "@/lib/mock-data";
import type { Lang } from "@/lib/i18n";

export type ProductDraft = Omit<Product, "id" | "createdAt" | "updatedAt">;

let productState: Product[] = [...PRODUCTS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProducts() {
  return useSyncExternalStore(subscribe, () => productState, () => productState);
}

export function getProductById(id: string) {
  return productState.find((product) => product.id === id);
}

export function deleteProduct(id: string) {
  const next = productState.filter((product) => product.id !== id);
  if (next.length === productState.length) return false;
  productState = next;
  emit();
  return true;
}

export function upsertProduct(product: Product) {
  const exists = productState.some((item) => item.id === product.id);
  productState = exists
    ? productState.map((item) => (item.id === product.id ? product : item))
    : [product, ...productState];
  emit();
}

export function createProduct(draft: ProductDraft) {
  const now = new Date().toISOString().slice(0, 10);
  const product: Product = {
    id: `prd_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...draft,
  };
  upsertProduct(product);
  return product;
}

export function updateProduct(id: string, draft: ProductDraft) {
  const existing = getProductById(id);
  if (!existing) return null;
  const product: Product = {
    ...existing,
    ...draft,
    id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  upsertProduct(product);
  return product;
}

export function getProductTitle(product: Product, lang: Lang) {
  return product.translations[lang]?.name || product.translations.en.name;
}

export function getProductDescription(product: Product, lang: Lang) {
  return product.translations[lang]?.description || product.translations.en.description;
}
