import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { type IncomeFormData, incomeFormSchema } from "./income.schema";

type IncomeFormProps = {
  onSubmit: (data: IncomeFormData) => void;
  onCancel: () => void;
};

export default function IncomeForm({ onSubmit, onCancel }: IncomeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeFormSchema),
    mode: "onChange",
    defaultValues: {
      valor: "",
    },
  });

  function handleCancel() {
    reset();
    onCancel();
  }

  function handleFormSubmit(data: IncomeFormData) {
    onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="income-value">Valor da receita</FieldLabel>
          <Input
            id="income-value"
            type="number"
            step={0.01}
            placeholder="R$ 0,00"
            {...register("valor")}
          />
          {errors.valor && <p className="text-sm text-red-500">{errors.valor.message}</p>}
        </Field>

        <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salvar receita
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
