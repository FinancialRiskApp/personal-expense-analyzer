import dayjs from "dayjs";

import {
  listExpenseTransactionsByMonth,
  listIncomeTransactionsByMonth,
} from "@/utils/repository";

function extractMonthYear(date: string) {
  const parsed = dayjs(date);

  return { month: parsed.month() + 1, year: parsed.year() };
}

export function getMonthlyIncome(date: string): number {
  const { month, year } = extractMonthYear(date);

  return listIncomeTransactionsByMonth(month, year).reduce(
    (total, transaction) => total + transaction.valor,
    0,
  );
}

export function getMonthlyExpenses(date: string): number {
  const { month, year } = extractMonthYear(date);

  return listExpenseTransactionsByMonth(month, year).reduce(
    (total, transaction) => total + transaction.valor,
    0,
  );
}

export function getMonthBalance(date: string): number {
  return getMonthlyIncome(date) - getMonthlyExpenses(date);
}

export function getRemainingDailyBudget(): number {
  const today = dayjs();
  const income = getMonthlyIncome(today.format("YYYY-MM-DD"));
  const expenses = getMonthlyExpenses(today.format("YYYY-MM-DD"));
  const currentDay = today.date();
  const totalDays = today.daysInMonth();
  const remainingDays = totalDays - currentDay;

  if (remainingDays === 0) return income - expenses;
  return (income - expenses) / remainingDays;
}
