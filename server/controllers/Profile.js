import User from "../model/User.js";

export const getAllProfiles = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    const regexSearchTerm = searchTerm.replace(
      /[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g,
      ""
    );
    const regex = new RegExp(regexSearchTerm, "i");

    const profiles = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.json({
      success: true,
      data: profiles,
    });
  } catch (e) {
    console.log(e.message);
  }
};
