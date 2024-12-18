"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function purchaseCredits(packId: PackId) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid pack selected");
  }

  const priceId = selectedPack?.priceId;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: { enabled: true },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      // this way stripe sends pack the metadata after a purchase so we can use it
      userId: user.id,
      packId: packId,
    },
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}
