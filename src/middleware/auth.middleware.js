import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    //get token from header
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user by id
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error", error.message);
    res.status(500).json({ message: "Token is not valid" });
  }
};
