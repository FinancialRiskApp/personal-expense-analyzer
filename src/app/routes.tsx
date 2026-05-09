import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "@/layouts/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import TransactionsPage from "@/pages/TransactionsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transacoes" element={<TransactionsPage />} />
      </Route>
    </Routes>
  );
}
