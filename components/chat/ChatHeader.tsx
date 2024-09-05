import { Profile } from "@prisma/client";
import { Hash } from "lucide-react";
import { MobileToggle } from "../MobileToggle";
import SocketIndicator from "../SocketIndicator";
import UserAvatar from "../UserAvatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageURL?: string;
  profile: Profile;
}

const ChatHeader = ({
  serverId,
  name,
  type,
  imageURL,
  profile,
}: ChatHeaderProps) => {
  return (
    <div className="flex h-12 items-center border-b-2 border-neutral-300 px-3 text-sm font-semibold dark:border-neutral-800">
      <MobileToggle profile={profile} serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 size-4 text-muted-foreground" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageURL} className="mr-2 size-8" />
      )}
      <p className="text-sm font-semibold">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
