import { useContext } from "react";
import FinancialProfileContext from "@/context/FinancialProfileContext";
import SpendingDistributionCard from "./SpendingDistributionCard";
import FinancialScoreCard from "./FinancialScoreCard";

export default function Dashboard() {
      const { financialProfile } = useContext(FinancialProfileContext);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Aqui vem a tela principal</h1>

      {/* TESTE */}
      <p>{JSON.stringify(financialProfile)}</p>

      {/* AREA DE CARDS */}
      <div className="flex gap-10">
        <SpendingDistributionCard />
        <FinancialScoreCard />
      </div>
    </div>
  );
}
