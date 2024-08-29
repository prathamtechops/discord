"use client";

import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { AvatarIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";

function ManageMembers({ server }: { server: ServerWithMembersWithProfile }) {
  const onOpen = useModalStore((state) => state.onOpen);

  return (
    <DropdownMenuItem
      onClick={() => onOpen("members", { server })}
      className="cursor-pointer px-3 py-2 text-sm "
    >
      Manage Members
      <AvatarIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  );
}

export default ManageMembers;
