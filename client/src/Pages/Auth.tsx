import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import victorySVG from "../assets/victory.svg";
import banner from "../assets/Chat-rafiki-cropped (1).svg";
import appLogo from "../assets/app-logo.png";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "@/components/ToggleTheme";
import { useDispatch } from "react-redux";
import { login, signup } from "@/slices/AuthApi";
import { AppDispatch } from "@/store/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const validateSignup = () => {
    if (!validateLogin()) {
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const signupHandler = async () => {
    if (!validateSignup()) {
      return;
    }
    const response = await dispatch(signup({ email, password }));

    if (signup.fulfilled.match(response)) {
      const { message, data } = response.payload;

      toast.success(message);
      if (data.profileSetup) {
        navigate("/");
      } else {
        navigate(`/profile?email=${email}`);
      }
    } else {
      if (response.payload) {
        toast.error(response.payload as string);
      } else {
        toast.error(response.error.message as string);
      }
    }
  };

  const loginHandler = async () => {
    if (!validateLogin()) {
      return;
    }

    const response = await dispatch(login({ email, password }));
    if (login.fulfilled.match(response)) {
      const { firstName, profileSetup } = response.payload;

      toast.success(`Welcome back ${firstName}`);
      setEmail("");
      setPassword("");
      if (profileSetup) {
        navigate("/");
      } else {
        navigate(`/profile?email=${email}`);
      }
    } else {
      if (response.payload) {
        toast.error(response.payload as string);
      } else {
        toast.error(response.error.message as string);
      }
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
      <div className="custom-transition shadow-2xl dark:shadow-inner-bottom relative z-10 p-4 w-[90vw] xsm:w-[90vw] msm:w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] max-w-[60rem]  min-h-[32rem] max-h-[40rem] rounded-xl flex bg-opacity-90 bg-white dark:bg-[hsl(var(--background))]">
        <div className="flex justify-center items-center flex-col w-full md:w-2/4">
          <div>
            <img src={appLogo} alt="applogo" className="w-16" />
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl msm:text-4xl font-bold">Welcome</h1>
            <img
              src={victorySVG}
              alt="victorySVG"
              className="w-[40px] msm:w-full"
            />
          </div>
          <p className="font-semibold text-center mt-2">
            Fill in the details to get started with the best chat app!
          </p>
          <Tabs
            defaultValue="login"
            className="w-[90%] sm:w-3/4 mt-4 transition-all duration-300 ease-linear custom-transition"
          >
            <TabsList className="bg-transparent rounded-none w-full">
              <TabsTrigger
                value="login"
                className="w-full rounded-none text-opacity-90 data-[state=active]:font-semibold data-[state=active]:text-opacity-100 border-b-2 data-[state=active]:border-b-purple-500 transition-all duration-300 custom-transition py-2"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="w-full rounded-none text-opacity-90 data-[state=active]:font-semibold data-[state=active]:text-opacity-100 border-b-2 data-[state=active]:border-b-purple-500 transition-all duration-300 custom-transition py-2"
              >
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="flex flex-col gap-3 mt-4">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Button className="rounded-full" onClick={loginHandler}>
                  Login
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="flex flex-col gap-3 mt-4">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className=" custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className=" custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className=" custom-transition border-2 focus:border-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                />
                <Button className="rounded-full" onClick={signupHandler}>
                  Signup
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden md:flex md:w-2/4 items-center">
          <img src={banner} alt="banner" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
