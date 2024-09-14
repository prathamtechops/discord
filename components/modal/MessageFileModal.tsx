"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { fileUploadSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FileUploadInput from "../FileUploadInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Plus } from "lucide-react";
import { sendFile } from "@/lib/action/conversation.action";
import { useSocket } from "../socket-provider";

const ManageFileModal = ({
  serverId,
  channelId,
}: {
  serverId: string | undefined;
  channelId: string | undefined;
}) => {
  const form = useForm<z.infer<typeof fileUploadSchema>>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const { socket } = useSocket();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof fileUploadSchema>) {
    if (!serverId || !channelId) return;

    try {
      const res = await sendFile(channelId, serverId, values);

      socket.server.io.emit(res?.channelKey, res?.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute left-8 top-7 flex size-[24px] items-center justify-center rounded-full bg-muted/80 p-1 transition hover:bg-muted/40"
        >
          <Plus className="text-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden  p-0">
        <DialogHeader className="px-6 py-8">
          <DialogTitle className="text-center text-2xl">
            Add a attachment
          </DialogTitle>
          <DialogDescription>Send a file as a message</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6"
          >
            <FileUploadInput name="fileUrl" label="messageFile" form={form} />

            <DialogFooter>
              <Button variant="primary" type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageFileModal;
