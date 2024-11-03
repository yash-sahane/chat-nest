import profileLogo from "@/assets/app-logo.png";

const Chat = () => {
  return (
    <div className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear hover:bg-[hsl(var(--chat-card))]">
      <div className="relative max-w-[38px] max-h-[38px] min-w-[38px] min-h-[38px]">
        <img src={profileLogo} className="rounded-full w-full" />
        <span className="absolute bottom-0 right-0 bg-[hsl(var(--status-online))] h-2 w-2 rounded-full"></span>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between">
          <p className="font-semibold text-sm">Omkar Khodse</p>
          <p className="text-sm text-gray-600">4m</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500">Hello world. How are you?</p>
          <span className="flex items-center justify-center px-[6px] rounded-full bg-[hsl(var(--primary))]">
            <p className="text-xs text-white">1</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
