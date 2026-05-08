import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "@/layouts/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import ExpensesPage from "@/pages/ExpensesPage";
import IncomePage from "@/pages/IncomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/renda" element={<IncomePage />} />
        <Route path="/gastos" element={<ExpensesPage />} />
      </Route>
    </Routes>
  );
}
