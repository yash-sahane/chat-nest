import User from "../model/User.js";

export const getAllProfiles = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    const regexSearchTerm = searchTerm.replace(
      /[~`!#$%^&*(){}\[\];:"'<,>?\/\\|_+=-]/g,
      ""
    );
    const regex = new RegExp(regexSearchTerm, "i");
    console.log(regex);

    const profiles = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { profileSetup: true },
        { $or: [{ firstName: regex }, { lastName: regex }] },
      ],
    });

    console.log("working");
    console.log(profiles);

    return res.json({
      success: true,
      data: profiles,
    });
  } catch (e) {
    console.log(e.message);
  }
};
