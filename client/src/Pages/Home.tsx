import ChatMain from "@/components/ChatMain";
import HomeSidebar from "@/components/HomeSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChannelChatMain from "@/components/ChannelChatMain";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import GradientBackgroud from "@/components/GradientBackgroud";

const Home = () => {
  const { selectedChatType, selectedChatData } = useSelector(
    (state: RootState) => state.chat
  );

  return (
    <div className="custom-transition flex gap-3 h-screen p-4 pl-0">
      <div className="flex gap-1">
        <HomeSidebar />
        <ChatSidebar />
      </div>
      {selectedChatType === "chat" ? (
        <ChatMain />
      ) : (
        selectedChatData && <ChannelChatMain />
      )}
      {!selectedChatType && <GradientBackgroud />}
    </div>
  );
};

export default Home;
