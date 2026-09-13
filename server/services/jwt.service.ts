import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config/env";

interface AccessTokenPayload {
  userId: string;
}

export function signAccessToken(userId: Types.ObjectId): string {
  const payload: AccessTokenPayload = { userId: userId.toString() };

  return jwt.sign(payload, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, config.jwtSecret, {
    algorithms: ["HS256"],
  });

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.userId !== "string"
  ) {
    throw new Error("Invalid access token payload.");
  }

  return { userId: payload.userId };
}
