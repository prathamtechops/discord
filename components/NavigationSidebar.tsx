import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/action/profile.action";
import { getServers } from "@/lib/action/servers.action";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { NavigationAction } from "./NavigationAction";
import { NavigationItem } from "./NavigationItem";
import { ScrollArea } from "./ui/scroll-area";

const NavigationSidebar = async () => {
  const profile = await getProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const servers = await getServers(profile.id);

  return (
    <div className="flex size-full flex-col items-center space-y-4 py-3 text-primary dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {servers
          ? servers.map((server) => (
              <div key={server.id} className="mb-4">
                <NavigationItem
                  id={server.id}
                  imageUrl={server.imageUrl}
                  name={server.name}
                />
              </div>
            ))
          : null}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "rounded-full w-[48px] h-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
