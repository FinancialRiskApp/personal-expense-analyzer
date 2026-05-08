import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { type ExpenseFormData, expenseFormSchema, EXPENSE_CATEGORIES } from "./expense.schema";

type ExpenseFormProps = {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
};

export default function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    mode: "onChange",
    defaultValues: {
      valor: "",
      descricao: "",
      categoria: "",
    },
  });

  function handleCancel() {
    reset();
    onCancel();
  }

  function handleFormSubmit(data: ExpenseFormData) {
    onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="expense-description">Descrição</FieldLabel>
          <Input
            id="expense-description"
            type="text"
            placeholder="Ex.: Almoço no restaurante"
            {...register("descricao")}
          />
          {errors.descricao && <p className="text-sm text-red-500">{errors.descricao.message}</p>}
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-2 pt-1">
                {EXPENSE_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <RadioGroupItem value={category} id={`cat-${category}`} />
                    <Label htmlFor={`cat-${category}`} className="text-sm font-normal">{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.categoria && <p className="text-sm text-red-500">{errors.categoria.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="expense-value">Valor da despesa</FieldLabel>
          <Input
            id="expense-value"
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
            Salvar despesa
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
