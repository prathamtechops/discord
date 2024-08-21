"use client";
import { useOrigin } from "@/lib/useOrigin";
import { useModalStore } from "@/store/modal.store";
import { CheckIcon, CopyIcon, SymbolIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const InviteModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();
  const data = useModalStore((state) => state.data);

  const pathname = usePathname();
  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

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
    try {
      //
    } catch (error) {
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
              value={inviteUrl}
              className="border-0 bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
              readOnly
            />
            <Button
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
