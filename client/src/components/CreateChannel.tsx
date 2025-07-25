import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { setActiveProfileTheme } from "@/slices/AuthSlice";
import { Camera, Trash, X } from "lucide-react";
import profileThemeKeys from "@/utils/profileThemeKeys";
import { useTheme } from "@/context/ThemeProvider";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { ApiResponse, User } from "@/types";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { createChannel, getUserChannels } from "@/slices/ChatApi";

const CreateChannel = ({
  setCreateChannelView,
}: {
  createChannelView: boolean;
  setCreateChannelView: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { theme } = useTheme();
  const { activeProfileTheme } = useSelector((state: RootState) => state.auth);
  const [channelName, setChannelName] = useState<string>("");
  const [profileImg, setProfileImg] = useState<File>();
  const dispatch = useDispatch<AppDispatch>();
  const [allProfiles, setAllProfiles] = useState<User[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const validChannel = () => {
    if (!channelName) {
      toast.error("Channel name is required");
      return false;
    }
    if (selectedProfiles.length <= 0) {
      toast.error("At least one profile is required");
      return false;
    }
    return true;
  };

  const createChannelHandler = async () => {
    if (!validChannel()) {
      return;
    }

    const formData = new FormData();
    if (profileImg) formData.append("image", profileImg);
    formData.append("profileTheme", activeProfileTheme);
    formData.append("channelName", channelName);
    formData.append("selectedProfiles", JSON.stringify(selectedProfiles));

    const response = await dispatch(createChannel({ formData }));
    if (createChannel.fulfilled.match(response)) {
      const { message } = response.payload;

      toast.success(message as string);
      setCreateChannelView(false);
      dispatch(getUserChannels());
      setChannelName("");
      setProfileImg(undefined);
      setAllProfiles([]);
      setSelectedProfiles([]);
    } else {
      if (response.payload) {
        toast.error(response.payload as string);
      } else {
        toast.error(response.error.message as string);
      }
    }
  };

  const profileImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_SERVER_URI}/api/user/getAllUsers`,
          { withCredentials: true }
        );
        if (data.success) {
          setAllProfiles(data.data);
        } else {
          toast.error(data.message as string);
        }
      } catch (e: any) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="z-[99] transition-all w-full h-full flex items-center justify-center absolute top-0 left-0 backdrop-blur-md">
      <div className="relative">
        <div className="z-[100] cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground sm:mt-0 p-1 border-none text-gray-600 absolute top-3 right-3 w-fit h-fit bg-transparent hover:bg-[hsl(var(--chat-primary))]">
          <X size={22} onClick={() => setCreateChannelView((prev) => !prev)} />
        </div>
        <div className="custom-transition shadow-2xl dark:shadow-inner-bottom relative z-10 p-4 pr-8 w-[90vw] msm:w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-[50rem] min-h-[21rem] max-h-full sm:max-h-[28rem] rounded-xl flex bg-opacity-90 bg-white dark:bg-[hsl(var(--background))]">
          <div className="flex justify-center items-center flex-col gap-6 w-full">
            <div className="flex flex-col items-center">
              {/* <img src={appLogo} alt="applogo" className="w-16" /> */}
              <p className="font-semibold text-xl text-center">
                Create new Channel!
              </p>
            </div>
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={`w-full sm:w-2/4 flex justify-center items-center`}
                >
                  <div
                    className="bg-[hsl(var(--secondary))] text-5xl sm:w-48 w-36 sm:h-48 h-36 flex items-center justify-center border border-border rounded-full transition-all duration-300 ease-linear custom-transition relative overflow-hidden"
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
                      `${channelName?.[0]?.toUpperCase() ?? ""}`
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
                        -bottom-[42px] sm:-bottom-[28px] rounded-bl-full rounded-br-full m-auto hover:w-full hover:h-full hover:rounded-full w-[82%] h-[73px] flex justify-center items-center bg-[hsl(var(--background))] gap-2 flex-col cursor-pointer`}
                      >
                        <Camera />
                        <p className="text-sm sm:text-base">
                          Add Profile Picture
                        </p>
                      </label>
                    ) : (
                      <div
                        className={`transition-all duration-150 ease-linear absolute hover:bottom-0  -bottom-[50px] sm:-bottom-[60px]  rounded-bl-full rounded-br-full m-auto hover:w-full hover:h-full hover:rounded-full w-[82%] h-[80px] flex justify-center items-center bg-[hsl(var(--background))] gap-2 flex-col cursor-pointer`}
                        onClick={() => {
                          setProfileImg(undefined);
                        }}
                      >
                        <Trash />
                        <p className="text-sm text-center sm:text-base">
                          Remove Profile Picture
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4 w-full sm:w-2/4">
                  <Input
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Channel name"
                    className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                  />
                  <MultiSelector
                    values={selectedProfiles}
                    onValuesChange={setSelectedProfiles}
                    loop
                    className="!max-w-full sm:max-w-xs"
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select profiles" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {allProfiles.map((profile) => (
                          <MultiSelectorItem
                            value={profile._id}
                            key={profile._id}
                          >
                            {profile.firstName} {profile.lastName}
                          </MultiSelectorItem>
                        ))}

                        {/* <MultiSelectorItem value={"Vue"}>Vue</MultiSelectorItem>
                      <MultiSelectorItem value={"Svelte"}>
                        Svelte
                      </MultiSelectorItem> */}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>

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
                  <Button
                    className="rounded-full"
                    onClick={createChannelHandler}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateChannel);
