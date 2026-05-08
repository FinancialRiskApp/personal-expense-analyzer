import PieChartWithNeedle from "@/components/PieChartWithNeedle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FinancialScore } from "@/utils/calculateFinancialScore";

type FinancialScoreCardProps = {
  financialScore: FinancialScore;
};

export default function FinancialScoreCard({ financialScore }: FinancialScoreCardProps) {
  const percentualGastos = Math.round(financialScore.detalhes.percentualGastos * 100);
  return (
    <Card className="min-w-[200px] max-w-[300px] min-h-[400px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Score Financeiro</CardTitle>
        <CardDescription>Mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChartWithNeedle />

        <div className="mt-4">
          <p className="text-3xl font-bold">{financialScore.score}</p>
          <p className="text-sm font-medium">{financialScore.titulo}</p>
          <p className="text-xs text-muted-foreground">{financialScore.mensagem}</p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-evenly w-full">
          <div>
            <p>Gastos</p>
            <p>{percentualGastos}%</p>
            <p>da renda</p>
          </div>
          <div>
            <p>Limite Bom</p>
            <p>65%</p>
            <p>da renda</p>
          </div>
          <div>
            <p>Zona Crítica</p>
            <p>90%</p>
            <p>da renda</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
