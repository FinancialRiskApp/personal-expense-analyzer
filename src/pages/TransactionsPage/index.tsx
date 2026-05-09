import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CreateExpenseDialog from "./CreateExpenseDialog";
import CreateIncomeDialog from "./CreateIncomeDialog";
import TransactionsHeader from "./TransactionsHeader";
import TransactionList from "./TransactionList";

import {
  deleteTransaction,
  getAvailableMonths,
  getLatestAvailableMonth,
  listTransactionsByMonth,
} from "@/utils/repository";

import type { Transaction } from "@/utils/types/transactions";

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function TransactionsPage() {
  const latestMonth = getLatestAvailableMonth();

  const [isCreateIncomeDialogOpen, setIsCreateIncomeDialogOpen] = useState(false);
  const [isCreateExpenseDialogOpen, setIsCreateExpenseDialogOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(
    latestMonth ? `${latestMonth.year}-${latestMonth.month}` : "2026-5",
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const availableMonths = getAvailableMonths();

  function loadTransactions() {
    const [year, month] = selectedMonth.split("-").map(Number);

    const monthlyTransactions = listTransactionsByMonth(month, year);

    setTransactions(monthlyTransactions);
  }

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth]);

  function handleDeleteTransaction(id: number) {
    deleteTransaction(id);
    loadTransactions();
  }

  return (
    <section className="w-full space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      <TransactionsHeader
        onCreateIncome={() => setIsCreateIncomeDialogOpen(true)}
        onCreateExpense={() => setIsCreateExpenseDialogOpen(true)}
      />

      <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Lançamentos do mês</CardTitle>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label htmlFor="month-filter" className="text-sm font-medium text-slate-600">
              Mês
            </label>

            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:w-auto"
            >
              {availableMonths.map((availableMonth) => {
                const value = `${availableMonth.year}-${availableMonth.month}`;
                const label = `${monthNames[availableMonth.month - 1]} / ${availableMonth.year}`;

                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-hidden">
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>

      <CreateIncomeDialog
        open={isCreateIncomeDialogOpen}
        onOpenChange={setIsCreateIncomeDialogOpen}
        onCreated={loadTransactions}
      />

      <CreateExpenseDialog
        open={isCreateExpenseDialogOpen}
        onOpenChange={setIsCreateExpenseDialogOpen}
        onCreated={loadTransactions}
      />
    </section>
  );
}
