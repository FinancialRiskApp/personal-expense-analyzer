import PieChartWithNeedle from "@/components/PieChartWithNeedle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancialScoreCard() {
  return (
    <Card className="min-w-[200px] max-w-[300px] min-h-[400px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Score Financeiro</CardTitle>
        <CardDescription>Mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChartWithNeedle />
      </CardContent>
      <CardFooter>
        <div className="flex justify-evenly w-full">
        <div>
           <p>Gastos</p>
           <p>77%</p>
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