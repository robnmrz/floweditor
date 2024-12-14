"use client";

import CustomDialogHeader from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";
import { createCredentials } from "@/server/credentials/create-credentials";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ShieldEllipsisIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function CreateCredentialsDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialsSchemaType>({
    resolver: zodResolver(createCredentialsSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCredentials,
    onSuccess: () => {
      toast.success("Credentials created", { id: "create-credentials" });
      form.reset();
      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Failed to create credentials", { id: "create-credentials" });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialsSchemaType) => {
      toast.loading("Creating credentials...", { id: "create-credentials" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={ShieldEllipsisIcon}
          title="Create credentials"
        ></CustomDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique and descriptive name for your credentials.
                      <br />
                      This name will be used to identify your credentials.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value assiciated with these credentials.
                      <br />
                      This value will securely encrypted and stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Create Credentials"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCredentialsDialog;
