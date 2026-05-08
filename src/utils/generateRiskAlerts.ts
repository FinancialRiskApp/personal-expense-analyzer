import {
  detectUnusualExpenses,
  type Transaction,
  type UnusualExpense,
} from "./detectUnusualExpenses";

export type RiskLevel = "baixo" | "médio" | "alto";

export type RiskAlert = {
  id: number;
  nivel: RiskLevel;
  titulo: string;
  mensagem: string;
};

export function generateRiskAlerts(transactions: Transaction[]): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  const incomes = transactions.filter((transaction) => transaction.tipo === "entrada");

  const expenses = transactions.filter((transaction) => transaction.tipo === "saida");

  const totalIncome = incomes.reduce((sum, transaction) => sum + transaction.valor, 0);

  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.valor, 0);

  const balance = totalIncome - totalExpenses;

  const expenseRate = totalIncome > 0 ? totalExpenses / totalIncome : 1;

  const unusualExpenses: UnusualExpense[] = detectUnusualExpenses(transactions);

  if (balance < 0) {
    alerts.push({
      id: 1,
      nivel: "alto",
      titulo: "Saldo negativo identificado",
      mensagem:
        "As despesas superaram as receitas no período analisado. Isso indica alto risco financeiro.",
    });
  }

  if (expenseRate >= 0.9) {
    alerts.push({
      id: 2,
      nivel: "alto",
      titulo: "Gastos muito próximos da renda",
      mensagem:
        "Mais de 90% da renda foi comprometida com despesas. É recomendado reduzir gastos variáveis.",
    });
  } else if (expenseRate >= 0.75) {
    alerts.push({
      id: 3,
      nivel: "médio",
      titulo: "Alto comprometimento da renda",
      mensagem:
        "As despesas ultrapassaram 75% da renda. O orçamento exige atenção para evitar desequilíbrio.",
    });
  }

  if (unusualExpenses.length >= 3) {
    alerts.push({
      id: 4,
      nivel: "alto",
      titulo: "Múltiplos gastos fora do padrão",
      mensagem: `Foram identificados ${unusualExpenses.length} gastos muito acima da média das suas categorias.`,
    });
  } else if (unusualExpenses.length > 0) {
    alerts.push({
      id: 5,
      nivel: "médio",
      titulo: "Gasto fora do padrão detectado",
      mensagem: `Foi identificado ${unusualExpenses.length} gasto fora do padrão. Verifique se foi uma despesa pontual ou recorrente.`,
    });
  }

  if (totalIncome === 0 && totalExpenses > 0) {
    alerts.push({
      id: 6,
      nivel: "alto",
      titulo: "Despesas sem receita registrada",
      mensagem:
        "Existem despesas no período, mas nenhuma receita foi registrada. Isso prejudica a análise financeira.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 7,
      nivel: "baixo",
      titulo: "Nenhum risco crítico identificado",
      mensagem: "O período analisado não apresenta sinais relevantes de risco financeiro.",
    });
  }

  return alerts;
}
