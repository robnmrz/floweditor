"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function getStatsCardsValue(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const dateRange = periodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId: userId,
      startedAt: {
        gt: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce((acc, execution) => {
    return acc + execution.creditsConsumed;
  }, 0);

  stats.phaseExecutions = executions.reduce((acc, execution) => {
    return acc + execution.phases.length;
  }, 0);

  return stats;
}
