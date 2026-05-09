import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type TransactionsHeaderProps = {
  onCreateIncome: () => void;
  onCreateExpense: () => void;
};

export default function TransactionsHeader({
  onCreateIncome,
  onCreateExpense,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Lançamentos</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Registre e acompanhe todas as suas transações financeiras.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onCreateIncome}
          className="h-11 rounded-2xl bg-green-700 px-5 text-white hover:bg-green-800"
        >
          <PlusIcon />
          Nova entrada
        </Button>

        <Button
          type="button"
          onClick={onCreateExpense}
          className="h-11 rounded-2xl bg-red-600 px-5 text-white hover:bg-red-700"
        >
          <PlusIcon />
          Nova despesa
        </Button>
      </div>
    </div>
  );
}
