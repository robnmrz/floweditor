"use client";

import useExecutionPlan from "@/components/hooks/use-execution-plan";
import { Button } from "@/components/ui/button";
import { publishWorkflow } from "@/server/workflows/publishWorkflow";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

function PublishButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <Button
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      variant={"outline"}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // client side validation to prevent
          // calling the run function
          return;
        }

        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}

export default PublishButton;
