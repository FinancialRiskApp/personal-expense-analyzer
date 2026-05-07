import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FinancialProfileProvider from "./context/FinancialProfileProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FinancialProfileProvider>
      <App />
    </FinancialProfileProvider>
  </StrictMode>,
);
