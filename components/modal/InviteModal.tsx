"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateNewInviteCode } from "@/lib/action/servers.action";
import { useOrigin } from "@/lib/useOrigin";
import { useModalStore } from "@/store/modal.store";
import { CheckIcon, CopyIcon, SymbolIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const InviteModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const data = useModalStore((state) => state.data);

  const isModalOpen = isOpen && type === "invite";

  const origin = useOrigin();
  const pathname = usePathname();

  const [inviteCode, setInviteCode] = useState(data?.server?.inviteCode);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInviteCode(data?.server?.inviteCode);
  }, [data?.server?.inviteCode]);

  const inviteUrl = `${origin}/invite/${inviteCode}`;

  const onCopy = async () => {
    setLoading(true);
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setLoading(false);
    toast.success("Copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  const onNew = async () => {
    setLoading(true);

    if (!data?.server?.id) return;

    try {
      const res = await generateNewInviteCode(data?.server?.id, pathname);
      if (res.success) {
        toast.success(res.message);
        setInviteCode(res.inviteCode);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden  p-0">
        <DialogHeader className="px-6 py-8">
          <DialogTitle className="text-center text-2xl">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Server Invite Link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={loading}
              value={inviteUrl}
              className="border-0 bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
              readOnly
            />
            <Button
              disabled={loading}
              onClick={onCopy}
              size="icon"
              className="bg-transparent hover:bg-background"
            >
              {copied ? (
                <CheckIcon className="size-4 text-emerald-500" />
              ) : (
                <CopyIcon className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={loading}
            variant="link"
            size="sm"
            className="mt-4 text-xs text-muted-foreground"
          >
            Generate a new link
            <SymbolIcon className="ml-2 size-4" />
            {/* <Refrease */}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
