export type TransactionType = "entrada" | "saida";

export type Transaction = {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: TransactionType;
};

export type CreateTransactionPayload = Omit<Transaction, "id">;

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export type MonthlyBalanceSummary = {
  year: number;
  month: number;
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  quantidadeTransacoes: number;
};

export type AvailableMonth = {
  year: number;
  month: number;
};
