import { Tabs } from "@/frontend/ui/navigation";

export function DashboardLayout({ children, activeTab, setActiveTab }) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full fade-in">
      {children}
    </Tabs>
  );
}


