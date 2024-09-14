import ChatHeader from "@/components/chat/ChatHeader";
import { getConversation } from "@/lib/action/conversation.action";
import { getProfile } from "@/lib/action/profile.action";
import { isServerMember } from "@/lib/action/servers.action";
import { redirect } from "next/navigation";

const ConversationPage = async ({
  params,
}: {
  params: { id: string; memberId: string };
}) => {
  const profile = await getProfile();

  if (!profile) redirect("/");

  const member = await isServerMember(params.id, profile.id);

  if (!member) redirect("/");

  const conversation = await getConversation(profile.id, params.memberId);

  if (!conversation) redirect("/");

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col dark:bg-[#313338]">
      <ChatHeader
        imageURL={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type="conversation"
        serverId={params.id}
        profile={profile}
      />
    </div>
  );
};

export default ConversationPage;
