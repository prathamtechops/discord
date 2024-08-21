"use client";
import { useModalStore } from "@/store/modal.store";
import { PlusIcon } from "@radix-ui/react-icons";
import ActionTooltip from "./ActionTooltip";

export const NavigationAction = () => {
  const onOpen = useModalStore((state) => state.onOpen);
  return (
    <div>
      <ActionTooltip label="Create Server" side="right" align="center">
        <button
          onClick={() => onOpen("createServer")}
          className="group flex items-center"
        >
          <div className="mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-3xl bg-background transition-all group-hover:rounded-xl group-hover:bg-emerald-500 dark:bg-neutral-700">
            <PlusIcon className="size-4 text-emerald-500 transition-all group-hover:text-white" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
