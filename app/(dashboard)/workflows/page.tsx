import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserWorkflows } from "@/server/workflows/getUserWorkflows";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Suspense } from "react";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import WorkflowCard from "./_components/workflow-card";

function WorkflowsPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Create and manage your workflows
          </p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        {/* Suspence takes something async and while rendering it will show
        the fallback */}
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await getUserWorkflows();

  // handle error on server side
  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflows created yet</p>
          <p className="text-sm text-muted-foreground">
            Get started by creating a new workflow. Click the button below to
            create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

export default WorkflowsPage;
