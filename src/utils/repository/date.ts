import dayjs from "dayjs";

import type { AvailableMonth, Transaction } from "../types/transactions";

export function isTransactionInMonth(transaction: Transaction, month: number, year: number): boolean {
  const transactionDate = dayjs(transaction.data);

  return transactionDate.year() === year && transactionDate.month() === month - 1;
}

export function sortTransactionsByDateDesc(left: Transaction, right: Transaction): number {
  return dayjs(right.data).valueOf() - dayjs(left.data).valueOf();
}

export function getTransactionMonthKey(transaction: Transaction): string {
  return dayjs(transaction.data).format("YYYY-MM");
}

export function toAvailableMonth(date: string): AvailableMonth {
  const parsedDate = dayjs(date);

  return {
    year: parsedDate.year(),
    month: parsedDate.month() + 1,
  };
}
