import PieChartWithCustomizedLabel from "@/components/PieChartWithCustomizedLabel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SpendingDistributionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <PieChartWithCustomizedLabel />
      </CardContent>
      <CardFooter>
        <div className="flex justify-evenly w-full">
          <div>
            <p>Moradia</p>
            <p>Alimentação</p>
            <p>Transporte</p>
            <p>Saúde</p>
          </div>
          <div>
            <p>Lazer</p>
            <p>Educação</p>
            <p>Poupança</p>
            <p>Outros</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
