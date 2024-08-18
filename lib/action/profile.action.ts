"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../db";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const userProfile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (userProfile) return userProfile;

    const profile = await db.profile.create({
      data: {
        userId: user?.id,
        name: user.firstName + " " + user.lastName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return profile;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const getProfile = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
