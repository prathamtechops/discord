import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Profile } from "@prisma/client";
import { Menu } from "lucide-react";
import NavigationSidebar from "./NavigationSidebar";
import ServerSiderbar from "./server/ServerSiderbar";
import { Button } from "./ui/button";

export function MobileToggle({
  serverId,
  profile,
}: {
  serverId: string;
  profile: Profile;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSiderbar profile={profile} serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
