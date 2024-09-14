import InitialModal from "@/components/modal/InitialModal";
import { initialProfile } from "@/lib/action/profile.action";
import { getUserServers } from "@/lib/action/servers.action";
import { redirect } from "next/navigation";

const Home = async () => {
  const profile = await initialProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const server = await getUserServers(profile?.id);

  if (server) {
    redirect(`/server/${server.id}`);
  }

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default Home;
