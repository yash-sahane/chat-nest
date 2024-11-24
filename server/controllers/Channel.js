import ErrorHandler from "../middleware/error.js";
import Channel from "../model/Channel.js";
import User from "../model/User.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    let adminId = req.user._id;
    adminId = await User.findById(adminId);
    if (!adminId) {
      return next(ErrorHandler(404, "Admin not found"));
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return next(ErrorHandler(404, "Invalid member IDs"));
    }

    const channel = await Channel.create(
      {
        name,
        members,
        admin: adminId,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Channel created successfully",
      data: channel,
    });
  } catch (e) {
    console.log(e);
  }
};
