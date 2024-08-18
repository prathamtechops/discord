import { z } from "zod";

export const serverSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  imageUrl: z.string().min(1, "Server image is required"),
});
