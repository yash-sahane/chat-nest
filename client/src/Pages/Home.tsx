import { MessageSquarePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Chats from "@/components/Chats";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
import toast from "react-hot-toast";
import axios from "axios";
import ProfilesDialog from "@/components/ProfilesDialog";
import ChatMain from "@/components/ChatMain";
import HomeSidebar from "@/components/HomeSidebar";
import ChatSidebar from "@/components/ChatSidebar";

const Home = () => {
  return (
    <div className="custom-transition flex gap-3 h-screen p-4 pl-0">
      <div className="flex gap-1">
        <HomeSidebar />
        <ChatSidebar />
      </div>
      <ChatMain />
    </div>
  );
};

export default Home;
