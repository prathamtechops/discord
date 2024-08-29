"use server";

import { db } from "../db";

export const checkUserInServer = async (
  inviteCode: string,
  profileId: string
) => {
  try {
    const server = await db.server.findFirst({
      where: {
        inviteCode,
        members: {
          some: {
            profileId,
          },
        },
      },
    });

    if (server) {
      return {
        success: 201,
        message: "User already in server",
        server,
      };
    }

    const updatedServer = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: {
            profileId,
          },
        },
      },
    });

    if (updatedServer) {
      return {
        success: 200,
        message: "User added to server",
        server: updatedServer,
      };
    }

    throw new Error("Something went wrong");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
