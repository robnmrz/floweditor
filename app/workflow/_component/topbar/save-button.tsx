"use client";

import { Button } from "@/components/ui/button";
import { updateWorkflow } from "@/server/workflows/updateWorkflow";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400 " />
      Save
    </Button>
  );
}

export default SaveButton;