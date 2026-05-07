import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserAvatar from "./UserAvatar";
import { FinancialProfileForm } from "./FinancialProfileForm";

export function AppSidebar() {
  return (
    <Sidebar className="p-2">
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
