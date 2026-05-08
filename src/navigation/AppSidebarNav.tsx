import { Landmark, LayoutDashboard, ReceiptText } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/renda",
    label: "Renda",
    icon: Landmark,
  },
  {
    to: "/gastos",
    label: "Gastos",
    icon: ReceiptText,
  },
];

export default function AppSidebarNav() {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-0 bg-[linear-gradient(180deg,#123c61_0%,#0f2d4b_100%)]"
    >
      <SidebarHeader className="px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
            <div className="size-4 rounded-full border-4 border-cyan-300 border-r-transparent" />
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-white">InPay</p>
            <p className="text-xs text-slate-300">Controle financeiro</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <NavLink to={item.to}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-11 rounded-2xl px-4 text-slate-200 hover:bg-white/10 hover:text-white data-[active=true]:bg-white data-[active=true]:text-slate-900"
                      >
                        <span>
                        <item.icon className={isActive ? "text-sky-600" : "text-slate-300"} />
                        <span className="font-medium">{item.label}</span>
                        </span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-5">
        <SidebarSeparator className="mx-0 bg-white/10" />
        <div className="rounded-2xl bg-white/5 px-4 py-4">
          <p className="text-sm font-medium text-white">Painel financeiro</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Navegue entre visão geral, entradas e despesas.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
