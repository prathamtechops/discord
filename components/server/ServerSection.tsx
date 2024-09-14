"use client";

import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { PlusIcon, Settings } from "lucide-react";
import ActionTooltip from "../ActionTooltip";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfile;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const onOpen = useModalStore((state) => state.onOpen);

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { server, channelType })}
            className="text-muted-foreground transition hover:text-foreground/50"
          >
            <PlusIcon className="size-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-muted-foreground transition hover:text-foreground/50"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
