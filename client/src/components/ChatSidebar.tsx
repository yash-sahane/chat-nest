import { MessageSquarePlus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import ProfilesDialog from "./ProfilesDialog";
import Chats from "./Chats";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
import axios from "axios";

const ChatSidebar = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUserLoading, setSearchedUserLoading] =
    useState<boolean>(false);

  const getProfiles = async () => {
    try {
      // setSearchedUserLoading(true);
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
    setUsers([]);

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
          <ProfilesDialog
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchedUserLoading={searchedUserLoading}
          >
            <div className="custom-transition p-2 cursor-pointer rounded-md hover:bg-[hsl(var(--primary))] hover:text-white bg-[hsl(var(--chat-primary))]">
              <MessageSquarePlus />
            </div>
          </ProfilesDialog>
        </div>
      </div>
      <Chats />
    </div>
  );
};

export default ChatSidebar;
