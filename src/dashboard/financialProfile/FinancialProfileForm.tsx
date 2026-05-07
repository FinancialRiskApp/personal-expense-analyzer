import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FinancialProfileContext from "@/context/FinancialProfileContext";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSidebar } from "@/components/ui/sidebar";

import { FormSchema, type FormData } from "@/shemas/FinancialProfile.schema";

export function FinancialProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      income: "",
      riskProfile: "option-1",
    },
  });

  const { toggleSidebar } = useSidebar();

  const { setFinancialProfile } = useContext(FinancialProfileContext);

  function onSubmit(data: FormData) {
    console.log(data);
    setFinancialProfile(data);
    reset();
    toggleSidebar();
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Dados</FieldLegend>
            <FieldDescription>Adicione sua renda mensal aqui e perfil de risco</FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="income">Renda mensal</FieldLabel>
                <Input
                  id="income"
                  type="number"
                  step={0.01}
                  placeholder="R$ 0,00"
                  required
                  {...register("income")}
                />
                {errors.income && <p className="text-red-500 text-sm">{errors.income.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="risc-profile">Perfil de risco</FieldLabel>
                <Controller
                  name="riskProfile"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="option-1" id="option-1" />
                          <Label htmlFor="option-1">Conservador</Label>
                        </div>
                        <div className="text-sm">
                          <FieldDescription>Foco em segurança e reservas</FieldDescription>
                          <FieldDescription>
                            Alerta se gastar mais que 55% da renda
                          </FieldDescription>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="option-2" id="option-2" />
                          <Label htmlFor="option-2">Equilibrado</Label>
                        </div>
                        <div className="text-sm">
                          <FieldDescription>Balanço entre gastos e poupança</FieldDescription>
                          <FieldDescription>
                            Alerta se gastar mais que 65% da renda
                          </FieldDescription>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="option-3" id="option-3" />
                          <Label htmlFor="option-3">Alto Risco</Label>
                        </div>
                        <div className="text-sm">
                          <FieldDescription>Maior tolerância a gastos</FieldDescription>
                          <FieldDescription>
                            Alerta se gastar mais que 75% da renda
                          </FieldDescription>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <Field orientation="horizontal">
            <Button type="submit">Atualizar</Button>
            <Button variant="outline" type="reset">
              Cancelar
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
