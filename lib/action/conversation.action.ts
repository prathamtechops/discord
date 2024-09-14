"use server";

import { z } from "zod";
import { db } from "../db";
import { fileUploadSchema, messageSchema } from "../validations";
import { getProfile } from "./profile.action";
import { revalidatePath } from "next/cache";

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

export const sendFile = async (
  channelId: string,
  serverId: string,
  values: z.infer<typeof fileUploadSchema>
) => {
  try {
    const validateForm = fileUploadSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    const { fileUrl } = validateForm.data;

    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new Error("Server not found");

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: server.id,
      },
    });
    if (!channel) throw new Error("Channel not found");

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) throw new Error("Member not found");

    const message = await db.message.create({
      data: {
        content: fileUrl,
        fileUrl,
        channelId: channel.id as string,
        memberId: member.id as string,
      },
      include: {
        member: true,
      },
    });

    const channelKey = `chat:${channelId}:message`;

    return {
      channelKey,
      message,
    };
  } catch (error) {}
};

export const sendMessageToChannel = async (
  channelId: string,
  serverId: string,
  values: z.infer<typeof messageSchema>
) => {
  try {
    const validateForm = messageSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    const { content } = validateForm.data;

    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new Error("Server not found");

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: server.id,
      },
    });
    if (!channel) throw new Error("Channel not found");

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) throw new Error("Member not found");

    const message = await db.message.create({
      data: {
        content,
        channelId: channel.id as string,
        memberId: member.id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    return {
      channelKey,
      message,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const messages = async (
  paramKey: "channelId" | "conversationId",
  paramValue: string,
  cursor?: string | null | undefined
) => {
  const MESSAGE_LIMIT = 10;
  try {
    const profile = await getProfile();
    if (!profile) throw new Error("Unauthorized");

    const messages = await db.message.findMany({
      take: MESSAGE_LIMIT,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: {
        [paramKey]: paramValue,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextCursor =
      messages.length === MESSAGE_LIMIT
        ? messages[messages.length - 1].id
        : null;

    return {
      items: messages,
      nextCursor,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
};

export const updateMessage = async (
  messageId: string,
  serverId: string,
  channelId: string,
  values: z.infer<typeof messageSchema>
) => {
  try {
    const validateForm = messageSchema.safeParse(values);
    if (!validateForm.success) {
      throw new Error(validateForm.error.message);
    }

    const { content } = validateForm.data;

    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new Error("Server not found");

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: server.id,
      },
    });
    if (!channel) throw new Error("Channel not found");

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) throw new Error("Member not found");

    const message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id as string,
      },
    });

    if (!message) throw new Error("Message not found");

    await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        content,
        edited: true,
      },
    });

    return {
      success: true,
      message: "Message updated successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

export const deleteMessage = async (
  messageId: string,
  serverId: string,
  channelId: string,
  pathname: string
) => {
  try {
    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) throw new Error("Server not found");

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: server.id,
      },
    });
    if (!channel) throw new Error("Channel not found");

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) throw new Error("Member not found");

    const message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id as string,
      },
    });

    if (!message) throw new Error("Message not found");

    await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        deleted: true,
        fileUrl: null,
        content: "This message has been deleted",
        edited: true,
      },
    });

    revalidatePath(pathname);

    return {
      success: true,
      message: "Message deleted successfully",
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};
