"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { changeMemberRole, kickMember } from "@/lib/action/members.action";
import { useModalStore } from "@/store/modal.store";
import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  Check,
  Gavel,
  Loader2,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../UserAvatar";

const roleIcon = {
  GUEST: null,
  MODERATOR: "👮",
  ADMIN: "👑",
};

const MembersModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const data = useModalStore((state) => state.data);

  const { server } = data as { server: ServerWithMembersWithProfile };

  const [loadingId, setLoading] = useState("");
  const [localMembers, setLocalMembers] = useState(server?.members);

  const pathname = usePathname();

  const isModalOpen = isOpen && type === "members";

  useEffect(() => {
    if (server) {
      setLocalMembers(server.members);
    }
  }, [server]);

  const onRoleChange = async (memberId: string, newRole: MemberRole) => {
    const originalRole = localMembers.find((member) => member.id === memberId)
      ?.role as MemberRole;

    setLocalMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );

    setLoading(memberId);
    try {
      const res = await changeMemberRole(
        server.id,
        memberId,
        newRole,
        pathname as string
      );

      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );

      setLocalMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, role: originalRole } : member
        )
      );
    } finally {
      setLoading("");
    }
  };

  const kickMemberFromServer = async (memberId: string) => {
    const originalMembers = [...localMembers];

    setLocalMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId)
    );

    setLoading(memberId);
    try {
      const res = await kickMember(server.id, memberId, pathname as string);

      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );

      setLocalMembers(originalMembers);
    } finally {
      setLoading("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden  ">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {localMembers?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[calc(100vh-24rem)] pr-6">
          {localMembers?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-2 ">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-1 text-xs font-semibold">
                  {member.profile.name} {roleIcon[member.role]}
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <DotsVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center justify-between">
                            <ShieldQuestion className="mr-2 size-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="mr-2 size-4" />
                                <span className="text-xs">Guest</span>
                                {member.role === MemberRole.GUEST && (
                                  <Check className="ml-auto size-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="mr-2 size-4" />
                                <span className="text-xs">Moderator</span>
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className="ml-auto size-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => kickMemberFromServer(member.id)}
                        >
                          <Gavel className="mr-2 size-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
