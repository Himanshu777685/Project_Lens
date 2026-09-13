import { Types } from "mongoose";

export interface AuthenticatedUser {
  userId: Types.ObjectId;
}
