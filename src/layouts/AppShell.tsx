import { Outlet, useLocation } from "react-router-dom";

import AppSidebarNav from "@/navigation/AppSidebarNav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const pageCopy = {
  "/dashboard": {
    title: "Dashboard",
    description: "Visão geral da sua atividade financeira.",
  },
  "/renda": {
    title: "Renda",
    description: "Acompanhe suas entradas e o histórico de recebimentos.",
  },
  "/gastos": {
    title: "Gastos",
    description: "Monitore despesas e organize suas saídas financeiras.",
  },
} as const;

export default function AppShell() {
  const location = useLocation();
  const pageInfo = pageCopy[location.pathname as keyof typeof pageCopy] ?? pageCopy["/dashboard"];

  return (
    <SidebarProvider defaultOpen>
      <AppSidebarNav />

      <SidebarInset className="min-h-svh bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
        <div className="flex min-h-svh flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-start gap-3">
              <SidebarTrigger className="mt-0.5 md:hidden" />

              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{pageInfo.title}</h1>
                <p className="text-sm text-slate-500">{pageInfo.description}</p>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
