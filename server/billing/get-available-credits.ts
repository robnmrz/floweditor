"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getAvailableCredits() {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!balance) return -1;
  return balance.credits;
}
