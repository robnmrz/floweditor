"use client";

import useExecutionPlan from "@/components/hooks/use-execution-plan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  return (
    <Button
      className="flex items-center gap-2"
      variant={"outline"}
      onClick={() => {
        const plan = generate();
        console.log("------ EXECUTION PLAN ------");
        console.table(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}

export default ExecuteButton;
