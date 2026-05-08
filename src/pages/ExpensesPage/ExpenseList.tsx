type ExpenseItem = {
  id: string;
  mes: string;
  descricao: string;
  categoria: string;
  tipo: "entrada" | "saida";
  valor: number;
};

type ExpenseListProps = {
  items: ExpenseItem[];
  onDelete?: (id: string) => void;
};

export default function ExpenseList({ items, onDelete }: ExpenseListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Nenhum lançamento encontrado para o mês selecionado.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Mês</th>
            <th className="px-4 py-3 font-medium">Descrição</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 text-right font-medium">Ação</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <span
                  className={
                    item.tipo === "entrada"
                      ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      : "rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {item.tipo === "entrada" ? "Entrada" : "Saída"}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-600">{item.mes}</td>

              <td className="px-4 py-3 font-medium text-slate-800">{item.descricao}</td>

              <td className="px-4 py-3 text-slate-600">{item.categoria}</td>

              <td className="px-4 py-3 font-semibold text-slate-900">R$ {item.valor.toFixed(2)}</td>

              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onDelete?.(item.id)}
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
