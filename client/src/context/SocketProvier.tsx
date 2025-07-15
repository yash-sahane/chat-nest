import { getDMProfiles, getUserChannels } from "@/slices/ChatApi";
import {
  setSelectedChannelMessages,
  setSelectedChatMessages,
  updateMessageReadStatus,
  updateUserStatus,
} from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Message } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

type SocketContextType = {
  socket: typeof Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChatData, chatView } = useSelector(
    (state: RootState) => state.chat
  );
  const selectedChatDataRef = useRef(selectedChatData);

  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    const receiveMessageHandler = (message: Message) => {
      if (
        selectedChatDataRef.current !== undefined &&
        (selectedChatDataRef.current._id === message.sender._id ||
          selectedChatDataRef.current._id === message.recipient?._id)
      ) {
        dispatch(setSelectedChatMessages(message));
      } else {
        dispatch(getDMProfiles());
      }
    };

    const receiveChannelMessageHandler = (message: Message) => {
      if (
        selectedChatDataRef.current !== undefined &&
        selectedChatDataRef.current._id === message.channel
      ) {
        dispatch(setSelectedChannelMessages(message));
      } else {
        dispatch(getUserChannels());
      }
    };

    const statusChangeHandler = (user: {
      userId: string;
      status: "online" | "offline";
    }) => {
      console.log(user);
      if (chatView === "person") {
        dispatch(updateUserStatus(user));
        // dispatch(getDMProfiles());
      }
    };

    const messageMarkedAsRead = async ({
      messageId,
    }: {
      messageId: string;
    }) => {
      console.log("assume im a receiver");

      const element = document.querySelector("[data-message-id]");
      if (element?.getAttribute("data-message-id") === messageId) {
        console.log("gotcha");

        element.setAttribute("data-is-read", "true");
      }
      dispatch(updateMessageReadStatus(messageId));
    };

    if (user) {
      const newSocket = io(
        import.meta.env.VITE_SERVER_URI || "http://localhost:3000",
        {
          query: { userId: user._id },
        }
      );
      setSocket(newSocket);
      newSocket?.on("connect", () => {
        console.log("connected to the server");
      });

      newSocket.emit("userOnline");
      newSocket.on("userStatusChanged", statusChangeHandler);
      newSocket.on("receiveMessage", receiveMessageHandler);
      newSocket.on("messageMarkedAsRead", messageMarkedAsRead);
      newSocket.on("receiveChannelMessage", receiveChannelMessageHandler);

      return () => {
        newSocket.close();
      };
    }
  }, [chatView, dispatch, user]);

  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
  }, [selectedChatData]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
