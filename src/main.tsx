import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import FinancialProfileProvider from "./context/FinancialProfileProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FinancialProfileProvider>
        <App />
      </FinancialProfileProvider>
    </BrowserRouter>
  </StrictMode>,
);
