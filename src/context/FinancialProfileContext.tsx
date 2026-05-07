import { createContext } from "react";
import type { FormData } from "@/shemas/FinancialProfile.schema.ts";

interface ProviderContextProps {
  financialProfile: FormData;
  setFinancialProfile: React.Dispatch<React.SetStateAction<FormData>>;
}

const FinancialProfileContext = createContext<ProviderContextProps>({} as ProviderContextProps);

export default FinancialProfileContext;
