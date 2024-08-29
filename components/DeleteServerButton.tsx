"use client";

import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { TrashIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

function DeleteServerButton({
  server,
}: {
  server: ServerWithMembersWithProfile;
}) {
  const onOpen = useModalStore((state) => state.onOpen);
  return (
    <>
      <DropdownMenuItem
        onClick={() => onOpen("deleteServer", { server })}
        className="cursor-pointer px-3 py-2 text-sm text-rose-500 "
      >
        Delete Server
        <TrashIcon className="ml-auto size-4" />
      </DropdownMenuItem>
    </>
  );
}

export default DeleteServerButton;
