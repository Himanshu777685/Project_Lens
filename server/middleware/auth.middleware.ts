import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { User } from "../models/User";
import { AppError } from "./errorHandler";
import { verifyAccessToken } from "../services/jwt.service";
import "../types/auth";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.projectlens_token;

  if (typeof token !== "string" || token === "") {
    next(new AppError(401, "Authentication required."));
    return;
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    next(new AppError(401, "Invalid authentication token."));
    return;
  }

  if (!isValidObjectId(payload.userId)) {
    next(new AppError(401, "Invalid authentication token."));
    return;
  }

  try {
    const user = await User.findById(payload.userId).select("name email");

    if (!user) {
      next(new AppError(401, "Authentication required."));
      return;
    }

    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
