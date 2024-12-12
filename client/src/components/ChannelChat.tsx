import { getChannelMessages } from "@/slices/ChatApi";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Channel } from "@/types";
import UserProfile from "@/utils/UserProfile";
import { File, Image, Video } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const ChannelChat = ({ channel }: { channel: Channel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChatData } = useSelector((state: RootState) => state.chat);

  const chatSelectHandler = async () => {
    dispatch(setSelectedChatData(channel));
    dispatch(setSelectedChatType("channel"));
    dispatch(getChannelMessages({ id: channel._id }));
  };

  const getMessageType = () => {
    if (channel.lastMessageType === "image") {
      return <Image size={18} />;
    } else if (channel.lastMessageType === "video") {
      return <Video size={18} />;
    } else if (channel.lastMessageType === "file") {
      return <File size={18} />;
    }
  };

  return (
    <div
      className={`rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear hover:bg-[hsl(var(--chat-card))] ${
        selectedChatData?._id === channel._id && " bg-[hsl(var(--chat-card))]"
      }`}
      onClick={chatSelectHandler}
    >
      <UserProfile userProfile={channel} />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <p className="font-semibold text-sm">{channel.name}</p>
          <p className="text-sm text-gray-600">
            {moment(channel.updatedAt).fromNow()}
          </p>
        </div>
        <div className="flex justify-between">
          <div className="w-[180px] text-sm text-gray-500 text-ellipsis text-nowrap overflow-hidden">
            {channel.lastMessage
              ? channel.lastMessage
              : channel.lastMessageType && (
                  <div className="flex gap-1">
                    {getMessageType()}
                    {channel?.lastMessageType[0].toUpperCase() +
                      channel?.lastMessageType.slice(1)}
                  </div>
                )}
            {!channel.lastMessage && "No messages yet!"}
          </div>
          {/* <span className="flex items-center justify-center px-[6px] rounded-full bg-[hsl(var(--primary))]">
            <p className="text-xs text-white">1</p>
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default ChannelChat;
