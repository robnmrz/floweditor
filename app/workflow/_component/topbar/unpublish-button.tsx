"use client";

import { Button } from "@/components/ui/button";
import { unpublishWorkflow } from "@/server/workflows/unpublishWorkflow";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

function UnpublishButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId });
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
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}

export default UnpublishButton;
