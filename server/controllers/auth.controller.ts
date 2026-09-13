import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { IUser, User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { hashPassword, comparePassword } from "../services/password.service";
import { signAccessToken } from "../services/jwt.service";
import { config } from "../config/env";

const AUTH_COOKIE_NAME = "projectlens_token";
const PASSWORD_MIN_LENGTH = 8;

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function catchAsync(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" as const : "lax" as const,
    secure: config.nodeEnv === "production",
  };
}

function setAuthCookie(res: Response, userId: Parameters<typeof signAccessToken>[0]): void {
  res.cookie(AUTH_COOKIE_NAME, signAccessToken(userId), {
    ...cookieOptions(),
    maxAge: 60 * 60 * 1000,
  });
}

function safeUser(user: { _id: unknown; name: string; email: string }) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

function normalizedCredentials(body: unknown): {
  name?: string;
  email: string;
  password: string;
} {
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const name = typeof input.name === "string" ? input.name.trim() : undefined;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  return { name, email, password };
}

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = normalizedCredentials(req.body);

  if (!name) {
    throw new AppError(400, "Name is required.");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, "A valid email is required.");
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(400, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }

  if (await User.exists({ email })) {
    throw new AppError(409, "An account with this email already exists.");
  }

  let user: IUser;
  try {
    user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(409, "An account with this email already exists.");
    }
    throw error;
  }

  setAuthCookie(res, user._id);
  res.status(201).json({ success: true, data: { user: safeUser(user) } });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = normalizedCredentials(req.body);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    throw new AppError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  const isValid = user ? await comparePassword(password, user.passwordHash) : false;

  if (!user || !isValid) {
    throw new AppError(401, "Invalid email or password.");
  }

  setAuthCookie(res, user._id);
  res.status(200).json({ success: true, data: { user: safeUser(user) } });
});

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const me = catchAsync(async (req, res) => {
  if (!req.user || !isValidObjectId(req.user.userId)) {
    throw new AppError(401, "Authentication required.");
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});
