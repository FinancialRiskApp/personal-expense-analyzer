import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTransaction } from "@/utils/repository";

import ExpenseForm from "./ExpenseForm";
import type { ExpenseFormData } from "./expense.schema";

type CreateExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export default function CreateExpenseDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateExpenseDialogProps) {
  function handleSubmit(data: ExpenseFormData) {
    createTransaction({
      data: `${data.data}-01`,
      descricao: data.descricao,
      categoria: data.categoria,
      tipo: "saida",
      valor: Number(data.valor),
    });

    onCreated?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova despesa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para registrar uma nova saída financeira no seu histórico.
          </DialogDescription>
        </DialogHeader>

        <ExpenseForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
