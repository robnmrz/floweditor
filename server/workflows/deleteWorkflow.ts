"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(id: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  await prisma.workflow.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  revalidatePath("/workflows");
}
