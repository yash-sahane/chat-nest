import ChatMain from "@/components/ChatMain";
import HomeSidebar from "@/components/HomeSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import { AxiosResponse } from "axios";
import { ApiResponse, DMProfile } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useStore } from "@/context/StoreContext";
import { useDispatch } from "react-redux";
import { createChannel, getChannels } from "@/slices/ChatApi";
import toast from "react-hot-toast";

const Home = () => {
  const [DMProfiles, setDMProfiles] = useState<DMProfile[] | []>([]);
  const { selectedChatMessages } = useSelector(
    (state: RootState) => state.chat
  );
  const { chatView } = useStore();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (chatView === "person") {
      const getProfilesForDMList = async () => {
        const { data }: AxiosResponse<ApiResponse> = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URI
          }/api/profiles/getProfilesForDMList`,
          { withCredentials: true }
        );

        if (data.success) {
          setDMProfiles(data.data);
        }
      };

      getProfilesForDMList();
    } else {
      setDMProfiles([]);
      dispatch(getChannels());

      // if (getChannels.fulfilled.match(response)) {
      //   const { message, data } = response.payload;

      // } else {
      //   if (response.payload) {
      //     toast.error(response.payload as string);
      //   } else {
      //     toast.error(response.error.message as string);
      //   }
      // }
      //   }
    }
  }, [chatView, selectedChatMessages, chatView]);

  return (
    <div className="custom-transition flex gap-3 h-screen p-4 pl-0">
      <div className="flex gap-1">
        <HomeSidebar />
        <ChatSidebar DMProfiles={DMProfiles} />
      </div>
      <ChatMain />
    </div>
  );
};

export default Home;
