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
      className="h-11 rounded-2xl bg-green-700 px-5 text-white hover:bg-green-800"
    >
      <PlusIcon />
      Nova entrada
    </Button>
  );
}
