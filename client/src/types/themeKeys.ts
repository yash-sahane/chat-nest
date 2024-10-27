import profileThemeKeys from "@/utils/profileThemeKeys";

type ThemeKeys = (typeof profileThemeKeys)[number];

type ProfileTheme = {
  [key in ThemeKeys]: {
    bg: string;
    border: string;
  };
};

export default ProfileTheme;
