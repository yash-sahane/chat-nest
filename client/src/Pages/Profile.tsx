import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import appLogo from "../assets/app-logo.png";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Camera, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useNavigate } from "react-router-dom";
import profileThemeKeys from "@/utils/profileThemeKeys";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { useStore } from "@/context/StoreContext";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const { activeProfileTheme, setActiveProfileTheme } = useStore();

  const themeHandler = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const validateProfile = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!fname) {
      toast.error("First name is required");
      return false;
    }
    if (!lname) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const profileHandler = async () => {
    if (!validateProfile()) {
      return;
    }
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/user/setup`,
        {
          firstName: fname,
          lastName: lname,
          profileTheme: activeProfileTheme,
          avatar: profileImg,
        },
        {
          withCredentials: true,
        }
      );
      const { data } = response;
      console.log(data);

      if (data.success) {
        setFname("");
        setLname("");
        toast.success(data.message);
        if (data.data.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    } catch (e: any) {
      console.log(e);
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
    }
  };

  const profileImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="custom-transition relative w-screen h-screen flex items-center justify-center overflow-hidden">
      <Button
        className="z-10 absolute top-2 right-2 p-2 h-fit"
        onClick={() => themeHandler()}
      >
        <Moon
          size={18}
          className={`${theme === "dark" ? "animation-drop-in" : "hidden"} `}
        />
        <Sun
          size={18}
          className={`${theme === "light" ? "animation-drop-in" : "hidden"}`}
        />
      </Button>
      {/* Background Beams */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <BackgroundBeamsWithCollision
          className="h-full w-full"
          children={undefined}
        />
      </div>

      {/* Main Content */}
      <div className="custom-transition shadow-2xl dark:shadow-inner-bottom relative z-10 p-4 pr-8 w-[60vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-[50rem] min-h-[28rem] max-h-[28rem] rounded-xl flex bg-opacity-90 bg-white dark:bg-[hsl(var(--background))]">
        <div className="flex justify-center items-center flex-col gap-6 w-full">
          <div className="flex flex-col items-center">
            <div>
              <img src={appLogo} alt="applogo" className="w-16" />
            </div>
            <p className="font-semibold text-center mt-2">
              Update your profile details to start chatting with your friends!
            </p>
          </div>
          <div className="w-full">
            <div className="flex gap-4">
              <div className={`w-2/4 flex justify-center items-center`}>
                <div
                  className="bg-[hsl(var(--secondary))] text-5xl w-48 h-48 flex items-center justify-center border border-border rounded-full custom-transition relative overflow-hidden"
                  style={{
                    background:
                      theme === "dark"
                        ? darkProfileTheme[activeProfileTheme].bg
                        : lightProfileTheme[activeProfileTheme].bg,
                    border: `2px solid ${darkProfileTheme[activeProfileTheme].border}`,
                    color: darkProfileTheme[activeProfileTheme].border,
                  }}
                >
                  {profileImg ? <img src={profileImg} alt="" /> : "Y"}
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-pic"
                    className="hidden"
                    onChange={(event) => profileImgHandler(event)}
                  />
                  <label
                    htmlFor="profile-pic"
                    className="transition-all duration-300 absolute hover:bottom-0 -bottom-[32px] rounded-bl-full rounded-br-full m-auto hover:w-full hover:h-full hover:rounded-full w-[82%] h-[73px] flex justify-center items-center bg-[hsl(var(--background))] gap-2 flex-col cursor-pointer"
                  >
                    <Camera />
                    <p className="text-base">Add Profile Picture</p>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4 w-2/4">
                <Input
                  value={email}
                  disabled
                  placeholder="Email"
                  className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Input
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="First Name"
                  className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Input
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  placeholder="Last Name"
                  className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <div className="flex gap-2">
                  {profileThemeKeys.map((profileThemeColor, index) => (
                    <div
                      onClick={() => setActiveProfileTheme(profileThemeColor)}
                      key={index}
                      className="h-8 w-8 rounded-full custom-transition"
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
  );
};

export default Profile;
