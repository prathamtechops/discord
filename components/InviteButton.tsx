"use client";
import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { PlusIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const InviteButton = ({ server }: { server: ServerWithMembersWithProfile }) => {
  const onOpen = useModalStore((state) => state.onOpen);

  return (
    <DropdownMenuItem
      onClick={() => onOpen("invite", { server })}
      className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
    >
      Invite People
      <PlusIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  );
};

export default InviteButton;
