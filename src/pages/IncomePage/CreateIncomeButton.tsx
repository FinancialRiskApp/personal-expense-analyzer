import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type CreateIncomeButtonProps = {
  onClick: () => void;
};

export default function CreateIncomeButton({ onClick }: CreateIncomeButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="h-11 rounded-2xl bg-sky-700 px-5 text-white hover:bg-sky-800"
    >
      <PlusIcon />
      Nova receita
    </Button>
  );
}
