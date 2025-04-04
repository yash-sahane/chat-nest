import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { useTheme } from "@/context/ThemeProvider";
import { Channel, DMProfile, User } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { isChannel } from "./type";

const UserProfile = ({
  userProfile,
}: {
  userProfile: User | Channel | DMProfile | undefined;
}) => {
  let { user } = useSelector((state: RootState) => state.auth);
  user = userProfile?._id ? (userProfile as User) : (user as User);

  const { theme } = useTheme();
  const borderColor =
    theme === "dark"
      ? darkProfileTheme[user?.profileTheme].border
      : lightProfileTheme[user?.profileTheme].border;

  const bg =
    theme === "dark"
      ? darkProfileTheme[user?.profileTheme].bg
      : lightProfileTheme[user?.profileTheme].bg;

  return user?.avatar ? (
    <img
      src={`http://localhost:3000/profiles/${user?.avatar}`}
      className={`custom-transition p-[2px] rounded-full object-contain w-[40px] h-[40px] min-w-[40px]`}
      style={{ border: `1px solid ${borderColor}`, background: bg }}
    />
  ) : (
    <div
      className={`custom-transition p-[2px] rounded-full object-contain w-[40px] h-[40px] min-w-[40px]`}
      style={{ border: `2px solid ${borderColor}`, background: bg }}
    >
      {user?.firstName ? (
        <p
          className={`text-sm flex items-center justify-center h-full`}
        >{`${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}</p>
      ) : (
        <p className={`text-sm flex items-center justify-center h-full`}>{`${
          isChannel(user) && user?.name[0].toUpperCase()
        }`}</p>
      )}
    </div>
  );
};

export default UserProfile;
