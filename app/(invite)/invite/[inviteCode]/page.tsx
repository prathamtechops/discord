import { checkUserInServer } from "@/lib/action/invite.action";
import { getProfile } from "@/lib/action/profile.action";
import { redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await getProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!params.inviteCode) {
    redirect("/");
  }

  const res = await checkUserInServer(params.inviteCode, profile.id);

  if (res.success) {
    redirect(`/server/${res.server.id}`);
  }

  return null;
};

export default InvitePage;
