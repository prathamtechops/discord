import { getServerChannels } from "@/lib/action/servers.action";
import { ChannelType, Profile } from "@prisma/client";
import { ServerHeader } from "./ServerHeader";

interface ServerSidebarProps {
  serverId: string;
  profile: Profile;
}

const ServerSiderbar = async ({ serverId, profile }: ServerSidebarProps) => {
  if (!profile) {
    return null;
  }

  const server = await getServerChannels(serverId);

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const voiceChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex size-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSiderbar;
