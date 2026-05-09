import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CreateExpenseDialog from "./CreateExpenseDialog";
import ExpenseHeader from "./ExpenseHeader";

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

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ExpensesPage() {
  const latestMonth = getLatestAvailableMonth();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    <section className="space-y-6">
      <ExpenseHeader onCreateExpense={() => setIsCreateDialogOpen(true)} />

      <Card className="border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Lançamentos do mês</CardTitle>

          <div className="flex items-center gap-2">
            <label htmlFor="month-filter" className="text-sm font-medium text-slate-600">
              Mês
            </label>

            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

        <CardContent>
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              Nenhum lançamento encontrado para o mês selecionado.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 text-right font-medium">Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <span
                          className={
                            transaction.tipo === "entrada"
                              ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                              : "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                          }
                        >
                          {transaction.tipo === "entrada" ? "Entrada" : "Saída"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {dayjs(transaction.data).format("DD/MM/YYYY")}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {transaction.descricao}
                      </td>

                      <td className="px-4 py-3 text-slate-600">{transaction.categoria}</td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(transaction.valor)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="rounded-lg px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Apagar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreated={loadTransactions}
      />
    </section>
  );
}
