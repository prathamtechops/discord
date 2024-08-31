"use client";

import { cn } from "@/lib/utils";
import { ChannelType, Member, Profile, Server } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import { useParams } from "next/navigation";
import { roleMap } from "./ServerSiderbar";
import UserAvatar from "./UserAvatar";

interface ServerMemberProps {
  server: Server;
  member: Member & { profile: Profile };
}

export const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();

  const icon = roleMap[member.role];

  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full bg-background/10 hover:bg-background/20 transition mb-1",
        params?.memberId === member.id && "bg-background/30"
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="size-6" />
      <p
        className={cn(
          "text-sm font-semibold text-muted-foreground transition group-hover:text-muted-foreground/80 truncate",
          params?.channelId === member.id &&
            "text-primary hover:text-muted-foreground"
        )}
      >
        {member.profile.name}
      </p>
      {icon && (
        <span className="ml-auto flex items-center gap-x-2">{icon}</span>
      )}
    </button>
  );
};

export default ServerMember;
