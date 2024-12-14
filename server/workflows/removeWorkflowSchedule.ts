"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function removeWorkflowSchedule(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }

  await prisma.workflow.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath("/workflows");
}
