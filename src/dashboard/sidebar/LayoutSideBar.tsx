import { AppSidebar } from "./AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type LayoutSideBarProps = {
  children: React.ReactNode
}
export default function LayoutSideBar({ children }: LayoutSideBarProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
