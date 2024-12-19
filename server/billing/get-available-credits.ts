"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAvailableCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!balance) return -1;
  return balance.credits;
}
