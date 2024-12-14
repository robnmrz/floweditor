"use client";

import { Button } from "@/components/ui/button";
import { runWorkflow } from "@/server/workflows/runWorkflow";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

export default function RunButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Workflow run successfully", { id: workflowId });
    },
    onError: () => {
      toast.error("Failed to run workflow", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run workflow...", { id: workflowId });
        mutation.mutate({ workflowId: workflowId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}
