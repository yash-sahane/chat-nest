import { RootState } from "@/store/store";
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: typeof Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    // console.log("working");

    // console.log(user);
    if (user) {
      let newSocket = io(
        import.meta.env.VITE_SERVER_URI || "http://localhost:3000",
        {
          withCredentials: true,
          query: { userId: user._id },
        }
      );
      setSocket(newSocket);
      socket?.on("connect", () => {
        console.log("connected to the server");
      });

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
