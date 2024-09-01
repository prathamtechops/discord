import { ServerForm } from "@/components/server/ServerForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InitialModal = () => {
  return (
    <Dialog open>
      <DialogContent className="overflow-hidden  p-0">
        <DialogHeader className="px-6 py-8">
          <DialogTitle className="text-center text-2xl">
            Customize your server
          </DialogTitle>
          <DialogDescription>
            Give your server a personalized look with a name and a image. You
            can always change it later.
          </DialogDescription>
        </DialogHeader>
        <ServerForm />
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
