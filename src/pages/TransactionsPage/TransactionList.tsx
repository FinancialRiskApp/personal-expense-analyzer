import dayjs from "dayjs";

import type { Transaction } from "@/utils/types/transactions";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Nenhum lançamento encontrado para o mês selecionado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-sm">
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
                  onClick={() => onDelete(transaction.id)}
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
  );
}
