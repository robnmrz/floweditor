"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCredentialsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.credential.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
