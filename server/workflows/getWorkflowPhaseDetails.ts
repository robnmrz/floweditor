"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getWorkflowPhaseDetails(phaseId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }

  // here we need to join the tables ExecutionPhase and WorkflowExection as user id
  // is only available in WorkflowExecution
  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      // join
      execution: {
        userId: user.id,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}
