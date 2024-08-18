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

    if (server) return server;

    return null;
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

    const { name, imageUrl } = validateForm.data;

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile?.id,
        inviteCode: Math.random().toString(36).substring(2, 10),
        channels: {
          create: {
            name: "general",
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

    return server;
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
