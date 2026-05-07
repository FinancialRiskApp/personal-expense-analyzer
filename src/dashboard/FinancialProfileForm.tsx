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

export function FinancialProfileForm() {

function sumitconfig(data){
console.log(data)
}
  return (
    <div className="w-full max-w-md">
      <form onSubmit={sumitconfig}>
        <FieldGroup>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Dados</FieldLegend>
            <FieldDescription>Adicione sua renda mensal aqui e perfil de risco</FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="income">Renda mensal</FieldLabel>
                <Input id="income" type="number" step={0.01} placeholder="R$ 0,00" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="risc-profile">Perfil de risco</FieldLabel>
                <RadioGroup defaultValue="option-1">
                  <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="option-1" id="option-1" />
                      <Label htmlFor="option-1">Conservador</Label>
                    </div>
                    <div className="text-sm">
                      <FieldDescription>Foco em segurança e reservas</FieldDescription>
                      <FieldDescription>Alerta se gastar mais que 55% da renda</FieldDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="option-2" id="option-2" />
                      <Label htmlFor="option-2">Equilibrado</Label>
                    </div>
                    <div className="text-sm">
                      <FieldDescription>Balanço entre gastos e poupança</FieldDescription>
                      <FieldDescription>Alerta se gastar mais que 65% da renda</FieldDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 p-2 border-2 border-zinc-300 rounded-sm">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="option-3" id="option-3" />
                      <Label htmlFor="option-3">Alto Risco</Label>
                    </div>
                    <div className="text-sm">
                      <FieldDescription>Maior tolerância a gastos</FieldDescription>
                      <FieldDescription>Alerta se gastar mais que 75% da renda</FieldDescription>
                    </div>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <Field orientation="horizontal">
            <Button type="submit">Atualizar</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
