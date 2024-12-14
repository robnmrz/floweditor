"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteCredentials(name: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId: user.id,
        name: name,
      },
    },
  });

  revalidatePath("/credentials");
}
