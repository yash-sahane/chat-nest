import { useSocket } from "@/context/SocketProvier";
import { RootState } from "@/store/store";
import { ChannelChatMsgType } from "@/types";
import { isChannel, isChannelChatMsg } from "@/utils/type";
import {
  CircleAlert,
  Download,
  File,
  LucideCheck,
  LucideCheckCheck,
} from "lucide-react";
import moment from "moment";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeProvider";
import UserProfile from "@/utils/UserProfile";

const ChannelChatMsg = ({
  chatMsg,
  idx,
}: {
  chatMsg: ChannelChatMsgType;
  idx: number;
}) => {
  const { selectedChannelMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  const { socket } = useSocket();
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const downloadHandler = (fileUrl: string) => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URI
    }/api/chat/download_file/${fileUrl.split("/").pop()}`;
  };

  const checkIsRead = (message: ChannelChatMsgType) => {
    const isMessageReadByReader = message.readBy.some((reader) => {
      return reader.user._id === user?._id;
    });

    return isMessageReadByReader || message.sender._id === user?._id;
  };

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
        observer.observe(ele);
      }
    });

    return () => observer.disconnect();
  }, [selectedChannelMessages, socket, user?._id]);

  return (
    <div
      ref={selectedChannelMessages.length === idx + 1 ? scrollRef : null}
      data-message-id={chatMsg._id}
      data-sender-id={chatMsg.sender._id}
      data-is-read={checkIsRead(chatMsg)}
    >
      <div className="flex gap-1 items-center group relative">
        {chatMsg.sender._id === user?._id && (
          <div
            className="transition-all p-0.5 cursor-pointer opacity-0 group-hover:opacity-100"
            style={{
              margin:
                user?._id === chatMsg.sender._id ? "0 0 0 auto" : "0 auto 0 0",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="relative">
              <CircleAlert size={20} />
              {showTooltip && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[hsl(var(--message-background))] shadow-md p-2 rounded-sm z-10 w-60 text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <p className="font-semibold">Read By</p>
                      <LucideCheckCheck size={16} className="text-primary" />
                    </div>
                    <div className="mt-1">
                      {chatMsg.readBy.length ? (
                        chatMsg.readBy.map((reader) => (
                          <div className="flex justify-between">
                            <p>{reader.user.firstName}</p>
                            <p>
                              {moment(reader.readAt).format(
                                "MMM D, YYYY • h:mm A"
                              )}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            chatMsg.fileURL ? "max-w-[500px]" : "max-w-[80%]"
          } w-fit rounded-md text-sm flex gap-2 items-center transition-all duration-150 ease-linear`}
        >
          <div className="flex gap-2 w-full">
            <UserProfile userProfile={chatMsg.sender} />
            <div
              className={`${
                chatMsg.fileURL ? "max-w-[500px]" : "py-[6px]"
              } rounded-md p-3 text-sm w-fit`}
              style={{
                background:
                  user?._id ===
                  (isChannelChatMsg(chatMsg) && chatMsg.sender._id)
                    ? "hsl(var(--message-background))"
                    : "hsl(var(--chat-primary))",
              }}
            >
              <div className="flex flex-col gap-1">
                {isChannelChatMsg(chatMsg) && (
                  <p
                    className={` font-semibold text-sm ${
                      theme === "light" ? "text-gray-800" : "text-gray-300"
                    }`}
                  >{`${chatMsg.sender.firstName} ${chatMsg.sender.lastName}`}</p>
                )}
                {chatMsg.messageType === "text" && <p>{chatMsg.content}</p>}
                {chatMsg.messageType === "image" && (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URI}/files/${
                      chatMsg.fileURL
                    }`}
                    className="w-full h-full object-contain rounded-md"
                  />
                )}
                {chatMsg.messageType === "video" && (
                  <video
                    src={`${import.meta.env.VITE_SERVER_URI}/files/${
                      chatMsg.fileURL
                    }`}
                    className="w-full h-full object-contain rounded-md"
                    controls
                  />
                )}
                {chatMsg.messageType === "file" && (
                  <div className="flex gap-2 items-center">
                    <div className="flex justify-center rounded-md p-2 bg-[hsl(var(--background))]">
                      <File size={19} />
                    </div>
                    <p>{chatMsg.fileURL}</p>
                    <Button className="h-fit flex justify-center rounded-md p-2">
                      <Download
                        size={20}
                        onClick={() => downloadHandler(chatMsg.fileURL)}
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p
        className={`text-xs text-gray-500 w-full ${
          user?._id === (isChannelChatMsg(chatMsg) && chatMsg.sender._id)
            ? "text-right "
            : "text-left"
        }`}
      >
        {moment(chatMsg.timeStamp).format("LT")}
      </p>
    </div>
  );
};

export default memo(ChannelChatMsg);
