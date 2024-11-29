import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";

type ToggleThemeProps = {
  position?: "relative" | "absolute";
  top?: number;
  right?: number;
};

const ToggleTheme = ({
  position = "relative",
  top = 0,
  right = 0,
}: ToggleThemeProps) => {
  const { theme, setTheme } = useTheme();
  const themeHandler = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  // console.log(position, top, right);

  return (
    <Button
      style={{ position, top: `${top}px`, right: `${right}px` }}
      className="z-10 p-2 h-fit"
      onClick={() => themeHandler()}
    >
      <Moon
        size={18}
        className={`${theme === "dark" ? "animation-drop-in" : "hidden"} `}
      />
      <Sun
        size={18}
        className={`${theme === "light" ? "animation-drop-in" : "hidden"}`}
      />
    </Button>
  );
};

export default ToggleTheme;
