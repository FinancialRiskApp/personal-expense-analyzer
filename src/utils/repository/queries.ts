import type { AvailableMonth, MonthlyBalanceSummary, Transaction } from "../types/transactions";
import { sortTransactionsByDateDesc, getTransactionMonthKey, isTransactionInMonth, toAvailableMonth } from "./date";
import { cloneSeedTransactions, seedTransactionsStore } from "./seed";
import { readTransactions } from "./storage";
import { assertNumericId } from "./validators";

function loadTransactions(): Transaction[] {
  return readTransactions(seedTransactionsStore, cloneSeedTransactions);
}

export function initializeTransactionsStore(): Transaction[] {
  return loadTransactions();
}

export function getAllTransactions(): Transaction[] {
  return loadTransactions().sort(sortTransactionsByDateDesc);
}

export function getTransactionById(id: number): Transaction | null {
  assertNumericId(id, "getTransactionById");

  return loadTransactions().find((transaction) => transaction.id === id) ?? null;
}

export function listTransactionsByMonth(month: number, year: number): Transaction[] {
  return loadTransactions()
    .filter((transaction) => isTransactionInMonth(transaction, month, year))
    .sort(sortTransactionsByDateDesc);
}

export function listIncomeTransactionsByMonth(month: number, year: number): Transaction[] {
  return listTransactionsByMonth(month, year).filter((transaction) => transaction.tipo === "entrada");
}

export function listExpenseTransactionsByMonth(month: number, year: number): Transaction[] {
  return listTransactionsByMonth(month, year).filter((transaction) => transaction.tipo === "saida");
}

export function getMonthlyBalanceSummary(month: number, year: number): MonthlyBalanceSummary {
  const transactions = listTransactionsByMonth(month, year);

  const totalEntradas = transactions
    .filter((transaction) => transaction.tipo === "entrada")
    .reduce((total, transaction) => total + transaction.valor, 0);

  const totalSaidas = transactions
    .filter((transaction) => transaction.tipo === "saida")
    .reduce((total, transaction) => total + transaction.valor, 0);

  return {
    year,
    month,
    totalEntradas,
    totalSaidas,
    saldo: totalEntradas - totalSaidas,
    quantidadeTransacoes: transactions.length,
  };
}

export function getAvailableMonths(): AvailableMonth[] {
  const uniqueMonths = new Map<string, AvailableMonth>();

  for (const transaction of loadTransactions()) {
    uniqueMonths.set(getTransactionMonthKey(transaction), toAvailableMonth(transaction.data));
  }

  return Array.from(uniqueMonths.values()).sort((left, right) => {
    if (left.year !== right.year) {
      return right.year - left.year;
    }

    return right.month - left.month;
  });
}

export function getLatestAvailableMonth(): AvailableMonth | null {
  return getAvailableMonths()[0] ?? null;
}
