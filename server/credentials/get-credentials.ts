"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCredentialsForUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return prisma.credential.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
  });
}
