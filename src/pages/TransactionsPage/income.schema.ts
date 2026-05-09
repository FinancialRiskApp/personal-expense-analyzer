import { z } from "zod";

export const incomeFormSchema = z.object({
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
});

export type IncomeFormData = z.infer<typeof incomeFormSchema>;
