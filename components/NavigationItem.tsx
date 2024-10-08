"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "./ActionTooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip label={name} side="right" align="center">
      <button
        onClick={() => router.push(`/server/${id}`)}
        className="group  flex items-center"
      >
        <div
          className={cn(
            " left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.id !== id && "group-hover:h-[20px]",
            params?.id === id ? "h-[36px]" : "h-[8px]"
          )}
        ></div>
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-2xl transition-all overflow-hidden",
            params.id === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};
