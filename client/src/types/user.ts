import { ProfileThemeKeys } from "@/utils/profileThemeKeys";

type User = {
  _id: string;
  email: string;
  password: string;
  profileSetup: boolean;
  firstName: string;
  lastName: string;
  profileTheme: ProfileThemeKeys;
  avatar: string;
};

export default User;
