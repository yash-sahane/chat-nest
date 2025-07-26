import { useSocket } from "@/context/SocketProvier";
import { RootState } from "@/store/store";
import { ChatMsgType } from "@/types";
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

const ChatMsg = ({ chatMsg, idx }: { chatMsg: ChatMsgType; idx: number }) => {
  const { selectedChatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { socket } = useSocket();
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const downloadHandler = (fileUrl: string) => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URI
    }/api/chat/download_file/${fileUrl.split("/").pop()}`;
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
  }, [selectedChatMessages, socket, user?._id]);

  return (
    <div
      ref={selectedChatMessages.length === idx + 1 ? scrollRef : null}
      data-message-id={chatMsg._id}
      data-sender-id={chatMsg.sender}
      data-receiver-id={chatMsg.recipient}
      data-is-read={chatMsg.isRead}
    >
      <div className="flex gap-1 items-center group relative">
        {/* Alert Icon (hover tooltip) */}
        {chatMsg.sender === user?._id && (
          <div
            className="transition-all p-0.5 cursor-pointer opacity-0 group-hover:opacity-100"
            style={{
              margin:
                user?._id === chatMsg.sender ? "0 0 0 auto" : "0 auto 0 0",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="relative">
              <CircleAlert size={20} />
              {showTooltip && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[hsl(var(--message-background))] shadow-md p-2 rounded-sm z-10 w-60 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {chatMsg.isRead ? (
                        <LucideCheckCheck size={16} className="text-primary" />
                      ) : (
                        <LucideCheck size={16} className="text-primary" />
                      )}
                      <p>{chatMsg.isRead ? "Read" : "Not Read"}</p>
                    </div>
                    <p>
                      {chatMsg.isRead
                        ? moment(chatMsg.timeStamp).format(
                            "MMM D, YYYY • h:mm A"
                          )
                        : "Not Read"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Bubble */}
        <div
          className={clsx(
            "custom-transition",
            chatMsg.fileURL ? "max-w-[500px]" : "py-[6px] max-w-[80%]",
            "rounded-md p-3 text-sm w-fit"
          )}
          style={{
            background:
              user?._id === chatMsg.sender
                ? "hsl(var(--message-background))"
                : "hsl(var(--chat-primary))",
          }}
        >
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
        </div>

        {/* File Download */}
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

      {/* Timestamp and Tick below bubble */}
      <p
        className={`text-xs text-gray-500 w-full flex items-center gap-1 ${
          user?._id === chatMsg.sender ? "justify-end" : "justify-start"
        }`}
      >
        {moment(chatMsg.timeStamp).format("LT")}{" "}
        {chatMsg.sender === user?._id && (
          <span>
            {chatMsg.isRead ? (
              <LucideCheckCheck size={16} className="text-primary" />
            ) : (
              <LucideCheck size={16} className="text-primary" />
            )}
          </span>
        )}
      </p>
    </div>
  );
};

export default memo(ChatMsg);
