import {
  LogOut,
  MessageCircleMore,
  MessageSquarePlus,
  MessageSquareText,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  User,
} from "lucide-react";
import appLogo from "../assets/app-logo.png";
import { Input } from "@/components/ui/input";
import Chats from "@/components/Chats";
import ToggleTheme from "@/components/ToggleTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import profileLogo from "@/assets/app-logo.png";
import { Button } from "@/components/ui/button";
import EmojiPicker, {
  Theme,
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "@/context/StoreContext";
import ProfilesDialog from "@/components/ProfilesDialog";

const Home = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const emojiRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useStore();

  const logoutHandler = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/user/logout`,
        {
          withCredentials: true,
        }
      );
      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        navigate("/auth");
        setUser({});
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const emojiHandler = (emoji: EmojiClickData) => {
    setMsg((msg) => msg + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const userSearchHandler = async (searchTerm) => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/profiles/getProfiles`,
        { searchTerm },
        { withCredentials: true }
      );
      const { data } = response;
      setUsers(data.data);
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => handleClickOutside();
  }, [useRef]);

  return (
    <div className="custom-transition flex gap-3 h-screen p-4 pl-0">
      <div className="min-w-16 w-16 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-3 items-center">
          <img src={appLogo} alt="" className="w-[40px]" />
          <div className="w-[30px] h-[2px] dark:bg-gray-800 bg-gray-300 bottom-[-2px]"></div>
          <div className="flex flex-col gap-2">
            <MessageSquareText />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 mb-3">
          <ToggleTheme />
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer " asChild>
              <img
                src={appLogo}
                className="rounded-full object-contain w-[38px] h-[38px]"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 ml-3">
              <DropdownMenuGroup>
                <DropdownMenuItem className="focus:bg-[hsl(var(--chat-primary))] cursor-pointer">
                  <User />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem
                className="focus:bg-[hsl(var(--chat-primary))] cursor-pointer"
                onClick={logoutHandler}
              >
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="custom-transition bg-[hsl(var(--chat-bg))] w-1/5 min-w-[300px] max-w-[320px] rounded-2xl p-3">
        <div>
          <p className="text-lg tracking-wide font-bold">Chats</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))] h-[42px] w-full rounded-md">
              <Search size={20} className="absolute left-2 top-[10px]" />
              <Input
                type="text"
                className="custom-transition pl-[34px] h-full w-full bg-transparent placeholder:text-sm placeholder:text-gray-500 rounded-lg"
                placeholder="Search message..."
              />
            </div>
            <ProfilesDialog userSearchHandler={}>
              <div className="custom-transition p-2 cursor-pointer rounded-md hover:bg-[hsl(var(--primary))] hover:text-white bg-[hsl(var(--chat-primary))]">
                <MessageSquarePlus />
              </div>
            </ProfilesDialog>
          </div>
        </div>
        <Chats />
      </div>
      <div className="custom-transition bg-[hsl(var(--chat-bg))] w-4/5 rounded-2xl p-3">
        <div className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]">
          <div className="relative max-w-[38px] max-h-[38px] min-w-[38px] min-h-[38px]">
            <img src={profileLogo} className="rounded-full w-full" />
            <span className="absolute bottom-0 right-0 bg-[hsl(var(--status-online))] h-2 w-2 rounded-full"></span>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between">
              <p className="font-semibold text-sm">Omkar Khodse</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-128px)]"></div>
        <div className="relative transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))] h-[52px] rounded-2xl mt-2">
          <div className="absolute h-full flex gap-3 items-center right-[95px]">
            <Paperclip size={20} />
            <Smile onClick={() => setShowEmojiPicker((prev) => !prev)} />
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-[45px] right-[95px]" ref={emojiRef}>
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
            className="custom-transition pr-[80px] h-full w-full bg-transparent placeholder:text-sm placeholder:text-gray-500 rounded-lg"
            placeholder="Search message..."
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          <div className=" absolute right-2 top-[8px] bg-[hsl(var(--chat-secondary))]">
            <Button className="flex gap-1 py-2 px-2 h-fit">
              Send <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
