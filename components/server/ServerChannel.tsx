"use client";

import { cn } from "@/lib/utils";
import { ModalType, useModalStore } from "@/store/modal.store";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../ActionTooltip";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

export const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();
  const onOpen = useModalStore((state) => state.onOpen);

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/server/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full bg-background/10 hover:bg-background/20 transition mb-1",
        params.channelId === channel.id && "bg-indigo-500/25"
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <p
        className={cn(
          "text-sm font-semibold text-muted-foreground transition group-hover:text-muted-foreground/80 truncate",
          params.channelId === channel.id &&
            "text-primary hover:text-muted-foreground"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden size-4 text-muted-foreground/80 group-hover:block "
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden size-4 text-rose-500 group-hover:block "
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <div className="ml-auto flex items-center gap-x-2">
          <Lock className="hidden size-4 text-muted-foreground/80 group-hover:block " />
        </div>
      )}
    </button>
  );
};

export default ServerChannel;
