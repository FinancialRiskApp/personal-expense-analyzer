import { useState } from "react";
import FinancialProfileContext from "./FinancialProfileContext.tsx";
import type { FormData } from "@/shemas/FinancialProfile.schema.ts";

interface CartProviderProp {
  children: React.ReactNode;
}
function FinancialProfileProvider({ children }: CartProviderProp) {
  const [financialProfile, setFinancialProfile] = useState<FormData>({
    income: "0",
    riskProfile: "option-1",
  });

  return (
    <FinancialProfileContext.Provider value={{ financialProfile, setFinancialProfile }}>
      {children}
    </FinancialProfileContext.Provider>
  );
}
export default FinancialProfileProvider;
