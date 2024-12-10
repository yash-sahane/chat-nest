import ChatMain from "@/components/ChatMain";
import HomeSidebar from "@/components/HomeSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import ChannelChatMain from "@/components/ChannelChatMain";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import GradientBackground from "@/components/GradientBackground";

const Home = () => {
  const { selectedChatType, selectedChatData } = useSelector(
    (state: RootState) => state.chat
  );

  console.log("home");

  return (
    <div className="custom-transition bg-[hsl(var(--background))] flex gap-[10px] sm:gap-3 h-screen p-4 pl-0">
      <div
        className={`transition-all flex gap-1 max-sm:overflow-hidden ${
          !selectedChatData ? "max-sm:w-full" : "max-sm:w-16"
        }`}
      >
        <HomeSidebar />
        <ChatSidebar />
      </div>
      {selectedChatType === "chat" ? (
        <ChatMain />
      ) : (
        selectedChatData && <ChannelChatMain />
      )}
      {!selectedChatType && <GradientBackground />}
    </div>
  );
};

export default Home;
