"use client";

import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal.store";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams } from "next/navigation";
import ActionTooltip from "./ActionTooltip";

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
  // const router = useRouter();
  const params = useParams();
  const onOpen = useModalStore((state) => state.onOpen);

  const Icon = iconMap[channel.type];

  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full bg-background/10 hover:bg-background/20 transition mb-1",
        params.channelId === channel.id && "bg-background/30"
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
              onClick={() => onOpen("editChannel", { server, channel })}
              className="hidden size-4 text-muted-foreground/80 group-hover:block "
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteChannel", { server, channel })}
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
