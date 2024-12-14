"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCredentials(form: createCredentialsSchemaType) {
  const { success, data } = createCredentialsSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  //TODO: update encryption to safer standard (comparing hashes client + server)
  const encryptedValue = symmetricEncrypt(data.value);

  const result = await prisma.credential.create({
    data: {
      userId: user.id,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("Failed to create credentials");
  }

  revalidatePath("/credentials");
}
