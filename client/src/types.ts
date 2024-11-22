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
};

export type Message = {
  _id: string;
  sender: User;
  recipient: User;
  messageType: "text" | "file" | "image" | "video";
  content: string;
  fileURL: string;
  timeStamp: Date;
};

export type ChatMsg = {
  _id: string;
  sender: string;
  recipient: string;
  messageType: "text" | "file" | "image" | "video";
  content: string;
  fileURL: string;
  timeStamp: Date;
};

export type DMProfile = {
  _id: string;
  lastMessageTime: string;
  email: string;
  firstName: string;
  lastName: string;
  profileTheme: ProfileThemeKeys;
  avatar: string;
  lastMessage: string;
};
