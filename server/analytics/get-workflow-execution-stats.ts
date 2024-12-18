"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { currentUser } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number; failed: number }>;

export async function getWorkflowExecutionStats(period: Period) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const dateRange = periodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId: user.id,
      startedAt: {
        gt: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  // for reference this is how each day object needs
  // to look like
  // [
  //   {
  //     "2024-08-01": {
  //       success: 22,
  //       failed: 4,
  //     },
  //   },
  // ];

  // NOTE: one could get statisics for each day
  // directly via database queries but in this way it's depended to the database ones using

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
