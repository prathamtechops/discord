"use server";

import { MemberRole } from "@prisma/client";
import { z } from "zod";
import { db } from "../db";
import { channelSchema } from "../validations";
import { getProfile } from "./profile.action";

export const createChannel = async (
  serverId: string | undefined,
  values: z.infer<typeof channelSchema>,
  pathname: string
) => {
  try {
    const validateForm = channelSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    if (!serverId) throw new Error("Server not found");

    const profile = await getProfile();
    if (!profile) throw new Error("Unauthorized");

    const { name, type } = validateForm.data;

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) throw new Error("Failed to create channel");

    return {
      success: true,
      message: "Channel created successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
