export type ApiResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

import profileThemeKeys from "@/utils/profileThemeKeys";

type ThemeKeys = (typeof profileThemeKeys)[number];

export type ProfileTheme = {
  [key in ThemeKeys]: {
    bg: string;
    border: string;
  };
};

export type ProfileThemeKeys =
  | "violet"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "yellow";

export type User = {
  _id: string;
  email: string;
  password: string;
  profileSetup: boolean;
  firstName: string;
  lastName: string;
  profileTheme: ProfileThemeKeys;
  avatar: string;
  status: "online" | "offline";
};

export type Message = {
  _id: string;
  sender: User;
  recipient: User | undefined;
  messageType: "text" | "file" | "image" | "video";
  content: string;
  fileURL: string;
  timeStamp: string;
  channel: string;
};

export type ChatMsgType = {
  _id: string;
  sender: string;
  recipient: string;
  messageType: "text" | "file" | "image" | "video";
  content: string;
  fileURL: string;
  timeStamp: string;
  isRead: boolean;
  readAt: string;
};

export type ChannelChatMsgType = {
  _id: string;
  sender: User;
  messageType: "text" | "file" | "image" | "video";
  content: string;
  fileURL: string;
  timeStamp: string;
  readBy: [{ user: User; readAt: string }];
};

export type DMProfile = {
  _id: string;
  lastMessageTime: string;
  lastMessageType: "text" | "image" | "video" | "file";
  email: string;
  firstName: string;
  lastName: string;
  profileTheme: ProfileThemeKeys;
  avatar: string;
  lastMessage: string;
  status: "online" | "offline";
};

export type View = "person" | "channel";

export type Channel = {
  _id: string;
  name: string;
  members: string[];
  admin: string;
  avatar: string;
  profileTheme: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageType: "image" | "video" | "file";
  lastMessage: string;
};
