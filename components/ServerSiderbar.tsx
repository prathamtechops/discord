import { getServerChannels } from "@/lib/action/servers.action";
import { ChannelType, MemberRole, Profile } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerChannel from "./ServerChannel";
import { ServerHeader } from "./ServerHeader";
import ServerMember from "./ServerMember";
import ServerSearch from "./ServerSearch";
import ServerSection from "./ServerSection";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface ServerSidebarProps {
  serverId: string;
  profile: Profile;
}

export const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};

export const roleMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 size-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="mr-2 size-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

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
      <ScrollArea className="flex-1 px-3 ">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: voiceChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  icon: roleMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-muted" />
        {!!textChannels?.length && (
          <>
            <div className="mb-2">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.TEXT}
                role={role}
                label="Text Channels"
                server={server}
              />
              <div className="space-y-0.5">
                {textChannels.map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={role}
                    server={server}
                  />
                ))}
              </div>
            </div>

            {!!voiceChannels?.length && (
              <div className="mb-2">
                <ServerSection
                  sectionType="channels"
                  channelType={ChannelType.AUDIO}
                  role={role}
                  label="Voice Channels"
                  server={server}
                />
                <div className="space-y-0.5">
                  {voiceChannels.map((channel) => (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      role={role}
                      server={server}
                    />
                  ))}
                </div>
              </div>
            )}

            {!!videoChannels?.length && (
              <div className="mb-2">
                <ServerSection
                  sectionType="channels"
                  channelType={ChannelType.VIDEO}
                  role={role}
                  label="Video Channels"
                  server={server}
                />

                <div className="space-y-0.5">
                  {videoChannels.map((channel) => (
                    <ServerChannel
                      key={channel.id}
                      channel={channel}
                      role={role}
                      server={server}
                    />
                  ))}
                </div>
              </div>
            )}

            {!!members?.length && (
              <div className="mb-2">
                <ServerSection
                  sectionType="members"
                  role={role}
                  label="Members"
                  server={server}
                />
                <div className="space-y-0.5">
                  {members.map((member) => (
                    <ServerMember
                      key={member.id}
                      member={member}
                      server={server}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSiderbar;
