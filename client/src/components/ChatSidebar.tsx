import { MessageSquarePlus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import ProfilesDialog from "./ProfilesDialog";
import Chats from "./Chats";
import { AxiosResponse } from "axios";
import { ApiResponse, DMProfile } from "@/types";
import axios from "axios";
import ChannelsDialog from "./ChannelsDialog";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ChannelChats from "./ChannelChats";
import { useDispatch } from "react-redux";
import { getUserChannels } from "@/slices/ChatApi";
import { setStatusChanged } from "@/slices/ChatSlice";

const ChatSidebar = () => {
  const [DMProfiles, setDMProfiles] = useState<DMProfile[] | []>([]);
  const { selectedChatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const [searchDMProfiles, setSearchDMProfiles] = useState<string>("");
  const [searchChannels, setSearchChannels] = useState<string>("");
  const { chatView, channels, statusChaged } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("running");

    if (chatView === "person") {
      const getProfilesForDMList = async () => {
        const { data }: AxiosResponse<ApiResponse> = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URI
          }/api/profiles/getProfilesForDMList`,
          { withCredentials: true }
        );

        console.log(data);

        if (data.success) {
          setDMProfiles(data.data);
        }
      };

      getProfilesForDMList();
      dispatch(setStatusChanged(false));
    } else {
      setDMProfiles([]);
      dispatch(getUserChannels());
    }
  }, [chatView, selectedChatMessages, statusChaged]);

  useEffect(() => {
    console.log("running for status");
    return () => {};
  }, [statusChaged]);

  const filteredProfiles = DMProfiles.filter((profile) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    return fullName.includes(searchDMProfiles.toLowerCase());
  });

  // const filteredChannels = channels;
  const filteredChannels = channels.filter((channel) => {
    const channelName = channel.name.toLowerCase();
    return channelName.includes(searchChannels.toLowerCase());
  });

  const chatSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (chatView === "person") {
      setSearchDMProfiles(e.target.value);
    } else {
      setSearchChannels(e.target.value);
    }
  };

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
              placeholder={`${
                chatView === "person" ? "Search profile" : "Search channel"
              }...`}
              onChange={chatSearchHandler}
            />
          </div>
          {chatView === "person" ? (
            <ProfilesDialog>
              <div className="custom-transition p-2 cursor-pointer rounded-md hover:bg-[hsl(var(--primary))] hover:text-white bg-[hsl(var(--chat-primary))]">
                <MessageSquarePlus />
              </div>
            </ProfilesDialog>
          ) : (
            <ChannelsDialog>
              <div className="custom-transition p-2 cursor-pointer rounded-md hover:bg-[hsl(var(--primary))] hover:text-white bg-[hsl(var(--chat-primary))]">
                <MessageSquarePlus />
              </div>
            </ChannelsDialog>
          )}
        </div>
      </div>
      {chatView === "person" && <Chats filteredProfiles={filteredProfiles} />}
      {chatView === "channel" && (
        <ChannelChats filteredChannels={filteredChannels} />
      )}
    </div>
  );
};

export default ChatSidebar;
