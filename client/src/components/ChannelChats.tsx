import { Channel, DMProfile } from "@/types";
import Chat from "./Chat";
import ChannelChat from "./ChannelChat";

const ChannelChats = ({
  filteredChannels,
}: {
  filteredChannels: Channel[];
}) => {
  return filteredChannels.map((channel) => (
    <div key={channel._id} className="mt-4 flex flex-col gap-2">
      <ChannelChat channel={channel} />
    </div>
  ));
};

export default ChannelChats;
