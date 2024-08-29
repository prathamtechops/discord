import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import CreateChannelButton from "./CreateChannelAction";
import DeleteServerButton from "./DeleteServerButton";
import InviteButton from "./InviteButton";
import LeaveServerButton from "./LeaveServer";
import ManageMembers from "./ManageMembers";
import ServerSttings from "./ServerSttings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfile;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none " asChild>
        <button className="flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 text-sm font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-900 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDownIcon className="ml-auto size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-2 text-xs font-medium text-black dark:text-muted-foreground">
        {isModerator && <InviteButton server={server} />}
        {isAdmin && (
          <>
            <ServerSttings server={server} />

            <ManageMembers server={server} />
          </>
        )}
        {isModerator && (
          <>
            <CreateChannelButton server={server} />
            <DropdownMenuSeparator />
          </>
        )}

        {isAdmin && <DeleteServerButton server={server} />}

        {!isAdmin && <LeaveServerButton server={server} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
