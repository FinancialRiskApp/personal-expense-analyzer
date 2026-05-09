import { useMemo, useState } from "react";

import {
  getAvailableMonths,
  getLatestAvailableMonth,
  getMonthlyBalanceSummary,
  listExpenseTransactionsByMonth,
} from "@/utils/repository";

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

type ExpenseTransaction = ReturnType<typeof listExpenseTransactionsByMonth>[number];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calculateScore(totalEntradas: number, totalSaidas: number) {
  if (totalEntradas <= 0 && totalSaidas > 0) {
    return 25;
  }

  if (totalEntradas <= 0) {
    return 50;
  }

  const expenseRatio = totalSaidas / totalEntradas;

  if (expenseRatio <= 0.55) {
    return 90;
  }

  if (expenseRatio <= 0.7) {
    return 75;
  }

  if (expenseRatio <= 0.9) {
    return 55;
  }

  if (expenseRatio <= 1) {
    return 40;
  }

  return 20;
}

function getScoreLabel(score: number) {
  if (score >= 80) {
    return "Saúde financeira boa";
  }

  if (score >= 60) {
    return "Atenção moderada";
  }

  if (score >= 40) {
    return "Risco financeiro elevado";
  }

  return "Risco financeiro crítico";
}

function getExpenseRatio(totalEntradas: number, totalSaidas: number) {
  if (totalEntradas <= 0) {
    return totalSaidas > 0 ? 100 : 0;
  }

  return Math.round((totalSaidas / totalEntradas) * 100);
}

function getHighestExpenseCategory(expenses: ExpenseTransaction[]) {
  const totalsByCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (!acc[expense.categoria]) {
      acc[expense.categoria] = 0;
    }

    acc[expense.categoria] += expense.valor;

    return acc;
  }, {});

  const categories = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1]);

  if (categories.length === 0) {
    return null;
  }

  const [categoria, total] = categories[0];

  return {
    categoria,
    total,
  };
}

function getRiskAlerts(
  totalEntradas: number,
  totalSaidas: number,
  saldo: number,
  expenses: ExpenseTransaction[],
) {
  const alerts: string[] = [];

  const expenseRatio = getExpenseRatio(totalEntradas, totalSaidas);

  if (saldo < 0) {
    alerts.push("As despesas superaram as entradas no mês selecionado.");
  }

  if (expenseRatio >= 90) {
    alerts.push("Os gastos estão acima de 90% da renda mensal.");
  } else if (expenseRatio >= 70) {
    alerts.push("Os gastos estão consumindo uma parte elevada da renda.");
  }

  const highestCategory = getHighestExpenseCategory(expenses);

  if (highestCategory) {
    alerts.push(`A categoria com maior gasto no mês foi ${highestCategory.categoria}.`);
  }

  if (alerts.length === 0) {
    alerts.push("Nenhum alerta crítico identificado para o mês selecionado.");
  }

  return alerts;
}

export default function Dashboard() {
  const availableMonths = getAvailableMonths();
  const latestMonth = getLatestAvailableMonth();

  const [selectedMonth, setSelectedMonth] = useState(
    latestMonth ? `${latestMonth.year}-${latestMonth.month}` : "2026-5",
  );

  const [year, month] = selectedMonth.split("-").map(Number);

  const summary = getMonthlyBalanceSummary(month, year);
  const expenses = listExpenseTransactionsByMonth(month, year);

  const score = calculateScore(summary.totalEntradas, summary.totalSaidas);
  const scoreLabel = getScoreLabel(score);
  const expenseRatio = getExpenseRatio(summary.totalEntradas, summary.totalSaidas);

  const highestExpenseCategory = useMemo(() => getHighestExpenseCategory(expenses), [expenses]);

  const riskAlerts = useMemo(
    () => getRiskAlerts(summary.totalEntradas, summary.totalSaidas, summary.saldo, expenses),
    [summary.totalEntradas, summary.totalSaidas, summary.saldo, expenses],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard financeiro</h2>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dashboard-month-filter" className="text-sm font-medium text-slate-600">
            Mês
          </label>

          <select
            id="dashboard-month-filter"
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Entradas</p>
          <p className="mt-3 text-2xl font-bold text-emerald-700">
            {formatCurrency(summary.totalEntradas)}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Saídas</p>
          <p className="mt-3 text-2xl font-bold text-red-600">
            {formatCurrency(summary.totalSaidas)}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Saldo do mês</p>
          <p
            className={
              summary.saldo >= 0
                ? "mt-3 text-2xl font-bold text-emerald-700"
                : "mt-3 text-2xl font-bold text-red-600"
            }
          >
            {formatCurrency(summary.saldo)}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Comprometimento da renda</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{expenseRatio}%</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Score financeiro</h3>
              <p className="mt-1 text-sm text-slate-500">
                Indicador simples baseado na relação entre entradas e saídas.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {score}/100
            </span>
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={
                  score >= 80
                    ? "h-full rounded-full bg-emerald-600"
                    : score >= 60
                      ? "h-full rounded-full bg-yellow-500"
                      : "h-full rounded-full bg-red-600"
                }
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="mt-4 text-base font-semibold text-slate-900">{scoreLabel}</p>

            <p className="mt-1 text-sm text-slate-500">
              Quanto menor o percentual de gastos em relação às entradas, melhor tende a ser o score
              financeiro.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Alertas de risco</h3>

          <div className="mt-4 space-y-3">
            {riskAlerts.map((alert) => (
              <div
                key={alert}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {alert}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Principal categoria de gasto</h3>

        {highestExpenseCategory ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">Categoria</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {highestExpenseCategory.categoria}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Total gasto: {formatCurrency(highestExpenseCategory.total)}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Nenhuma despesa encontrada para o mês selecionado.
          </p>
        )}
      </div>
    </section>
  );
}
