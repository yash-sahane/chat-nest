import { setSelectedChatMessages } from "@/slices/ChatSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Message } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: typeof Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedChatData } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const [socket, setSocket] = useState<typeof Socket | null>(null);

  const receiveMessageHandler = (message: Message) => {
    if (
      selectedChatData !== undefined &&
      (selectedChatData._id === message.sender._id ||
        selectedChatData._id === message.recipient._id)
    ) {
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

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
