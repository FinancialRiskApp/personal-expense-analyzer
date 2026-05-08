import type { Transaction } from "../types/transactions";

export function generateNextId(transactions: Transaction[]): number {
  const currentMaxId = transactions.reduce((maxId, transaction) => {
    return Number.isFinite(transaction.id) && transaction.id > maxId ? transaction.id : maxId;
  }, 0);

  return currentMaxId + 1;
}
