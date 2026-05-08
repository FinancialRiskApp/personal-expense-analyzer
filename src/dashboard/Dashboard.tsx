import SpendingDistributionCard from "./cards/SpendingDistributionCard";
import FinancialScoreCard from "./cards/FinancialScoreCard";
import FinancialProjectionCard from "./cards/FinancialProjectionCards";
import RiskAlertsCard from "./cards/RiskAlertsCard";
import SmartInsightsCard from "./cards/SmartInsightsCard";

export default function Dashboard() {
     
  return (
    <div className="flex flex-wrap gap-5 w-full mx-auto h-full">
      
        <SpendingDistributionCard />
        <FinancialScoreCard />
        <FinancialProjectionCard />
        <RiskAlertsCard />
        <SmartInsightsCard />
      
    </div>
  );
}
