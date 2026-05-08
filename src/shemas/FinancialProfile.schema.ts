import { z } from "zod";

export const FormSchema = z.object({
 income: z
    .number({
      error: "Informe um número válido",
    })
    .min(0, {
      message: "Informe um valor maior ou igual a zero",
    }),
  riskProfile: z.enum([
    "option-1",
    "option-2",
    "option-3",
  ]),
});
export type FormData = z.infer<typeof FormSchema>;