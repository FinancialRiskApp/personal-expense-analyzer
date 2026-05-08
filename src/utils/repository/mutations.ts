import dayjs from "dayjs";

import type { Transaction, CreateTransactionPayload, UpdateTransactionPayload } from "../types/transactions";
import { TRANSACTIONS_STORAGE_KEY } from "./constants";
import { sortTransactionsByDateDesc } from "./date";
import { generateNextId } from "./helpers";
import { cloneSeedTransactions, seedTransactionsStore } from "./seed";
import { readTransactions, writeTransactions } from "./storage";
import { assertNumericId } from "./validators";

function loadTransactions(): Transaction[] {
  return readTransactions(seedTransactionsStore, cloneSeedTransactions);
}

export function createTransaction(payload: CreateTransactionPayload): Transaction {
  const transactions = loadTransactions();

  const newTransaction: Transaction = {
    id: generateNextId(transactions),
    data: dayjs().format("YYYY-MM-DD"),
    ...payload,
  };

  writeTransactions([...transactions, newTransaction], TRANSACTIONS_STORAGE_KEY);

  return newTransaction;
}

export function updateTransaction(id: number, payload: UpdateTransactionPayload): Transaction {
  const transactions = loadTransactions();
  const transactionIndex = transactions.findIndex((transaction) => transaction.id === id);

  if (transactionIndex === -1) {
    throw new Error(`Transação com id ${id} não encontrada.`);
  }

  const updatedTransaction: Transaction = {
    ...transactions[transactionIndex],
    ...payload,
    id,
  };

  const updatedTransactions = [...transactions];
  updatedTransactions[transactionIndex] = updatedTransaction;

  writeTransactions(updatedTransactions, TRANSACTIONS_STORAGE_KEY);

  return updatedTransaction;
}

export function deleteTransaction(id: number): void {
  assertNumericId(id, "deleteTransaction");

  const transactions = loadTransactions();
  const transactionExists = transactions.some((transaction) => transaction.id === id);

  if (!transactionExists) {
    throw new Error(`Transaction with id ${id} was not found.`);
  }

  writeTransactions(
    transactions.filter((transaction) => transaction.id !== id),
    TRANSACTIONS_STORAGE_KEY,
  );
}

export function resetTransactionsStore(): Transaction[] {
  return seedTransactionsStore().sort(sortTransactionsByDateDesc);
}
