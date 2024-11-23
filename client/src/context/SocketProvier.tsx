import { setSelectedChatMessages } from "@/slices/ChatSlice";
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
import { useStore } from "react-redux";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: typeof Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedChatData } = useSelector((state: RootState) => state.chat);
  const selectedChatDataRef = useRef(selectedChatData);

  const [socket, setSocket] = useState<typeof Socket | null>(null);

  const receiveMessageHandler = (message: Message) => {
    // console.log(
    //   selectedChatDataRef.current !== undefined,
    //   " ",
    //   selectedChatDataRef.current?._id === message.sender._id,
    //   " ",
    //   selectedChatDataRef.current?._id === message.recipient._id
    // );

    if (
      selectedChatDataRef.current !== undefined &&
      (selectedChatDataRef.current._id === message.sender._id ||
        selectedChatDataRef.current._id === message.recipient._id)
    ) {
      // console.log("working");

      dispatch(setSelectedChatMessages(message));
    }
  };

  useEffect(() => {
    if (user) {
      let newSocket = io(
        import.meta.env.VITE_SERVER_URI || "http://localhost:3000",
        {
          withCredentials: true,
          query: { userId: user._id },
        }
      );
      setSocket(newSocket);
      newSocket?.on("connect", () => {
        console.log("connected to the server");
      });

      newSocket.on("receiveMessage", receiveMessageHandler);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

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
  return useContext(SocketContext);
};
