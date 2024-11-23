import { DMProfile } from "@/types";
import Chat from "./Chat";

const Chats = ({ filteredProfiles }: { filteredProfiles: DMProfile[] }) => {
  return filteredProfiles.map((DMProfile) => (
    <div key={DMProfile._id} className="mt-4 flex flex-col gap-2">
      <Chat DMProfile={DMProfile} />
    </div>
  ));
};

export default Chats;
