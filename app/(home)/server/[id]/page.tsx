import { redirectToGeneral } from "@/lib/action/channels.action";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    id: string;
  };
}
const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const channelId = await redirectToGeneral(params.id);

  if (!channelId) return null;

  if (channelId) {
    redirect(`/server/${params.id}/channels/${channelId}`);
  }

  return <></>;
};

export default ServerIdPage;
