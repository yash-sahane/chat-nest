import mongoose from "mongoose";
import Message from "../model/Message.js";
import User from "../model/User.js";

export const getAllProfiles = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    const regexSearchTerm = searchTerm.replace(
      /[~`!#$%^&*(){}\[\];:"'<,>?\/\\|_+=-]/g,
      ""
    );
    const regex = new RegExp(regexSearchTerm, "i");
    // console.log(regex);

    const profiles = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { profileSetup: true },
        { $or: [{ firstName: regex }, { lastName: regex }] },
      ],
    });

    // console.log("working");
    // console.log(profiles);

    return res.json({
      success: true,
      data: profiles,
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const getAllProfilesForDMList = async (req, res, next) => {
  try {
    let userId = req.user;
    userId = new mongoose.Types.ObjectId(userId);

    const profiles = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timeStamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timeStamp" },
          lastMessage: { $first: "$content" },
          lastMessageType: { $first: "$messageType" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          lastMessage: 1,
          lastMessageType: 1,
          email: "$user.email",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          avatar: "$user.avatar",
          profileTheme: "$user.profileTheme",
          status: "$user.status",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.json({
      success: true,
      data: profiles,
    });
  } catch (e) {
    console.log(e.message);
  }
};
