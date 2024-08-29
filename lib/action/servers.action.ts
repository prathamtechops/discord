"use server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverSchema } from "../validations";
import { getProfile } from "./profile.action";

export const getUserServers = async (profileId: string) => {
  try {
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    return server;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const createServer = async (
  values: z.infer<typeof serverSchema>,
  pathname: string
) => {
  try {
    const validateForm = serverSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    const profile = await getProfile();

    if(!profile) {
      throw new Error("Unauthorized");
    }



    const { name, imageUrl } = validateForm.data;

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile?.id,
        inviteCode: Math.random().toString(36).substring(2, 10),
        channels: {
          create: {
            name: "General",
            profileId: profile?.id,

          },
        },
        members: {
          create: {
            profileId: profile?.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    if (!server) {
      throw new Error("Server not created");
    }

    revalidatePath(pathname);

    return {
      message: "Server created successfully",
      success: 200,
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const getServers = async (profileId: string) => {
  try {
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    if (!servers) throw new Error("No servers found");

    return servers;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const getServerById = async (profileId: string, serverId: string) => {
  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    return server;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const getServerChannels = async (serverId: string) => {
  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!server) throw new Error("Server not found");

    return server;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const generateNewInviteCode = async (
  serverId: string,
  pathname: string
) => {
  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
    });
    if (!server) throw new Error("Server not found");

    const newInviteCode = Math.random().toString(36).substring(2, 10);
    await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: newInviteCode,
      },
    });
    revalidatePath(pathname);

    return {
      message: "New invite code generated successfully",
      success: 200,
      inviteCode: newInviteCode,
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const editServer = async (
  serverId: string,
  values: z.infer<typeof serverSchema>,
  pathname: string
) => {
  try {
    const validateForm = serverSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    const { name, imageUrl } = validateForm.data;

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        name,
        imageUrl,
      },
    });

    if (!server) throw new Error("Server not found");

    revalidatePath(pathname);

    return {
      message: "Server updated successfully",
      success: 200,
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const leaveServer = async (serverId: string, pathname: string) => {
  try {
    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    revalidatePath(pathname);

    return {
      message: "Left server successfully",
      success: 200,
    };
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
