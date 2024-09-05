"use server";

import { db } from "../db";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    return conversation;
  } catch {
    return null;
  }
};

export const getConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await createConversation(memberOneId, memberTwoId));

    if (!conversation)
      conversation = await createConversation(memberOneId, memberTwoId);

    return conversation;
  } catch (error) {
    return null;
  }
};
