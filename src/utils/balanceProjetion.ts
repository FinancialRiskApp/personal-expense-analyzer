import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { MonthlyBalanceProjection, Transaction } from "./types";

function getTotalDaysInMonth(date: string) {
    const daysInMonth = dayjs(date).daysInMonth();
  
  return daysInMonth;
}

function getElapsedDaysInMonth(currentDate: string) {
  return dayjs(currentDate).date();
}

function sumValues(transactions: Transaction[]) {
  return transactions.reduce(
    (sum, transaction) => sum + transaction.valor,
    0,
  );
}

export function filterExpensesFromMonthStart(
  transactions: Transaction[],
  currentDate: string,
) {
  dayjs.extend(isBetween);
  const dataRef = dayjs(currentDate);

  const startOfMonth = dataRef.startOf("month"); // dia 1
  const current = dataRef; // data atual

  const filteredExpenseTransactions = transactions.filter((transaction) => {
    const dia = dayjs(transaction.data);

    return (
      dia.isBetween(startOfMonth, current, "day", "[]") &&
      transaction.tipo === "saida"
    );
  });

  return filteredExpenseTransactions;
}

function dailyAverage(date: string, filteredTransactions: Transaction[]) {
  const total = sumValues(filteredTransactions);

  return total / getElapsedDaysInMonth(date);
}

export function monthlyBalanceProjection(
  income: string,
  currentDate: string,
  transactions: Transaction[],
) : MonthlyBalanceProjection {
  const filteredExpenses = filterExpensesFromMonthStart(transactions, currentDate);
  const elapsedDaysInMonth = getElapsedDaysInMonth(currentDate);
  const daysInMonth = getTotalDaysInMonth(currentDate);
  const totalExpensesInPeriod = sumValues(filteredExpenses);
  const averageDailyExpenses = dailyAverage(currentDate, filteredExpenses);
  const projectedTotalExpenses = averageDailyExpenses * daysInMonth;
  const projectedBalance = Number(income) - projectedTotalExpenses;
  const requiredBalance = projectedBalance < 0 ? Math.abs(projectedBalance) : 0;
  const currentBalance = Number(income) - totalExpensesInPeriod;

  return {
    referenceDate: currentDate,
    elapsedDaysInMonth,
    totalDaysInMonth: daysInMonth,
    totalExpensesInPeriod,
    averageDailyExpenses,
    projectedTotalExpenses,
    projectedBalance,
    requiredBalance,
    currentBalance,
  };
}
