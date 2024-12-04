import ErrorHandler from "../middleware/error.js";
import Channel from "../model/Channel.js";
import Message from "../model/Message.js";
import User from "../model/User.js";

export const createChannel = async (req, res, next) => {
  try {
    const avatar_filename = req.file?.filename;
    const { profileTheme, channelName, selectedProfiles } = req.body;
    const members = JSON.parse(selectedProfiles);

    let adminId = req.user._id;

    const isAdminPresent = await User.findById(adminId);

    if (!isAdminPresent) {
      return next(ErrorHandler(404, "Admin not found"));
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return next(ErrorHandler(404, "Invalid member IDs"));
    }

    const channel = new Channel({
      name: channelName,
      members,
      admin: adminId,
      avatar: avatar_filename,
      profileTheme,
    });

    await channel.save();

    return res.json({
      success: true,
      message: "Channel created successfully",
      data: channel,
    });
  } catch (e) {
    console.log(e);
  }
};

export const joinChannel = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const channelId = req.body.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return next(new ErrorHandler(404, "Channel not found"));
    }

    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      await channel.save();
    } else {
      return next(
        new ErrorHandler(400, "You are already a member of this channel")
      );
    }

    return res.json({
      success: true,
      message: "Channel joined successfully",
    });
  } catch (e) {
    console.log(e);
  }
};

export const getAllChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find({});
    res.json({
      success: true,
      data: channels,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getSearchedChannels = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    const regexSearchTerm = searchTerm.replace(
      /[~`!#$%^&*(){}\[\];:"'<,>?\/\\|_+=-]/g,
      ""
    );
    const regex = new RegExp(regexSearchTerm, "i");
    // console.log(regex);

    const channels = await Channel.find({ name: regex });
    res.json({
      success: true,
      data: channels,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // const channels = await Channel.find({
    //   $or: [
    //     {
    //       members: userId,
    //     },
    //     {
    //       admin: userId,
    //     },
    //   ],
    // }).sort({ updatedAt: -1 });

    const channels = await Channel.aggregate([
      // Step 1: Match Channels
      {
        $match: {
          $or: [{ members: userId }, { admin: userId }],
        },
      },
      // Step 2: Lookup Messages
      {
        $lookup: {
          from: "messages", // Assuming the collection name is 'messages'
          localField: "_id", // Field from the Channel collection
          foreignField: "channel", // Field from the Message collection
          as: "messages",
        },
      },
      // Step 3: Add a field to get the last message in each channel
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] }, // Get the last message
        },
      },
      // Step 4: Project the required fields
      {
        $project: {
          _id: 1,
          name: 1,
          admin: 1,
          members: 1,
          profileTheme: 1,
          createdAt: 1,
          updatedAt: 1,
          lastMessage: "$lastMessage.content",
          lastMessageType: "$lastMessage.messageType",
          lastMessageTimeStamp: "$lastMessage.timeStamp",
        },
      },
      // Optional: Sort by last message timestamp
      {
        $sort: { lastMessageTimeStamp: -1 },
      },
    ]);

    res.json({
      success: true,
      data: channels,
    });
  } catch (e) {
    console.log(e);
  }
};
