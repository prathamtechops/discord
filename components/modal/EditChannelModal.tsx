"use client";
import InputField from "@/components/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateChannel } from "@/lib/action/channels.action";
import { channelSchema } from "@/lib/validations";
import { useModalStore } from "@/store/modal.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const EditChannelModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const isModalOpen = isOpen && type === "editChannel";
  const { server, channel } = useModalStore((state) => state.data);

  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: channel?.name,
      type: channel?.type,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const pathname = usePathname();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof channelSchema>) {
    try {
      if (!server?.id) throw new Error("Server not found");

      if (!channel?.id) throw new Error("Channel not found");

      const res = await updateChannel(
        channel?.id,
        server?.id,
        values,
        pathname
      );
      if (res.success) {
        toast.success(res.message);
      }
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden  p-0">
        <DialogHeader className="px-6 py-8">
          <DialogTitle className="text-center text-2xl">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6"
          >
            <InputField
              name="name"
              form={form}
              label="Channel Name"
              placeholder="Channel Name"
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tyoe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                      <SelectItem value={ChannelType.AUDIO}>Audio</SelectItem>
                      <SelectItem value={ChannelType.VIDEO}>Video</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
