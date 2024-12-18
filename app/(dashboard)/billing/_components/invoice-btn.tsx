"use client";

import { Button } from "@/components/ui/button";
import { downloadInvoice } from "@/server/billing/download-invoice";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function InvoiceBtn({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (data) => {
      window.location.href = data as string;
    },
    onError: () => {
      toast.error("Failed to download invoice");
    },
  });
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate(id);
      }}
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
    </Button>
  );
}
