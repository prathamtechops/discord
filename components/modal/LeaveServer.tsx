"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveServer } from "@/lib/action/servers.action";
import { useModalStore } from "@/store/modal.store";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const LeaveServerModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const data = useModalStore((state) => state.data);

  const isModalOpen = isOpen && type === "leaveServer";

  const [isloading, setIsLoading] = useState(false);

  const pathname = usePathname();

  const handleLeaveServer = async () => {
    if (!data.server || !data.server.id) return;
    try {
      setIsLoading(true);
      const res = await leaveServer(data?.server?.id, pathname);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden ">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {data?.server?.name}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="rounded-md bg-gray-100 dark:bg-gray-800 ">
          <div className="flex w-full items-center justify-between p-3 ">
            <Button variant="ghost" onClick={onClose} disabled={isloading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLeaveServer}
              disabled={isloading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
