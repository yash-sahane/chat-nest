import { Channel, ChannelChatMsg, ChatMsgType, User } from "@/types";

export function isUser(data: User | Channel | undefined): data is User {
  return (data as User)?.email !== undefined;
}

export function isChannel(data: User | Channel | undefined): data is Channel {
  return (data as Channel)?.name !== undefined;
}

export function isChannelChatMsg(
  data: ChannelChatMsg | ChatMsgType
): data is ChannelChatMsg {
  return (data as ChannelChatMsg)?.sender._id !== undefined;
}

export function isChatMsg(
  data: ChannelChatMsg | ChatMsgType
): data is ChatMsgType {
  return (data as ChatMsgType)?.recipient !== undefined;
}
