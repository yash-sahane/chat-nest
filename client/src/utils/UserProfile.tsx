import { darkProfileTheme, lightProfileTheme } from "@/utils/profileTheme";
import { useTheme } from "@/context/ThemeProvider";
import { User } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const UserProfile = ({ userProfile }: { userProfile: User }) => {
  let { user } = useSelector((state: RootState) => state.auth);
  user = userProfile ? userProfile : user;
  const { theme } = useTheme();
  const borderColor = user?.avatar
    ? `${
        theme === "dark"
          ? darkProfileTheme[user?.profileTheme].border
          : lightProfileTheme[user?.profileTheme].border
      }`
    : `${
        theme === "dark"
          ? darkProfileTheme["violet"].border
          : lightProfileTheme["violet"].border
      }`;

  const bg = user?.avatar
    ? `${
        theme === "dark"
          ? darkProfileTheme[user?.profileTheme].bg
          : lightProfileTheme[user?.profileTheme].bg
      }`
    : `${
        theme === "dark"
          ? darkProfileTheme["violet"].bg
          : lightProfileTheme["violet"].bg
      }`;

  return user?.avatar ? (
    <img
      src={`http://localhost:3000/profiles/${user?.avatar}`}
      className={`p-[2px] rounded-full object-contain w-[40px] h-[40px] min-w-[40px]`}
      style={{ border: `1px solid ${borderColor}`, background: bg }}
    />
  ) : (
    <div
      className={`p-[2px] rounded-full object-contain w-[40px] h-[40px] min-w-[40px]`}
      style={{ border: `2px solid ${borderColor}`, background: bg }}
    >
      <p
        className={`text-sm flex items-center justify-center h-full`}
      >{`${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}</p>
    </div>
  );
};

export default UserProfile;
