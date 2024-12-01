"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  // prevent updating workflow that is published
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft status");
  }

  await prisma.workflow.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      definition: definition,
    },
  });

  revalidatePath("/workflows");
}
