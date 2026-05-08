import seedTransactions from "../../../database/transactions.json";

import type { Transaction } from "../types/transactions";
import { TRANSACTIONS_STORAGE_KEY } from "./constants";
import { getStorage } from "./storage";

export function cloneSeedTransactions(): Transaction[] {
  return structuredClone(seedTransactions) as Transaction[];
}

export function seedTransactionsStore(): Transaction[] {
  const storage = getStorage();
  const seededTransactions = cloneSeedTransactions();

  if (storage) {
    storage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(seededTransactions));
  }

  return seededTransactions;
}
