import CreateExpenseButton from "./CreateExpenseButton";

type ExpenseHeaderProps = {
  onCreateExpense: () => void;
};

export default function ExpenseHeader({ onCreateExpense }: ExpenseHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Lançamentos de despesas</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Registre novas saídas financeiras para acompanhar e controlar seus gastos.
        </p>
      </div>

      <CreateExpenseButton onClick={onCreateExpense} />
    </div>
  );
}
