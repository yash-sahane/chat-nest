import User from "../model/User.js";
import ErrorHandler from "../middleware/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY || "hello_world", {
    expiresIn: maxAge,
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler(400, "Please provide email and password"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler(400, "Invalid credentials"));
    }

    res
      .cookie("jwt", createToken(user._id), {
        maxAge,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User loggedin successfully",
        data: user,
      });
  } catch (e) {
    console.log(e.message);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("jwt", "", { maxAge: 1, sameSite: none, secure: true })
      .json({
        success: true,
        message: "User Logged out successfully",
      });
  } catch (e) {
    console.log(e.message);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "Please provide email and password"));
    }

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10); // Ensure salt is generated

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, password: hashedPassword });

    res
      .cookie("jwt", createToken(newUser._id), {
        maxAge,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
  } catch (e) {
    console.log(e);
  }
};

export const setup = async (req, res) => {
  try {
    const avatar_filename = req.file?.filename;
    const { firstName, lastName, profileTheme } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, {
      firstName,
      lastName,
      avatar: avatar_filename,
      profileTheme,
      profileSetup: true,
    });

    return res.json({
      success: true,
      message: "Setup completed",
      data: user,
    });
  } catch (e) {
    console.log(e);
  }
};
