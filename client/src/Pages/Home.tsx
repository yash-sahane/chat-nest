import ChatMain from "@/components/ChatMain";
import HomeSidebar from "@/components/HomeSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChannelChatMain from "@/components/ChannelChatMain";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Home = () => {
  const { selectedChatType } = useSelector((state: RootState) => state.chat);

  return (
    <div className="custom-transition flex gap-3 h-screen p-4 pl-0">
      <div className="flex gap-1">
        <HomeSidebar />
        <ChatSidebar />
      </div>
      {selectedChatType === "chat" ? <ChatMain /> : <ChannelChatMain />}
    </div>
  );
};

export default Home;
