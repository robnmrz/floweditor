import { getWorkflowExecutions } from "@/server/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import TopBar from "../../_component/topbar/topbar";
import ExecutionsTable from "./_components/executions-table";

export default function ExecutionsPage({
  params,
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="w-full h-full overflow-auto">
      <TopBar
        title="All Runs"
        subtitle="List of all your workflow runs"
        workflowId={params.workflowId}
        hideButtons
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full justify-center items-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await getWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>Workflow not found</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex flex-col gap-2 h-full w-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center mb-4">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a run in the editor page by clicking the execute
              button
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
