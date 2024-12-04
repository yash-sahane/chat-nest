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
import { ApiResponse, Channel, User } from "@/types";
import UserSkeleton from "./UserSkeleton";
import { AppDispatch, RootState } from "@/store/store";
import UserProfile from "@/utils/UserProfile";
import { useDispatch } from "react-redux";
import { setSelectedChatData, setSelectedChatType } from "@/slices/ChatSlice";
import { getChannelMessages, getChatMessages } from "@/slices/ChatApi";
import { Button } from "./ui/button";
import React, { useEffect, useRef, useState } from "react";
import CreateChannel from "./CreateChannel";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import axios from "axios";

function ChannelsDialog({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [createChannelView, setCreateChannelView] = useState<boolean>(false);
  const closeDialogRef = useRef<HTMLButtonElement>();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedChannelLoading, setSearchedChannelLoading] =
    useState<boolean>(false);

  const chatSelectHandler = async (channel: Channel) => {
    dispatch(setSelectedChatData(channel));
    dispatch(setSelectedChatType("channel"));

    dispatch(getChannelMessages({ id: channel._id }));
  };

  const createChannelHandler = () => {
    setCreateChannelView((prev) => !prev);
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  const getProfiles = async () => {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/getSearchedChannels`,
        { searchTerm },
        { withCredentials: true }
      );
      const { data } = response;
      console.log(data);

      setChannels(data.data);
      setSearchedChannelLoading(false);
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.response.data.message);
    }
  };

  const joinChannelHandler = async (id: string) => {
    try {
      const { data }: AxiosResponse<ApiResponse> = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/api/channel/join`,
        { id },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.mesage);
      }
    } catch (e: any) {
      console.log(e.response.data.message);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    if (searchTerm.length) {
      setSearchedChannelLoading(true);
    }
    const timer = setTimeout(() => {
      if (searchTerm.length) {
        getProfiles();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      setSearchedChannelLoading(false);
    };
  }, [searchTerm]);

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="transition-all">
          <AlertDialogCancel
            className="p-1 border-none text-gray-400 absolute top-3 right-3 w-fit h-fit bg-transparent !mt-0"
            ref={closeDialogRef}
          >
            <X size={22} className="" />
          </AlertDialogCancel>
          <AlertDialogHeader className="w-full">
            <AlertDialogTitle>Channels</AlertDialogTitle>
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
                <Button className="p-2 h-fit" onClick={createChannelHandler}>
                  <CirclePlus />
                </Button>
              </div>
              {channels.length ? (
                <p className="text-sm text-gray-400 -mt-1">
                  Showing {channels.length} results
                </p>
              ) : (
                ""
              )}
              {channels.map((channel) => {
                return (
                  <AlertDialogCancel
                    className="reset-classes"
                    key={channel._id}
                  >
                    <div
                      className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]"
                      // onClick={() => chatSelectHandler(channel)}
                    >
                      <UserProfile userProfile={channel} />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between">
                          <p className="font-semibold text-sm">{`${channel.name}`}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">
                            {channel.members.length} member
                            {channel.members.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="h-fit py-2 px-4"
                        onClick={() => joinChannelHandler(channel._id)}
                      >
                        Join
                      </Button>
                    </div>
                  </AlertDialogCancel>
                );
              })}
              <div>
                <img
                  className={`${
                    !channels.length && !searchTerm ? "w-full" : "w-0"
                  } transition-all`}
                  src={searchGif}
                />
                <div className={`flex flex-col items-center`}>
                  <img
                    className={`${
                      !channels.length && searchTerm && !searchedChannelLoading
                        ? "w-full"
                        : "w-0 opacity-0"
                    } transition-all`}
                    src={notFoundSVG}
                  />
                  <p
                    className={`${
                      !channels.length && searchTerm && !searchedChannelLoading
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
                    searchedChannelLoading ? "h-fit" : "h-0"
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
      <div
        className={`${
          createChannelView
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 hidden pointer-events-none"
        }`}
      >
        <CreateChannel
          createChannelView={createChannelView}
          setCreateChannelView={setCreateChannelView}
        />
      </div>
    </>
  );
}

export default ChannelsDialog;
