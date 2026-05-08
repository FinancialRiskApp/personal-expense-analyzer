import type { Transaction } from "../types/transactions";

export function assertNumericId(id: number, operationName: string): void {
  if (typeof id !== "number" || Number.isNaN(id)) {
    throw new Error(`${operationName} requires a numeric id.`);
  }
}

export function isTransactionsArray(value: unknown): value is Transaction[] {
  return Array.isArray(value);
}
