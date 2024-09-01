"use server";

import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
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

    revalidatePath(pathname);

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

export const deleteChannel = async (
  channelId: string,
  serverId: string,
  pathname: string
) => {
  try {
    const profile = await getProfile();
    if (!profile) throw new Error("Unauthorized");

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
          delete: {
            id: channelId,
          },
        },
      },
    });

    if (!server) throw new Error("Failed to delete channel");

    revalidatePath(pathname);

    return {
      success: true,
      message: "Channel deleted successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const updateChannel = async (
  channelId: string,
  serverId: string,
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
          update: {
            where: {
              id: channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    if (!server) throw new Error("Failed to update channel");

    revalidatePath(pathname);

    return {
      success: true,
      message: "Channel updated successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
