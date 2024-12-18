"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function SetupUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId: user.id,
        credits: 100,
      },
    });
  }

  redirect("/");
}
