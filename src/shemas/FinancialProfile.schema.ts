import { z } from "zod";

export const FormSchema = z.object({
  income: z
    .string()
    .refine((value) => {
      const numberValue = Number(value);

      return (
        !isNaN(numberValue) &&
        numberValue >= 0
      );
    }, {
      message: "Informe um valor numérico maior ou igual a zero",
    }),
  riskProfile: z.enum([
    "option-1",
    "option-2",
    "option-3",
  ]),
});
export type FormData = z.infer<typeof FormSchema>;