import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import ChatHeader from "@/components/chat/ChatHeader";
import { getChannel } from "@/lib/action/channels.action";
import { redirect } from "next/navigation";

const ChannelIDPage = async ({
  params,
}: {
  params: {
    id: string;
    channelId: string;
  };
}) => {
  const res = await getChannel(params.id, params.channelId);

  if (!res) redirect("/");

  const { channel, member, profile } = res;

  if (!member || !channel) redirect("/");

  return (
    <div className="flex h-full flex-col dark:bg-[#313338]">
      <ChatHeader
        profile={profile}
        name={channel.name}
        type="channel"
        serverId={params.id}
      />
      <ChatMessages
        member={member}
        name={channel.name}
        type="channel"
        serverId={channel.serverId}
        chatId={channel.id}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        channelId={params.channelId}
        serverId={params.id}
      />
    </div>
  );
};

export default ChannelIDPage;
