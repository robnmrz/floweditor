"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserPurchaseHistory() {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }
  return prisma.userPurchase.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });
}
