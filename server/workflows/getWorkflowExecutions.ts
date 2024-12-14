"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getWorkflowExecutions(workflowId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId: workflowId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
