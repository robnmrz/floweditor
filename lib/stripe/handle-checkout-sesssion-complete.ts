import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  // print event to file
  // writeFile("session_completed.json", JSON.stringify(event), (err) => {});
  if (!event.metadata) {
    throw new Error("event.metadata missing");
  }

  const { userId, packId } = event.metadata;

  if (!userId || !packId) {
    throw new Error("userId or packId missing");
  }

  const purchasedPack = getCreditsPack(packId as PackId);

  if (!purchasedPack) {
    throw new Error("purchasedPack not found");
  }

  // upsert increments updates credits if existing otherwise
  // will create with the purchased credits
  await prisma.userBalance.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId: userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId: userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
}
