import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import profileLogo from "@/assets/app-logo.png";
import searchGif from "@/assets/people-search-animate.svg";

function ProfilesDialog({
  children,
  userSearchHandler,
}: {
  children: React.ReactNode;
  userSearchHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogCancel className="p-1 border-none text-gray-400 absolute top-3 right-3 w-fit h-fit bg-transparent !mt-0">
          <X size={22} className="" />
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle>Users</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-2 relative transition-all duration-150 ease-linear w-full rounded-md">
              <Search size={20} className="absolute left-2 top-[10px]" />
              <Input
                type="text"
                className="custom-transition pl-[34px] h-[42px] w-full placeholder:text-sm placeholder:text-gray-500 rounded-lg"
                placeholder="Search for name or email"
                onChange={(e) => userSearchHandler(e.target.value)}
              />
              {/* <div className="rounded-2xl flex gap-3 items-center p-2 py-3 cursor-pointer transition-all duration-150 ease-linear bg-[hsl(var(--chat-primary))]">
                <div className="relative max-w-[38px] max-h-[38px] min-w-[38px] min-h-[38px]">
                  <img src={profileLogo} className="rounded-full w-full" />
                  <span className="absolute bottom-0 right-0 bg-[hsl(var(--status-online))] h-2 w-2 rounded-full"></span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">Omkar Khodse</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>
              </div> */}
              <img src={searchGif} alt="" />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProfilesDialog;
