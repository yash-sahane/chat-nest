import { memo } from "react";
import appLogo from "../assets/app-logo.png";
import ToggleTheme from "@/components/ToggleTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";
import { logout } from "@/slices/AuthApi";
import {
  setChatView,
  setSelectedChannelMessages,
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { LogOut, MessageSquareText, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomeSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { chatView } = useSelector((state: RootState) => state.chat);

  console.log("homesidebar");

  const logoutHandler = async () => {
    const response = await dispatch(logout());

    if (logout.fulfilled.match(response)) {
      toast.success(response.payload.message as string);
      navigate("/auth");
      dispatch(setSelectedChatData(undefined));
      dispatch(setSelectedChatMessages([]));
      dispatch(setSelectedChannelMessages([]));
      dispatch(setSelectedChatType(undefined));
    } else {
      toast.error(response.payload as string);
    }
  };

  const userProfile = () => {
    const borderColor = user?.avatar
      ? `${
          theme === "dark"
            ? darkProfileTheme[user?.profileTheme].border
            : lightProfileTheme[user?.profileTheme].border
        }`
      : `${
          theme === "dark"
            ? darkProfileTheme["violet"].border
            : lightProfileTheme["violet"].border
        }`;

    const bg = user?.avatar
      ? `${
          theme === "dark"
            ? darkProfileTheme[user?.profileTheme].bg
            : lightProfileTheme[user?.profileTheme].bg
        }`
      : `${
          theme === "dark"
            ? darkProfileTheme["violet"].bg
            : lightProfileTheme["violet"].bg
        }`;

    return user?.avatar ? (
      <img
        src={`${import.meta.env.VITE_SERVER_URI}/profiles/${user?.avatar}`}
        className={`p-[2px] rounded-full object-contain w-[40px] h-[40px]`}
        style={{ border: `1px solid ${borderColor}`, background: bg }}
      />
    ) : (
      <div
        className={`p-[2px] rounded-full object-contain w-[40px] h-[40px]`}
        style={{ border: `2px solid ${borderColor}`, background: bg }}
      >
        <p
          className={`text-sm flex items-center justify-center h-full`}
        >{`${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}</p>
      </div>
    );
  };

  return (
    <div className="min-w-16 w-16 flex flex-col justify-between items-center">
      <div className="flex flex-col gap-3 items-center">
        <img src={appLogo} alt="" className="w-[40px]" />
        <span className="w-[30px] h-[2px] dark:bg-gray-800 bg-gray-300 bottom-[-2px]"></span>
        <div className="relative">
          <span
            className={`${
              chatView === "channel" ? "translate-y-[49px]" : ""
            } absolute top-[1px] -left-2 transition-all w-[2px] h-[30px] bg-[hsl(var(--primary))]`}
          ></span>
          <div className="flex flex-col gap-4">
            <div className="cursor-pointer p-1">
              <MessageSquareText
                className="custom-transition"
                onClick={() => dispatch(setChatView("person"))}
              />
            </div>
            <div className="cursor-pointer p-1">
              <Users
                onClick={() => dispatch(setChatView("channel"))}
                className="custom-transition"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mb-3">
        <ToggleTheme />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer " asChild>
            {userProfile()}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 ml-3">
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
  );
};

export default memo(HomeSidebar);
