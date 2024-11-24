import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { CirclePlus, Search, X } from "lucide-react";
import searchGif from "@/assets/people-search-animate.svg";
import notFoundSVG from "@/assets/404 Error-cuate.svg";
import { User } from "@/types";
import UserSkeleton from "./UserSkeleton";
import { AppDispatch, RootState } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import { useDispatch } from "react-redux";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { getChatMessages } from "@/slices/ChatApi";
import { Button } from "./ui/button";
import { useTheme } from "@/context/ThemeProvider";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { setActiveProfileTheme } from "@/slices/AuthSlice";
import { Camera, Trash } from "lucide-react";
import profileThemeKeys from "@/utils/profileThemeKeys";
import { useSelector } from "react-redux";
import { useState } from "react";
import { setup } from "@/slices/AuthApi";
import toast from "react-hot-toast";

function ChannelsDialog({
  users,
  children,
  searchTerm,
  setSearchTerm,
  searchedUserLoading,
}: {
  children: React.ReactNode;
  users: User[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchedUserLoading: boolean;
}) {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { activeProfileTheme } = useSelector((state: RootState) => state.auth);
  const [channelName, setChannelName] = useState<string>("");
  const [profileImg, setProfileImg] = useState<File>();

  const chatSelectHandler = async (userProfile: User) => {
    dispatch(setSelectedChatData(userProfile));
    dispatch(setSelectedChatType("chat"));

    dispatch(getChatMessages({ id: userProfile._id }));
  };

  const validateProfile = () => {
    if (!channelName) {
      toast.error("Channel name is required");
      return false;
    }
    return true;
  };

  const profileHandler = async () => {
    if (!validateProfile()) {
      return;
    }

    const formData = new FormData();
    profileImg && formData.append("image", profileImg);
    formData.append("profileTheme", activeProfileTheme);

    const response = await dispatch(setup({ formData }));
    if (setup.fulfilled.match(response)) {
      const { message, data } = response.payload;
      toast.success(message);
      if (data.profileSetup) {
        // navigate("/");
      }
    } else {
      if (response.payload) {
        toast.error(response.payload as string);
      } else {
        toast.error(response.error.message as string);
      }
    }
  };

  const profileImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("profileimghandler");

    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md">
        <div className="custom-transition shadow-2xl z-10 p-4 pr-8 w-[60vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-[50rem] min-h-[20rem] max-h-[24rem] rounded-xl flex bg-opacity-90 bg-white dark:bg-[hsl(var(--background))]">
          <div className="flex justify-center items-center flex-col gap-6 w-full">
            <div className="flex flex-col items-center">
              {/* <img src={appLogo} alt="applogo" className="w-16" /> */}
              <p className="font-semibold text-xl text-center mt-2">
                Create new Channel!
              </p>
            </div>
            <div className="w-full">
              <div className="flex gap-4">
                <div className={`w-2/4 flex justify-center items-center`}>
                  <div
                    className="bg-[hsl(var(--secondary))] text-5xl w-48 h-48 flex items-center justify-center border border-border rounded-full transition-all duration-300 ease-linear custom-transition relative overflow-hidden"
                    style={{
                      background:
                        theme === "dark"
                          ? darkProfileTheme[activeProfileTheme].bg
                          : lightProfileTheme[activeProfileTheme].bg,
                      border: `2px solid ${darkProfileTheme[activeProfileTheme].border}`,
                      color: darkProfileTheme[activeProfileTheme].border,
                    }}
                  >
                    {profileImg ? (
                      <img
                        src={URL.createObjectURL(profileImg)}
                        className="h-full object-contain"
                      />
                    ) : (
                      `${channelName?.[0]?.toUpperCase() ?? ""}${
                        channelName?.[0]?.toUpperCase() ?? ""
                      }`
                    )}
                    {!profileImg && (
                      <input
                        type="file"
                        accept="image/*"
                        id="profile-pic"
                        className="hidden"
                        onChange={(event) => profileImgHandler(event)}
                      />
                    )}
                    {!profileImg ? (
                      <label
                        htmlFor="profile-pic"
                        className={`transition-all duration-150 ease-linear absolute hover:bottom-0
                        -bottom-[32px] rounded-bl-full rounded-br-full m-auto hover:w-full hover:h-full hover:rounded-full w-[82%] h-[73px] flex justify-center items-center bg-[hsl(var(--background))] gap-2 flex-col cursor-pointer`}
                      >
                        <Camera />
                        <p className="text-base">Add Profile Picture</p>
                      </label>
                    ) : (
                      <div
                        className={`transition-all duration-150 ease-linear absolute hover:bottom-0 -bottom-[60px] rounded-bl-full rounded-br-full m-auto hover:w-full hover:h-full hover:rounded-full w-[82%] h-[100px] flex justify-center items-center bg-[hsl(var(--background))] gap-2 flex-col cursor-pointer`}
                        onClick={() => {
                          setProfileImg(undefined);
                        }}
                      >
                        <Trash />
                        <p className="text-base">Remove Profile Picture</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4 w-2/4">
                  <Input
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Channel name"
                    className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                  />
                  <div className="flex gap-2">
                    {profileThemeKeys.map((profileThemeColor, index) => (
                      <div
                        onClick={() =>
                          dispatch(setActiveProfileTheme(profileThemeColor))
                        }
                        key={index}
                        className="h-8 w-8 rounded-full transition-all duration-150 ease-linear custom-transition"
                        style={{
                          background:
                            theme === "dark"
                              ? darkProfileTheme[profileThemeColor].bg
                              : lightProfileTheme[profileThemeColor].bg,
                          border:
                            activeProfileTheme === profileThemeColor
                              ? `3px solid ${darkProfileTheme[profileThemeColor].border}`
                              : `1px solid ${darkProfileTheme[profileThemeColor].border}`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <Button className="rounded-full" onClick={profileHandler}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="transition-all">
          <AlertDialogCancel className="p-1 border-none text-gray-400 absolute top-3 right-3 w-fit h-fit bg-transparent !mt-0">
            <X size={22} className="" />
          </AlertDialogCancel>
          <AlertDialogHeader className="w-full">
            <AlertDialogTitle>Users</AlertDialogTitle>
            <AlertDialogDescription className="hidden"></AlertDialogDescription>
            <div className="flex flex-col gap-3 relative w-full rounded-md max-h-[38rem]">
              <div className="flex gap-2">
                <Search size={20} className="absolute left-2 top-[10px]" />
                <Input
                  type="text"
                  className="custom-transition bg-[hsl(var(--chat-primary))] pl-[34px] min-h-[42px] h-[42px] w-full placeholder:text-sm placeholder:text-gray-500 rounded-lg"
                  placeholder="Search for channel name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="p-2 h-fit">
                  <CirclePlus />
                </Button>
              </div>
              {users.length ? (
                <p className="text-sm text-gray-400 -mt-1">
                  Showing {users.length} results
                </p>
              ) : (
                ""
              )}
              {users.map((user) => {
                return (
                  <AlertDialogCancel className="reset-classes" key={user._id}>
                    <div
                      className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]"
                      onClick={() => chatSelectHandler(user)}
                    >
                      <UserProfile userProfile={user} />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between">
                          <p className="font-semibold text-sm">{`${user.firstName} ${user.lastName}`}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">Online</p>
                        </div>
                      </div>
                    </div>
                  </AlertDialogCancel>
                );
              })}
              <div>
                <img
                  className={`${
                    !users.length && !searchTerm ? "w-full" : "w-0"
                  } transition-all`}
                  src={searchGif}
                />
                <div className={`flex flex-col items-center`}>
                  <img
                    className={`${
                      !users.length && searchTerm && !searchedUserLoading
                        ? "w-full"
                        : "w-0 opacity-0"
                    } transition-all`}
                    src={notFoundSVG}
                  />
                  <p
                    className={`${
                      !users.length && searchTerm && !searchedUserLoading
                        ? "flex"
                        : "hidden"
                    } flex-col gap-1 items-center mb-2`}
                  >
                    <span className="text-lg font-bold text-gray-300">
                      CHANNEL NOT FOUND
                    </span>
                    <span className="text-gray-500 text-center">
                      We couldn't find any channel matching your search
                      criteria.
                    </span>
                    <span className="text-gray-500 text-center">
                      Please try again with a different search term.
                    </span>
                  </p>
                </div>
                <div
                  className={`${
                    searchedUserLoading ? "h-fit" : "h-0"
                  } flex flex-col overflow-hidden`}
                >
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </div>
              </div>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChannelsDialog;
