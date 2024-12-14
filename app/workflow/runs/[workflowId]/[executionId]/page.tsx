import TopBar from "@/app/workflow/_component/topbar/topbar";
import { getWorkflowExecutionWithPhases } from "@/server/workflows/getWorkflowExecutionWithPhases";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/execution-viewer";

function ExecutionViewerPage({
  params,
}: {
  params: { executionId: string; wokflowId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workflowId={params.wokflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Workflow not found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}

export default ExecutionViewerPage;
