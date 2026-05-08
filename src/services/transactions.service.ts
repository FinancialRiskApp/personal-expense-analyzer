import rawData from "../../database/transactions.json";
import type { Transaction } from "@/utils/types";

export function getTransactions(): Transaction[] {
  return rawData as Transaction[];
}
