"use client";
import { messageSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useSocket } from "../socket-provider";
import { sendMessageToChannel } from "@/lib/action/conversation.action";
import ManageFileModal from "../modal/MessageFileModal";
import EmojiPicker from "../EmojiPicker";

interface ChatInputProps {
  channelId?: string;
  serverId?: string;
  memberId?: string;
  name: string;
  type: "channel" | "conversation";
}

const ChatInput = ({ channelId, serverId, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { socket } = useSocket();

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    if (!channelId || !serverId) return;

    try {
      const res = await sendMessageToChannel(channelId, serverId, values);

      if (res?.channelKey && res?.message) {
        if (socket?.connected) {
          socket.emit("chat:messages", res.message);
        }
      }

      form.reset();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <ManageFileModal serverId={serverId} channelId={channelId} />
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    className="rounded-lg border-0 border-none bg-muted/30 px-14 py-6 text-muted-foreground focus-visible:outline-none  focus-visible:ring-0 "
                  />
                  <div className="absolute right-8 top-7 ">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
