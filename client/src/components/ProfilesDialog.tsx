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
import { Search, X } from "lucide-react";
import searchGif from "@/assets/people-search-animate.svg";
import notFoundSVG from "@/assets/404 Error-cuate.svg";
import { ApiResponse, User } from "@/types";
import UserSkeleton from "./UserSkeleton";
import { AppDispatch } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import { useDispatch } from "react-redux";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { getChatMessages } from "@/slices/ChatApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import axios from "axios";

function ProfilesDialog({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUserLoading, setSearchedUserLoading] =
    useState<boolean>(false);

  const chatSelectHandler = async (userProfile: User) => {
    dispatch(setSelectedChatData(userProfile));
    dispatch(setSelectedChatType("chat"));

    dispatch(getChatMessages({ id: userProfile._id }));
  };

  const getProfiles = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/profiles/getProfiles`,
        { searchTerm },
        { withCredentials: true }
      );
      const { data } = response;
      setUsers(data.data);
      setSearchedUserLoading(false);
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    if (searchTerm.length) {
      setSearchedUserLoading(true);
    }
    const timer = setTimeout(() => {
      if (searchTerm.length) {
        getProfiles();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      setSearchedUserLoading(false);
    };
  }, [searchTerm]);

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
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProfilesDialog;
