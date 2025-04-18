"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function updateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  try {
    const interval = parser.parseExpression(cron, { utc: true });
    await prisma.workflow.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        cron: cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("invalid cron expression", error.message);
    throw new Error("Invalid cron expression");
  }

  revalidatePath("/workflows");
}
