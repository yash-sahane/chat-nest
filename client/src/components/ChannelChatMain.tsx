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
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketProvier";
import { ApiResponse, ChannelChatMsg, ChatMsg } from "@/types";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { isChannel, isChannelChatMsg } from "@/utils/type";
import { useTheme } from "@/context/ThemeProvider";
import { useDispatch } from "react-redux";
import { setSelectedChatData } from "@/slices/ChatSlice";

const ChannelChatMain = () => {
  const { selectedChatData, selectedChannelMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const { socket } = useSocket();
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const { theme } = useTheme();

  const emojiHandler = (emoji: EmojiClickData) => {
    setMsg((msg) => msg + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const sendMsgHandler = () => {
    if (msg.trim() === "") {
      return;
    }

    socket?.emit("sendChannelMessage", {
      sender: user?._id,
      content: msg,
      messageType: "text",
      fileURL: undefined,
      channelId: selectedChatData?._id,
    });

    setMsg("");
  };

  let lastDate: string | null = null;
  const renderDate = (chatMsg: ChannelChatMsg | ChatMsg) => {
    const messageDate = moment(chatMsg.timeStamp).format("YYYY-MM-DD");
    const showDate = messageDate !== lastDate;
    lastDate = messageDate;

    return (
      showDate && (
        <div className="bg-[hsl(var(--chat-primary))] p-2 rounded-lg text-sm w-fit mx-auto">
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
          socket?.emit("sendChannelMessage", {
            sender: user?._id,
            content: undefined,
            messageType: fileType,
            fileURL: data.data,
            channelId: selectedChatData?._id,
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

  const downloadHandler = (fileUrl: string) => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URI
    }/api/chat/download_file/${fileUrl.split("/").pop()}`;
  };

  const clearSelectedChatData = () => {
    dispatch(setSelectedChatData(undefined));
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        emojiRef.current &&
        event.target instanceof Node &&
        !emojiRef.current.contains(event?.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, [useRef]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const messageId = entry.target.getAttribute("data-message-id");
        const senderId = entry.target.getAttribute("data-sender-id");
        const channelId = selectedChatData?._id;
        if (entry.isIntersecting && messageId && user?._id !== senderId) {
          socket?.emit("markAsRead:channel", {
            messageId,
            senderId,
            channelId,
            readerId: user?._id,
          });
        }
      });
    });

    const elements = document.querySelectorAll("[data-message-id]");
    elements.forEach((ele) => {
      if (ele.getAttribute("data-is-read") === "false") {
        observer.observe(ele);
      }
    });
  }, [selectedChannelMessages]);

  const checkIsRead = (message: ChannelChatMsg) => {
    const isMessageReadByReader = message.readBy.some((reader) => {
      console.log(reader.user === user?._id, " ", reader.user, " ", user?._id);

      return reader.user === user?._id;
    });

    // console.log(isMessageReadByReader || message.sender._id === user?._id);

    return isMessageReadByReader || message.sender._id === user?._id;
  };

  return (
    <div className="custom-transition bg-[hsl(var(--chat-bg))] w-full sm:w-4/5 rounded-2xl p-3">
      {selectedChatData && (
        <>
          <div className="rounded-2xl flex gap-3 items-center p-2 py-3 transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]">
            <div
              className="sm:hidden bg-[hsl(var(--chat-bg))] p-2 rounded-lg cursor-pointer"
              onClick={clearSelectedChatData}
            >
              <ArrowLeft size={18} />
            </div>
            <UserProfile userProfile={selectedChatData} />
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                <p className="font-semibold text-sm">{`${
                  isChannel(selectedChatData) && selectedChatData.name
                }`}</p>
              </div>
              {/* <div className="flex justify-between">
                <p className="text-sm text-gray-500">Online</p>
              </div> */}
            </div>
          </div>
          <div className="h-[calc(100%-134px)] flex flex-col gap-3 mt-2 overflow-y-auto">
            {selectedChannelMessages.map((chatMsg, idx) => {
              return (
                <React.Fragment key={chatMsg._id}>
                  {renderDate(chatMsg)}
                  <div
                    ref={
                      selectedChannelMessages.length === idx + 1
                        ? scrollRef
                        : null
                    }
                    data-message-id={chatMsg._id}
                    data-sender-id={chatMsg.sender._id}
                    data-is-read={checkIsRead(chatMsg)}
                  >
                    <div
                      style={{
                        margin:
                          user?._id ===
                          (isChannelChatMsg(chatMsg) && chatMsg.sender._id)
                            ? "0 0 0 auto"
                            : "0 auto 0 0",
                      }}
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
                                  theme === "light"
                                    ? "text-gray-800"
                                    : "text-gray-300"
                                }`}
                              >{`${chatMsg.sender.firstName} ${chatMsg.sender.lastName}`}</p>
                            )}
                            {chatMsg.messageType === "text" && (
                              <p>{chatMsg.content}</p>
                            )}
                            {chatMsg.messageType === "image" && (
                              <img
                                src={`${
                                  import.meta.env.VITE_SERVER_URI
                                }/files/${chatMsg.fileURL}`}
                                className="w-full h-full object-contain rounded-md"
                              />
                            )}
                            {chatMsg.messageType === "video" && (
                              <video
                                src={`${
                                  import.meta.env.VITE_SERVER_URI
                                }/files/${chatMsg.fileURL}`}
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
                                    onClick={() =>
                                      downloadHandler(chatMsg.fileURL)
                                    }
                                  />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`text-xs text-gray-500 w-full ${
                        user?._id ===
                        (isChannelChatMsg(chatMsg) && chatMsg.sender._id)
                          ? "text-right "
                          : "text-left"
                      }`}
                    >
                      {moment(chatMsg.timeStamp).format("LT")}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="relative transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))] h-[52px] rounded-2xl mt-2">
            <div className="absolute h-full flex gap-3 items-center right-[95px]">
              <input
                type="file"
                id="upload-file"
                onChange={fileUploadHandler}
                className="hidden"
                accept="*"
              />
              <label htmlFor="upload-file">
                <Paperclip size={20}></Paperclip>
              </label>
              <Smile onClick={() => setShowEmojiPicker((prev) => !prev)} />
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
              className="custom-transition pr-[160px] h-full w-full bg-transparent placeholder:text-sm placeholder:text-gray-500 rounded-lg"
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

export default memo(ChannelChatMain);
