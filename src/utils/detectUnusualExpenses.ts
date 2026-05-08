import type { Transaction } from "./types/transactions";

export type UnusualExpense = {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  mediaCategoria: number;
  percentualAcimaDaMedia: number;
};

export function detectUnusualExpenses(transactions: Transaction[]): UnusualExpense[] {
  const expenses = transactions.filter((transaction) => transaction.tipo === "saida");

  const expensesByCategory = expenses.reduce<Record<string, number[]>>((acc, expense) => {
    if (!acc[expense.categoria]) {
      acc[expense.categoria] = [];
    }

    acc[expense.categoria].push(expense.valor);

    return acc;
  }, {});

  const averageByCategory = Object.entries(expensesByCategory).reduce<Record<string, number>>(
    (acc, [category, values]) => {
      const total = values.reduce((sum, value) => sum + value, 0);
      acc[category] = total / values.length;

      return acc;
    },
    {},
  );

  const unusualExpenses = expenses
    .map((expense) => {
      const categoryAverage = averageByCategory[expense.categoria];

      const percentageAboveAverage =
        categoryAverage > 0 ? ((expense.valor - categoryAverage) / categoryAverage) * 100 : 0;

      return {
        id: expense.id,
        data: expense.data,
        descricao: expense.descricao,
        categoria: expense.categoria,
        valor: expense.valor,
        mediaCategoria: categoryAverage,
        percentualAcimaDaMedia: percentageAboveAverage,
      };
    })
    .filter((expense) => expense.percentualAcimaDaMedia >= 50);

  return unusualExpenses;
}
