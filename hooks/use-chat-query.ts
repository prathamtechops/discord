"use client";

import { messages } from "@/lib/action/conversation.action";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useChatQuery = (
  paramKey: "channelId" | "conversationId",
  paramValue: string
) => {
  const fetchMessage = async ({
    pageParam,
  }: {
    pageParam: string | undefined;
  }) => {
    const res = await messages(paramKey, paramValue, pageParam);
    return res;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [paramKey, paramValue],
    queryFn: fetchMessage,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    select: (data) => ({
      pages: data?.pages?.flatMap((page) => page?.items ?? []),
      pageParams: data?.pageParams,
    }),
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  };
};

export default useChatQuery;
