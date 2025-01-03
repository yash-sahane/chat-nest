import { getChatMessages } from "@/slices/ChatApi";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { DMProfile } from "@/types";
import UserProfile from "@/utils/UserProfile";
import { File, Image, Video } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Chat = ({ DMProfile }: { DMProfile: DMProfile }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChatData } = useSelector((state: RootState) => state.chat);

  const chatSelectHandler = async () => {
    dispatch(setSelectedChatData(DMProfile));
    dispatch(setSelectedChatType("chat"));

    dispatch(getChatMessages({ id: DMProfile._id }));
  };

  const getMessageType = () => {
    if (DMProfile.lastMessageType === "image") {
      return <Image size={18} />;
    } else if (DMProfile.lastMessageType === "video") {
      return <Video size={18} />;
    } else if (DMProfile.lastMessageType === "file") {
      return <File size={18} />;
    }
  };

  return (
    <div
      className={`rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer custom-transition hover:bg-[hsl(var(--chat-card))] ${
        selectedChatData?._id === DMProfile._id && " bg-[hsl(var(--chat-card))]"
      }`}
      onClick={chatSelectHandler}
    >
      <div className="relative">
        <UserProfile userProfile={DMProfile} />
        <span
          style={{
            background:
              DMProfile.status === "online"
                ? "hsl(var(--status-online))"
                : "hsl(var(--status-offline))",
          }}
          className={`custom-transition absolute -right-[2px] -bottom-[0px] w-[14px] h-[14px] rounded-full border-2 border-[hsl(var(--chat-card))]`}
        ></span>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <p className="font-semibold text-sm">
            {DMProfile.firstName} {DMProfile.lastName}
          </p>
          <p className="text-sm text-gray-600">
            {moment(DMProfile.lastMessageTime).fromNow()}
          </p>
        </div>
        <div className="flex justify-between">
          <div className="w-[180px] text-sm text-gray-500 text-ellipsis text-nowrap overflow-hidden">
            {DMProfile.lastMessage ? (
              DMProfile.lastMessage
            ) : (
              <div className="flex gap-1">
                {getMessageType()}
                {DMProfile.lastMessageType[0].toUpperCase() +
                  DMProfile.lastMessageType.slice(1)}
              </div>
            )}
            {!DMProfile.lastMessageType && "No messages yet!"}
          </div>
          {/* <span className="flex items-center justify-center px-[6px] rounded-full bg-[hsl(var(--primary))]">
            <p className="text-xs text-white">1</p>
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
