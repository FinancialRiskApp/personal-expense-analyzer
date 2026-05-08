import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserAvatar from "../financialProfile/UserAvatar";
import { FinancialProfileForm } from "../financialProfile/FinancialProfileForm";

export function AppSidebar() {
  return (
    <Sidebar className="py-2 px-5 w-74">
      <SidebarHeader>
        <h1 className="font-extrabold">Dashboard Risco Financeiro</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <UserAvatar />
        </SidebarGroup>
        <SidebarGroup />
          <FinancialProfileForm />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
