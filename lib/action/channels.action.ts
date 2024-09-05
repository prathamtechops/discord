"use server";

import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

    if (name === "general") throw new Error("Channel name not allowed");

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
              name: {
                not: "general",
              },
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

export const redirectToGeneral = async (serverId: string) => {
  try {
    const profile = await getProfile();

    if (!profile) return redirect("/sign-in");

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: "general",
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!server) console.log("server not found");

    const initialChannel = server?.channels[0];

    return initialChannel?.id;
  } catch (error) {
    return null;
  }
};

export const getChannel = async (serverid: string, channelId: string) => {
  try {
    const profile = await getProfile();

    if (!profile) return null;

    const channel = await db.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: serverid,
      },
    });

    return {
      channel,
      member,
      profile,
    };
  } catch (err) {
    return null;
  }
};
