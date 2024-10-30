import { LogOut, MessageCircleMore, Search } from "lucide-react";
import appLogo from "../assets/app-logo.png";

const Chat = () => {
  return (
    <div className="flex gap-2 h-screen p-4 pl-0">
      <div className="w-14 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-3 items-center">
          <img src={appLogo} alt="" className="w-[40px]" />
          <div className="w-[30px] h-[2px] bg-gray-800 bottom-[-2px]"></div>
          <div className="flex flex-col gap-2">
            <MessageCircleMore />
          </div>
        </div>
        <div>
          <LogOut />
        </div>
      </div>
      <div className="w-1/5 min-w-[250px] bg-[#180e39] rounded-xl p-2">
        <div>
          <p className="text-xl tracking-wide font-bold">Chats</p>
          <div className="flex items-center p-2 gap-2 bg-[hsl(var(--background))] h-[38px] rounded-md mt-2">
            <Search className="w-[20px]" />
            <input type="text" className="bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
