"use client";

import { createServer } from "@/lib/action/servers.action";
import { serverSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FileUploadInput from "../FileUploadInput";
import InputField from "../InputField";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";

export const ServerForm = () => {
  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const pathname = usePathname();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof serverSchema>) {
    try {
      const res = await createServer(values, pathname);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6">
        <FileUploadInput name="imageUrl" label="serverImage" form={form} />

        <InputField
          name="name"
          form={form}
          label="Server Name"
          placeholder="Server Name"
        />
        <DialogFooter>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
