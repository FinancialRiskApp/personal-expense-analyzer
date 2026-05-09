import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTransaction } from "@/utils/repository";

import IncomeForm from "./IncomeForm";
import type { IncomeFormData } from "./income.schema";

type CreateIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export default function CreateIncomeDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateIncomeDialogProps) {
  function handleSubmit(data: IncomeFormData) {
    createTransaction({
      data: `${data.data}-01`,
      descricao: "Receita adicionada manualmente",
      categoria: "Renda",
      tipo: "entrada",
      valor: Number(data.valor),
    });

    onCreated?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova receita</DialogTitle>
          <DialogDescription>
            Informe o mês e o valor para registrar uma nova entrada financeira no seu histórico.
          </DialogDescription>
        </DialogHeader>

        <IncomeForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
