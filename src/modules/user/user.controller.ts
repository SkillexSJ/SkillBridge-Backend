import { Request, Response } from "express";
import { UserService } from "./user.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await UserService.getProfile(userId);
  sendSuccess(res, { data: user }, "Profile fetched successfully");
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await UserService.updateProfile(userId, req.body);
  sendSuccess(res, { data: user }, "Profile updated successfully");
});

export const UserController = {
  getProfile,
  updateProfile,
};
