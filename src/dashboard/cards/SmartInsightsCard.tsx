import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

import type { FinancialScore } from "@/utils/calculateFinancialScore";
import type { UnusualExpense } from "@/utils/detectUnusualExpenses";

type SmartInsightsCardProps = {
  financialScore: FinancialScore;
  unusualExpenses: UnusualExpense[];
};

export default function SmartInsightsCard({
  financialScore,
  unusualExpenses,
}: SmartInsightsCardProps) {
  const percentualGastos = Math.round(financialScore.detalhes.percentualGastos * 100);

  const maiorGastoForaPadrao =
    unusualExpenses.length > 0
      ? unusualExpenses.reduce((maior, expense) => (expense.valor > maior.valor ? expense : maior))
      : null;

  return (
    <Card className="min-w-[200px] max-w-[350px] min-h-[400px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Insights Inteligentes</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col justify-evenly gap-4 w-full">
          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <TrendingUp />
            </div>

            <div className="w-58">
              <h2 className="font-semibold">{financialScore.titulo}</h2>
              <p className="text-sm text-muted-foreground">{financialScore.mensagem}</p>
            </div>
          </div>

          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <PieChart />
            </div>

            <div className="w-58">
              <h2 className="font-semibold">Comprometimento da renda</h2>
              <p className="text-sm text-muted-foreground">
                As despesas representam {percentualGastos}% das receitas no período analisado.
              </p>
            </div>
          </div>

          <div className="flex justify-between p-2 border-2 border-zinc-300 rounded-sm">
            <div className="flex items-center justify-center w-10">
              <BarChart3 />
            </div>

            <div className="w-58">
              {maiorGastoForaPadrao ? (
                <>
                  <h2 className="font-semibold">Gasto atípico identificado</h2>
                  <p className="text-sm text-muted-foreground">
                    O maior gasto fora do padrão foi em {maiorGastoForaPadrao.categoria}, no valor
                    de R$ {maiorGastoForaPadrao.valor.toFixed(2)}.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-semibold">Sem gasto atípico relevante</h2>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma despesa ficou muito acima da média da própria categoria.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
