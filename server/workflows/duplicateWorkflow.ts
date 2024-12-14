"use server";

import prisma from "@/lib/prisma";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId: user.id,
    },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  revalidatePath("/workflows");
}
