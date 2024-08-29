"use client";
import FileUploadInput from "@/components/FileUploadInput";
import InputField from "@/components/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { createServer } from "@/lib/action/servers.action";
import { serverSchema } from "@/lib/validations";
import { useModalStore } from "@/store/modal.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateServerModal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const type = useModalStore((state) => state.type);
  const onClose = useModalStore((state) => state.onClose);
  const isModalOpen = isOpen && type === "createServer";

  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const pathname = usePathname();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof serverSchema>) {
    try {
      const res = await createServer(values, pathname);
      if (res.success) {
        toast.success(res.message);
      }
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-6"
          >
            <FileUploadInput name="imageUrl" label="serverImage" form={form} />

            <InputField
              name="name"
              form={form}
              label="Server Name"
              placeholder="Server Name"
            />
            <DialogFooter>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
