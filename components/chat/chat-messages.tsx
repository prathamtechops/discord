"use client";
import useChatQuery from "@/hooks/use-chat-query";
import { Member, Message, Profile } from "@prisma/client";
import { Hash, Loader2 } from "lucide-react";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ChatItem } from "./chat-item";
import { useSocket } from "../socket-provider";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  serverId: string;
  type: "channel" | "conversation";
}

type MesssagesWithMember = Message & {
  member: Member & { profile: Profile };
};

const ChatMessages = ({
  name,
  member,
  chatId,
  paramKey,
  serverId,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useChatQuery(paramKey, paramValue);

  const { socket } = useSocket();

  const [messages, setMessages] = useState<MesssagesWithMember[]>([]);

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const loadMoreRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    if (data) {
      setMessages(data.pages as MesssagesWithMember[]);
    }
  }, [data]);

  useEffect(() => {
    const chatContainer = chatRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [data, messages]);

  useEffect(() => {
    if (!socket) return;

    const channelKey = `chat:${chatId}:messages`;

    socket.on(channelKey, (message: MesssagesWithMember) => {
      setMessages((prev) => [message, ...prev]);
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.off(channelKey);
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [chatId, socket]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <div className="flex-1">Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {hasNextPage && <div ref={loadMoreRef} className="h-1" />}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center">
          <Loader2 className="size-4 animate-spin text-zinc-500" />
        </div>
      )}

      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      <div className="flex flex-col-reverse">
        {messages.map((message) => (
          <ChatItem
            key={message.id}
            id={message.id}
            content={message.content}
            member={message.member}
            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
            fileUrl={message.fileUrl}
            deleted={message.deleted}
            currentMember={member}
            serverId={serverId}
            channelId={paramValue}
            isUpdated={message.edited}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;

const ChatWelcome = ({
  type,
  name,
}: {
  type: "channel" | "conversation";
  name: string;
}) => {
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === "channel" && (
        <div className="flex size-[75px] items-center justify-center rounded-full bg-muted/80">
          <Hash className="size-12 text-foreground" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-muted-foreground">
        {type === "channel"
          ? `This is the start of the #${name} channel`
          : `This is the start of your conversation with  ${name}`}
      </p>
    </div>
  );
};
