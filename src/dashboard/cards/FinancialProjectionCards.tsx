import { useContext, useEffect, useState } from "react";
import FinancialProfileContext from "@/context/FinancialProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { getCurrentMonthSalary, getTransactions } from "@/services/transactions.service";
import { monthlyBalanceProjection } from "@/utils/balanceProjetion";

const transactions = getTransactions();

export default function FinancialProjectionCard() {
  const { financialProfile } = useContext(FinancialProfileContext);
  
  const [currentIncome, setCurretIncome] = useState(0);
  
  const monthlyProjection = monthlyBalanceProjection(currentIncome, new Date().toISOString(), transactions);

  function formatValue(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  useEffect(() => {
    const currentMonthIncome = financialProfile.income === 0 ? getCurrentMonthSalary(transactions) : financialProfile.income;
    setCurretIncome(currentMonthIncome);
  }, [financialProfile]);

  return (
    <Card className="min-w-[200px] max-w-[450px] min-h-[200px] max-h-[500px]">
      <CardHeader>
        <CardTitle className="text-lg">Projeção Financeira</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-10">
        <div className="flex justify-evenly">
          <div className="flex flex-col items-center text-sm">
            <Wallet />
            <span>Renda do Mês</span>
            <span>{formatValue(Number(currentIncome))}</span>
          </div>
          <div className="flex flex-col items-center text-sm">
            <TrendingDown />
            <span>Gastos Atuais</span>
            <span>{formatValue(monthlyProjection.totalExpensesInPeriod)}</span>
          </div>
          <div className="flex flex-col items-center text-sm">
            <TrendingUp />
            <span>Saldo Atual</span>
            <span>{formatValue(monthlyProjection.currentBalance)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2 border-2 border-zinc-300 rounded-sm">
          <h2>Saldo Projetado fim do mês</h2>
          <p>{formatValue(monthlyProjection.projectedBalance)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
