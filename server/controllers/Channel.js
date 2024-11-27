import ErrorHandler from "../middleware/error.js";
import Channel from "../model/Channel.js";
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

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const channels = await Channel.find({
      $or: [
        {
          members: userId,
        },
        {
          admin: userId,
        },
      ],
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: channels,
    });
  } catch (e) {
    console.log(e);
  }
};
