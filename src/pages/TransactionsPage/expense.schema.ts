import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Outros",
] as const;

export const expenseFormSchema = z.object({
  data: z.string().min(1, "Selecione o mês"),

  valor: z.string().refine(
    (value) => {
      const numericValue = Number(value);

      return !Number.isNaN(numericValue) && numericValue >= 0;
    },
    {
      message: "Informe um valor numérico maior ou igual a zero",
    },
  ),

  descricao: z.string().min(1, "Informe uma descrição"),

  categoria: z.string().min(1, "Selecione uma categoria"),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
