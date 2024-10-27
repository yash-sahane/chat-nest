import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import User from "../model/User.js";
import e from "express";

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ErrorHandler(400, "User Not Authenticated"));
  }

  const decodedId = jwt.verify(token, process.env.SECRET_KEY || "hello_world");
  const user = await User.findById(decodedId.id);
  if (!user) {
    return next(new ErrorHandler(400, "Invalid Token"));
  }
  req.user = user;
  next();
};

export default isAuthenticated;
