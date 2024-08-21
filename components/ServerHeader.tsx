import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  AvatarIcon,
  ChevronDownIcon,
  ExitIcon,
  GearIcon,
  PlusCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import InviteButton from "./InviteButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm ">
              Server Settings
              <GearIcon className="ml-auto size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm ">
              Manage Members
              <AvatarIcon className="ml-auto size-4" />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && (
          <>
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm ">
              Create Channel
              <PlusCircledIcon className="ml-auto size-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {isAdmin && (
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 ">
            Delete Server
            <TrashIcon className="ml-auto size-4" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 ">
            Leave Server
            <ExitIcon className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
