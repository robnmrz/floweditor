"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function SetupUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId: userId,
        credits: 100,
      },
    });
  }

  redirect("/");
}
