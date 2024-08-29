import { ChannelType } from "@prisma/client";
import { z } from "zod";

export const serverSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  imageUrl: z.string().min(1, "Server image is required"),
});

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Channel Name is required")
    .refine((name) => name !== "General", {
      message: "General is reserved",
    }),
  type: z.nativeEnum(ChannelType),
});
