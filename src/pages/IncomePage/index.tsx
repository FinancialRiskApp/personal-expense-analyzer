import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CreateIncomeDialog from "./CreateIncomeDialog";
import IncomeHeader from "./IncomeHeader";

export default function IncomePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <section className="space-y-6">
      <IncomeHeader onCreateIncome={() => setIsCreateDialogOpen(true)} />

      <CreateIncomeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </section>
  );
}
