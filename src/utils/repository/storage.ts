import type { Transaction } from "../types/transactions";
import { isTransactionsArray } from "./validators";

export function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readTransactions(
  seedTransactionsStore: () => Transaction[],
  cloneSeedTransactions: () => Transaction[],
): Transaction[] {
  const storage = getStorage();

  if (!storage) {
    return cloneSeedTransactions();
  }

  const storedValue = storage.getItem("pea.transactions");

  if (!storedValue) {
    return seedTransactionsStore();
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isTransactionsArray(parsedValue)) {
      return seedTransactionsStore();
    }

    return parsedValue;
  } catch {
    return seedTransactionsStore();
  }
}

export function writeTransactions(transactions: Transaction[], storageKey: string): Transaction[] {
  const storage = getStorage();

  if (storage) {
    storage.setItem(storageKey, JSON.stringify(transactions));
  }

  return transactions;
}
