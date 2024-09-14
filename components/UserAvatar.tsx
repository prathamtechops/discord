import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

const UserAvatar = ({
  className,
  src,
}: {
  className?: string;
  src?: string;
}) => {
  return (
    <Avatar className={cn("h-7 w-7 md:size-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
