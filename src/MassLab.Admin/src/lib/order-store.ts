import { useSyncExternalStore } from "react";

import { ORDERS, type Order } from "@/lib/mock-data";

export type OrderDraft = Omit<Order, "id" | "createdAt" | "updatedAt">;

let orderState: Order[] = [...ORDERS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, () => orderState, () => orderState);
}

export function getOrderById(id: string) {
  return orderState.find((order) => order.id === id);
}

export function deleteOrder(id: string) {
  const next = orderState.filter((order) => order.id !== id);
  if (next.length === orderState.length) return false;
  orderState = next;
  emit();
  return true;
}

export function upsertOrder(order: Order) {
  const exists = orderState.some((item) => item.id === order.id);
  orderState = exists
    ? orderState.map((item) => (item.id === order.id ? order : item))
    : [order, ...orderState];
  emit();
}

export function updateOrder(id: string, draft: OrderDraft) {
  const existing = getOrderById(id);
  if (!existing) return null;
  const order: Order = {
    ...existing,
    ...draft,
    id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  upsertOrder(order);
  return order;
}
