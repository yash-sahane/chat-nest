import { Channel, DMProfile } from "@/types";
import Chat from "./Chat";

const ChannelChats = ({
  filteredChannels,
}: {
  filteredChannels: Channel[];
}) => {
  return filteredChannels.map((channel) => (
    <div key={channel._id} className="mt-4 flex flex-col gap-2">
      <Chat channel={channel} />
    </div>
  ));
};

export default ChannelChats;
