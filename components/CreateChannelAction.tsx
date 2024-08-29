"use client";
import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";

function CreateChannelButton({
  server,
}: {
  server: ServerWithMembersWithProfile;
}) {
  const onOpen = useModalStore((state) => state.onOpen);

  return (
    <DropdownMenuItem
      onClick={() => onOpen("createChannel", { server })}
      className="cursor-pointer px-3 py-2 text-sm "
    >
      Create Channel
      <PlusCircledIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  );
}

export default CreateChannelButton;
