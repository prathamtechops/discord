"use client";

import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { GearIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const ServerSttings = ({
  server,
}: {
  server: ServerWithMembersWithProfile;
}) => {
  const onOpen = useModalStore((state) => state.onOpen);

  return (
    <DropdownMenuItem
      onClick={() => onOpen("editServer", { server })}
      className="cursor-pointer px-3 py-2 text-sm "
    >
      Server Settings
      <GearIcon className="ml-auto size-4" />
    </DropdownMenuItem>
  );
};

export default ServerSttings;
