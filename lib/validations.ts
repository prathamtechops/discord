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
    .refine((name) => name !== "general", {
      message: "general is reserved",
    }),
  type: z.nativeEnum(ChannelType),
});

export const messageSchema = z.object({
  content: z.string().min(1),
});

export const fileUploadSchema = z.object({
  fileUrl: z.string().min(1, "Attachement is requird"),
});
