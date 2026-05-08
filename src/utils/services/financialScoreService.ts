import dayjs from "dayjs";

import { listTransactionsByMonth, listIncomeTransactionsByMonth } from "@/utils/repository";
import { detectUnusualExpenses, type UnusualExpense } from "@/utils/detectUnusualExpenses";
import { generateRiskAlerts, type RiskAlert } from "@/utils/generateRiskAlerts";

export type MonthlyFinancialScore = {
  score: number;
  level: "excelente" | "bom" | "atencao" | "critico";
  title: string;
  message: string;
  details: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expenseRatio: number;
    unusualExpenses: UnusualExpense[];
    unusualExpensesCount: number;
    riskAlertsCount: number;
  };
};

function extractMonthYear(date: string) {
  const parsed = dayjs(date);
  return { month: parsed.month() + 1, year: parsed.year() };
}

function getMonthData(month: number, year: number) {
  const transactions = listTransactionsByMonth(month, year);
  const totalIncome = listIncomeTransactionsByMonth(month, year)
    .reduce((sum, t) => sum + t.valor, 0);
  const expenses = transactions.filter((t) => t.tipo === "saida");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.valor, 0);
  const balance = totalIncome - totalExpenses;
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1;

  return { transactions, totalIncome, totalExpenses, balance, expenseRatio };
}

function calculateBaseScore(
  balance: number,
  expenseRatio: number,
  unusualExpenses: UnusualExpense[],
  highAlerts: number,
  mediumAlerts: number,
  totalIncome: number,
  totalExpenses: number,
): number {
  let score = 100;

  if (balance < 0) score -= 30;

  if (expenseRatio >= 0.9) score -= 25;
  else if (expenseRatio >= 0.75) score -= 15;
  else if (expenseRatio >= 0.6) score -= 8;

  if (unusualExpenses.length >= 3) score -= 15;
  else if (unusualExpenses.length > 0) score -= 8;

  score -= highAlerts * 8;
  score -= mediumAlerts * 4;

  if (totalIncome === 0 && totalExpenses > 0) score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function classifyScore(score: number): {
  level: "excelente" | "bom" | "atencao" | "critico";
  title: string;
  message: string;
} {
  if (score >= 85) {
    return {
      level: "excelente",
      title: "Excelente saúde financeira",
      message:
        "O usuário apresenta bom equilíbrio entre receitas, despesas e baixo nível de risco financeiro.",
    };
  }

  if (score >= 70) {
    return {
      level: "bom",
      title: "Boa saúde financeira",
      message:
        "O usuário apresenta uma situação financeira positiva, mas ainda pode otimizar alguns gastos.",
    };
  }

  if (score >= 50) {
    return {
      level: "atencao",
      title: "Atenção financeira necessária",
      message: "O usuário apresenta sinais de alerta e deve acompanhar melhor seus gastos.",
    };
  }

  return {
    level: "critico",
    title: "Risco financeiro elevado",
    message:
      "O usuário apresenta alto risco financeiro, com necessidade de revisão urgente das despesas.",
  };
}

function buildFinancialScore(
  score: number,
  data: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expenseRatio: number;
    unusualExpenses: UnusualExpense[];
    riskAlerts: RiskAlert[];
  },
): MonthlyFinancialScore {
  const scoreInfo = classifyScore(score);

  return {
    score,
    level: scoreInfo.level,
    title: scoreInfo.title,
    message: scoreInfo.message,
    details: {
      totalIncome: data.totalIncome,
      totalExpenses: data.totalExpenses,
      balance: data.balance,
      expenseRatio: data.expenseRatio,
      unusualExpenses: data.unusualExpenses,
      unusualExpensesCount: data.unusualExpenses.length,
      riskAlertsCount: data.riskAlerts.length,
    },
  };
}

export function calculateMonthlyFinancialScore(date: string): MonthlyFinancialScore {
  const { month, year } = extractMonthYear(date);
  const monthData = getMonthData(month, year);

  const unusualExpenses = detectUnusualExpenses(monthData.transactions);
  const riskAlerts = generateRiskAlerts(monthData.transactions);
  const highAlerts = riskAlerts.filter((a) => a.nivel === "alto").length;
  const mediumAlerts = riskAlerts.filter((a) => a.nivel === "médio").length;

  const score = calculateBaseScore(
    monthData.balance,
    monthData.expenseRatio,
    unusualExpenses,
    highAlerts,
    mediumAlerts,
    monthData.totalIncome,
    monthData.totalExpenses,
  );

  return buildFinancialScore(score, { ...monthData, unusualExpenses, riskAlerts });
}
