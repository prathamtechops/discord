import { getProfile } from "@/lib/action/profile.action";
import { getServers } from "@/lib/action/servers.action";
import { redirect } from "next/navigation";

const NavigationSidebar = async () => {
  const profile = await getProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const servers = await getServers(profile.id);

  return (
    <div className="flex size-full flex-col items-center space-y-4 py-3 text-primary dark:bg-[#1E1F22]">
      NavigationSidebar
    </div>
  );
};

export default NavigationSidebar;
