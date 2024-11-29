"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserWorkflows() {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
