import transactions from "../../database/transactions.json";

import { useContext } from "react";
import FinancialProfileContext from "@/context/FinancialProfileContext";

import SpendingDistributionCard from "./cards/SpendingDistributionCard";
import FinancialScoreCard from "./cards/FinancialScoreCard";
import FinancialProjectionCard from "./cards/FinancialProjectionCards";
import RiskAlertsCard from "./cards/RiskAlertsCard";
import SmartInsightsCard from "./cards/SmartInsightsCard";

import { detectUnusualExpenses } from "../utils/detectUnusualExpenses";
import { generateRiskAlerts } from "../utils/generateRiskAlerts";
import { calculateFinancialScore } from "../utils/calculateFinancialScore";

export default function Dashboard() {
  const { financialProfile } = useContext(FinancialProfileContext);

  const rendaMensal = Number(financialProfile?.income) || 0;

  const unusualExpenses = detectUnusualExpenses(transactions as any);
  const riskAlerts = generateRiskAlerts(transactions as any);

  const financialScore = calculateFinancialScore(transactions as any, rendaMensal);

  return (
    <div className="flex flex-wrap gap-5 w-full mx-auto h-full">
      <SpendingDistributionCard />

      <FinancialScoreCard financialScore={financialScore} />

      <FinancialProjectionCard />

      <RiskAlertsCard alerts={riskAlerts} />

      <SmartInsightsCard unusualExpenses={unusualExpenses} financialScore={financialScore} />
    </div>
  );
}
