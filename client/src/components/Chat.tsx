import profileLogo from "@/assets/app-logo.png";
import { getChatMessages } from "@/slices/ChatApi";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { DMProfile, User } from "@/types";
import UserProfile from "@/utils/UserProfile";
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

  return (
    <div
      className={`rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear hover:bg-[hsl(var(--chat-card))] ${
        selectedChatData?._id === DMProfile._id && " bg-[hsl(var(--chat-card))]"
      }`}
      onClick={chatSelectHandler}
    >
      <UserProfile userProfile={DMProfile} />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <p className="font-semibold text-sm">
            {DMProfile.firstName} {DMProfile.lastName}
          </p>
          <p className="text-sm text-gray-600">{DMProfile.lastMessageTime}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">{DMProfile.lastMessage}</p>
          <span className="flex items-center justify-center px-[6px] rounded-full bg-[hsl(var(--primary))]">
            <p className="text-xs text-white">1</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
