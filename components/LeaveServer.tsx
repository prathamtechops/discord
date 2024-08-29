"use client";

import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { ExitIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";

function LeaveServerButton({
  server,
}: {
  server: ServerWithMembersWithProfile;
}) {
  const onOpen = useModalStore((state) => state.onOpen);
  return (
    <>
      <DropdownMenuItem
        onClick={() => onOpen("leaveServer", { server })}
        className="cursor-pointer px-3 py-2 text-sm text-rose-500 "
      >
        Leave Server
        <ExitIcon className="ml-auto size-4" />
      </DropdownMenuItem>
    </>
  );
}

export default LeaveServerButton;
