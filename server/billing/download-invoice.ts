"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function downloadInvoice(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      userId: user.id,
      id: id,
    },
  });

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);
  if (!session) {
    throw new Error("Invoice not found");
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string);

  return invoice.hosted_invoice_url;
}
