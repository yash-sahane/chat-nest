import { RootState } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { Download, File, Image, Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSocket } from "@/context/SocketProvier";
import { ApiResponse, ChatMsg } from "@/types";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";

const ChannelChatMain = () => {
  const { selectedChatType, selectedChatData, selectedChatMessages } =
    useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const { socket } = useSocket();
  const emojiRef = useRef<null | HTMLElement>(null);
  const scrollRef = useRef<null | HTMLElement>(null);

  const emojiHandler = (emoji: EmojiClickData) => {
    setMsg((msg) => msg + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const sendMsgHandler = () => {
    if (msg.trim() === "") {
      return;
    }

    socket.emit("sendChannelMessage", {
      sender: user?._id,
      content: msg,
      messageType: "text",
      fileURL: undefined,
      channelId: selectedChatData?._id,
    });

    setMsg("");
  };

  let lastDate: string | null = null;
  const renderDate = (chatMsg: ChatMsg) => {
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

        const { data }: AxiosResponse<ApiResponse> = await axios.post(
          `${import.meta.env.VITE_SERVER_URI}/api/chat/send_file`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          socket.emit("sendChannelMessage", {
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

  useEffect(() => {
    const handleClickOutside = () => {
      if (emojiRef.current && !emojiRef.current.contains(event?.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => handleClickOutside();
  }, [useRef]);

  useEffect(() => {
    // console.log(selectedChatMessages.length);

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <div className="custom-transition bg-[hsl(var(--chat-bg))] w-4/5 rounded-2xl p-3">
      {selectedChatData && (
        <>
          <div className="rounded-2xl flex gap-3 items-center p-2 py-3 transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]">
            <UserProfile userProfile={selectedChatData} />
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                <p className="font-semibold text-sm">{`${selectedChatData.name}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-134px)] flex flex-col gap-3 pr-2 mt-2 overflow-y-auto">
            {selectedChatMessages.map((chatMsg, idx) => {
              console.log(chatMsg);

              return (
                <React.Fragment key={chatMsg._id}>
                  {renderDate(chatMsg)}
                  <div
                    ref={
                      selectedChatMessages.length === idx + 1 ? scrollRef : null
                    }
                  >
                    <div
                      style={{
                        margin:
                          user?._id === chatMsg.sender._id
                            ? "0 0 0 auto"
                            : "0 auto 0 0",
                      }}
                      className={`${
                        chatMsg.fileURL
                          ? "max-w-[500px]"
                          : "py-[6px] max-w-[80%]"
                      } w-fit rounded-md text-sm flex gap-2 items-center py-3 transition-all duration-150 ease-linear`}
                    >
                      <div className="flex gap-2 w-full">
                        <UserProfile userProfile={chatMsg.sender} />
                        <div
                          className={`${
                            chatMsg.fileURL ? "max-w-[500px]" : "py-[6px]"
                          } rounded-md p-3 text-sm w-fit`}
                          style={{
                            background:
                              user?._id === chatMsg.sender._id
                                ? "hsl(var(--message-background))"
                                : "hsl(var(--chat-primary))",
                            // margin:
                            //   user?._id === chatMsg.sender._id
                            //     ? "0 0 0 auto"
                            //     : "0 auto 0 0",
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold text-sm">{`${chatMsg.sender.firstName} ${chatMsg.sender.lastName}`}</p>
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
                        user?._id === chatMsg.sender._id
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

export default ChannelChatMain;