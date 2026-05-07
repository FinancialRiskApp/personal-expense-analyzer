import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancialProjectionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Projeção Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            {/* icon */}
            <span>Renda do Mês</span>
            <span>R$ 8500,00</span>
          </div>
          <div>
            {/* icon */}
            <span>Gastos Atuais</span>
            <span>R$ 6500,00</span>
          </div>
          <div>
            {/* icon */}
            <span>Saldo Atual</span>
            <span>R$ 2000,00</span>
          </div>
        </div>
        <div>
          <h2>Saldo Projetado fim do mês</h2>
          <p>valor</p>
          <span>Mensagem</span>
        </div>
      </CardContent>
    </Card>
  );
}
