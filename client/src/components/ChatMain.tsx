import { AppDispatch, RootState } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import {
  ArrowLeft,
  Download,
  File,
  LucideCheck,
  LucideCheckCheck,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketProvier";
import { ApiResponse, ChannelChatMsg, ChatMsgType } from "@/types";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { isUser } from "@/utils/type";
import { useDispatch } from "react-redux";
import { setSelectedChatData } from "@/slices/ChatSlice";
import ChatMsg from "./ChatMsg";

const ChatMain = () => {
  const { selectedChatData, selectedChatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const { socket } = useSocket();
  const emojiRef = useRef<null | HTMLDivElement>(null);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const emojiHandler = (emoji: EmojiClickData) => {
    setMsg((msg) => msg + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const sendMsgHandler = () => {
    if (msg.trim() === "") {
      return;
    }

    socket?.emit("sendMessage", {
      sender: user?._id,
      recipient: selectedChatData?._id,
      content: msg,
      messageType: "text",
      fileURL: undefined,
    });

    setMsg("");
  };

  let lastDate: string | null = null;
  const renderDate = (chatMsg: ChannelChatMsg | ChatMsgType) => {
    const messageDate = moment(chatMsg.timeStamp).format("YYYY-MM-DD");
    const showDate = messageDate !== lastDate;
    lastDate = messageDate;

    return (
      showDate && (
        <div className="custom-transition bg-[hsl(var(--chat-primary))] p-2 rounded-lg text-sm w-fit mx-auto">
          {messageDate}
        </div>
      )
    );
  };

  function getFileType(file: File) {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return "image";
    } else if (fileType.startsWith("video/")) {
      return "video";
    } else {
      return "file";
    }
  }

  const fileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        const fileType = getFileType(e.target.files[0]);

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const { data } = await axios.post<ApiResponse>(
          `${import.meta.env.VITE_SERVER_URI}/api/chat/send_file`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          socket?.emit("sendMessage", {
            sender: user?._id,
            recipient: selectedChatData?._id,
            content: undefined,
            messageType: fileType,
            fileURL: data.data,
          });
        }
      } catch (e: any) {
        console.log(e.message);
        toast.error(e.response.data.message);
      }
    } else {
      toast.error("Please select file");
    }
  };

  const clearSelectedChatData = () => {
    dispatch(setSelectedChatData(undefined));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event?.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => handleClickOutside();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const messageId = entry.target.getAttribute("data-message-id");
        const senderId = entry.target.getAttribute("data-sender-id");
        const receiverId = entry.target.getAttribute("data-receiver-id");
        if (entry.isIntersecting && messageId && user?._id !== senderId) {
          socket?.emit("markAsRead", { messageId, senderId, receiverId });
        }
      });
    });

    const elements = document.querySelectorAll("[data-message-id]");
    elements.forEach((ele) => {
      if (ele.getAttribute("data-is-read") === "false") {
        // console.log(ele);
        observer.observe(ele);
      }
    });

    console.log(selectedChatMessages);

    return () => observer.disconnect();
  }, [selectedChatMessages, socket, user?._id]);

  console.log("chatmain is running");

  return (
    <div
      className={`${
        selectedChatData ? "max-sm:w-full" : "max-sm:hidden max-sm:w-0"
      } sm:w-4/5 custom-transition bg-[hsl(var(--chat-bg))] rounded-2xl p-3`}
    >
      {selectedChatData && (
        <>
          <div className="rounded-2xl flex gap-3 items-center p-2 py-3 custom-transition bg-[hsl(var(--chat-primary))]">
            <div
              className="sm:hidden bg-[hsl(var(--chat-bg))] p-2 rounded-lg cursor-pointer"
              onClick={clearSelectedChatData}
            >
              <ArrowLeft size={18} />
            </div>
            <UserProfile userProfile={selectedChatData} />
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                {isUser(selectedChatData) && (
                  <p className="font-semibold text-sm">{`${selectedChatData.firstName} ${selectedChatData.lastName}`}</p>
                )}
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">
                  {isUser(selectedChatData) && selectedChatData.status}
                </p>
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-134px)] flex flex-col gap-3 pr-2 mt-2 overflow-y-auto">
            {selectedChatMessages.map((chatMsg, idx) => {
              return (
                <React.Fragment key={chatMsg._id}>
                  {renderDate(chatMsg)}
                  <ChatMsg chatMsg={chatMsg} idx={idx} />
                </React.Fragment>
              );
            })}
          </div>
          <div className="relative custom-transition bg-[hsl(var(--chat-primary))] h-[52px] rounded-2xl mt-2">
            <div className="absolute h-full flex gap-3 items-center right-[95px]">
              <input
                type="file"
                id="upload-file"
                onChange={fileUploadHandler}
                className="hidden"
                accept="*"
              />
              <label htmlFor="upload-file" className="cursor-pointer">
                <Paperclip size={20} className="cursor-pointer"></Paperclip>
              </label>
              <Smile
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="cursor-pointer"
              />
            </div>
            {showEmojiPicker && (
              <div
                className="absolute bottom-[45px] right-[95px]"
                ref={emojiRef}
              >
                <EmojiPicker
                  onEmojiClick={emojiHandler}
                  theme={Theme.DARK}
                  lazyLoadEmojis={true}
                  emojiStyle={EmojiStyle.GOOGLE}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
            <Input
              type="text"
              className="pr-[160px] h-full w-full bg-transparent placeholder:text-sm placeholder:text-gray-500 rounded-lg"
              placeholder="Search message..."
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsgHandler()}
              value={msg}
            />
            <div className=" absolute right-2 top-[8px] bg-[hsl(var(--chat-secondary))]">
              <Button
                className="flex gap-1 py-2 px-2 h-fit"
                onClick={sendMsgHandler}
              >
                Send <Send size={18} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ChatMain);
