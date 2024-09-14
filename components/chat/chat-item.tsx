import { Member, MemberRole, Profile } from "@prisma/client";
import { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import { roleMap } from "../server/ServerSiderbar";
import Image from "next/image";
import { Edit, File, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { messageSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { deleteMessage, updateMessage } from "@/lib/action/conversation.action";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  channelId: string;
  serverId: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  serverId,
  channelId,
  currentMember,
  isUpdated,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isSelf = currentMember.id === member.id;
  const canbeDeleted = !deleted && (isAdmin || isModerator || isSelf);
  const canbeEdited = !deleted && isSelf && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const pathname = usePathname();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content, form]);

  useEffect(() => {
    setIsDeleted(deleted);
  }, [deleted]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    if (values.content === content || values.content === "") return;

    const oldValue = content;
    form.setValue("content", values.content);

    try {
      const res = await updateMessage(id, serverId, channelId, values);
      if (res.success) {
        toast.success(res.message);
      }
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      form.setValue("content", oldValue);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleted(true);
      form.setValue("content", "This message has been deleted");
      const res = await deleteMessage(id, serverId, channelId, pathname!);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      setIsDeleted(false);
      form.setValue("content", content);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };
  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-center gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-2xl">
          <UserAvatar src={member.profile.imageUrl} className="size-8" />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="relative flex aspect-square
            size-48  items-center overflow-hidden rounded-md border border-muted bg-secondary"
            >
              <Image src={fileUrl} alt="image" fill className="object-cover" />
            </a>
          )}

          {isPDF && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="relative flex aspect-square
            size-12 w-full items-center overflow-hidden rounded-md border border-muted bg-secondary"
            >
              <File className="size-16 text-muted-foreground" />
            </a>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn("text-sm text-muted-foreground", {
                "italic text-sm mt-1 text-muted-foreground/50": isDeleted,
              })}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-slate-400 dark:text-slate-500  ">
                  Edited
                </span>
              )}
            </p>
          )}
          {isEditing && !fileUrl && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            {...field}
                            className="border-0 border-none bg-muted/30 p-2 text-muted-foreground focus:border-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" type="submit">
                  Save
                </Button>
              </form>
              <span className="mx-2 text-[10px] text-slate-400 dark:text-slate-500  ">
                Press Esc to cancel, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canbeDeleted && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-background p-1 group-hover:flex ">
          {canbeEdited && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto size-5 cursor-pointer text-muted-foreground transition hover:text-accent"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={handleDelete}
              className="ml-auto size-5 cursor-pointer text-muted-foreground transition hover:text-accent"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
