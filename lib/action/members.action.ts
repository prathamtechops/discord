"use server";

import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { getProfile } from "./profile.action";

export const changeMemberRole = async (
  serverId: string,
  memberId: string,
  role: MemberRole,
  pathname: string
) => {
  try {
    const profile = await getProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
    });

    if (!server) {
      throw new Error("Server not found");
    }

    revalidatePath(pathname);

    return {
      success: 200,
      message: "Member role updated successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const kickMember = async (
  serverId: string,
  memberId: string,
  pathname: string
) => {
  try {

    const profile = await getProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
    });

    if (!server) {
      throw new Error("Server not found");
    }

    revalidatePath(pathname);

    return {
      success: 200,
      message: "Member kicked successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
