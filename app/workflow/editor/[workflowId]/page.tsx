import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Editor from "../../_component/editor";

async function WorkflowEditorPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const { workflowId } = params;
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: user.id,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow} />;
}

export default WorkflowEditorPage;
