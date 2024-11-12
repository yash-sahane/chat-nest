import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import profileLogo from "@/assets/app-logo.png";
import searchGif from "@/assets/people-search-animate.svg";
import notFoundSVG from "@/assets/404 Error-cuate.svg";
import User from "@/types/user";
import UserSkeleton from "./UserSkeleton";
import { useTheme } from "@/context/ThemeProvider";
import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import { useDispatch } from "react-redux";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";

function ProfilesDialog({
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
  const dispatch = useDispatch<AppDispatch>();

  const chatSelectHandler = (userProfile: User) => {
    dispatch(setSelectedChatData(userProfile));
    dispatch(setSelectedChatType("chat"));
  };

  return (
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
            <Search size={20} className="absolute left-2 top-[10px]" />
            <Input
              type="text"
              className="custom-transition bg-[hsl(var(--chat-primary))] pl-[34px] min-h-[42px] h-[42px] w-full placeholder:text-sm placeholder:text-gray-500 rounded-lg"
              placeholder="Search for name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {users.length ? (
              <p className="text-sm text-gray-400 -mt-1">
                Showing {users.length} results
              </p>
            ) : (
              ""
            )}
            {users.map((user) => {
              return (
                <AlertDialogCancel className="reset-classes">
                  <div
                    className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]"
                    onClick={() => chatSelectHandler(user)}
                  >
                    <UserProfile user={user} />
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
                    USER NOT FOUND
                  </span>
                  <span className="text-gray-500 text-center">
                    We couldn't find any users matching your search criteria.
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
        {/* <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProfilesDialog;
