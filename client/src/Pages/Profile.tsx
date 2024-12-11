import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import appLogo from "../assets/app-logo.png";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Camera, Trash } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import profileThemeKeys from "@/utils/profileThemeKeys";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import ToggleTheme from "@/components/ToggleTheme";
import { useDispatch } from "react-redux";
import { setup } from "@/slices/AuthApi";
import { AppDispatch, RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { setActiveProfileTheme } from "@/slices/AuthSlice";

const Profile = () => {
  const { theme } = useTheme();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [profileImg, setProfileImg] = useState<File>();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const dispatch = useDispatch<AppDispatch>();
  const { activeProfileTheme } = useSelector((state: RootState) => state.auth);

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

    const formData = new FormData();
    profileImg && formData.append("image", profileImg);
    formData.append("firstName", fname);
    formData.append("lastName", lname);
    formData.append("profileTheme", activeProfileTheme);

    const response = await dispatch(setup({ formData }));
    if (setup.fulfilled.match(response)) {
      setFname("");
      setLname("");

      const { message, data } = response.payload;
      toast.success(message as string);
      if (data.profileSetup) {
        navigate("/");
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
    <div className="custom-transition relative w-screen h-screen flex items-center justify-center overflow-hidden">
      <ToggleTheme position="absolute" top={8} right={8} />
      {/* Background Beams */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <BackgroundBeamsWithCollision
          className="h-full w-full"
          children={undefined}
        />
      </div>

      {/* Main Content */}
      <div className="custom-transition shadow-2xl dark:shadow-inner-bottom relative z-10 p-4 pr-8 w-[90vw] msm:w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-[50rem] min-h-[28rem] max-h-full sm:max-h-[28rem] rounded-xl flex bg-opacity-90 bg-white dark:bg-[hsl(var(--background))]">
        <div className="flex justify-center items-center flex-col gap-6 w-full">
          <div className="flex flex-col items-center">
            <img src={appLogo} alt="applogo" className="w-16" />
            <p className="font-semibold text-center mt-2">
              Update your profile details to start chatting with your friends!
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
                  ) : email && !fname && !lname ? (
                    email[0]
                  ) : (
                    `${fname?.[0]?.toUpperCase() ?? ""}${
                      lname?.[0]?.toUpperCase() ?? ""
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
                  value={email || ""}
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
  );
};

export default Profile;
