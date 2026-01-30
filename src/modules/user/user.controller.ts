/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";
/**
 * SERVICES
 */
import { UserService } from "./user.service";
/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";
/**
 * UTILS
 */
import { sendError, sendSuccess } from "../../utils/response";
import { auth } from "../../lib/auth";

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

const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    sendError(res, "No image file provided", 400);
  }

  const userId = req.user!.id;

  // cloudinary url path
  const imageUrl = req?.file?.path as string;

  const user = await UserService.updateProfile(userId, { image: imageUrl });
  sendSuccess(res, { data: user }, "Profile image updated successfully");
});

// extra for image signup
const signupWithImage = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  const image = req.file ? req.file.path : undefined;

  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: role || "student",
      image,
    },
  });

  if (!user) {
    sendError(res, "Failed to create user", 400);
  }

  sendSuccess(res, { data: user }, "User created successfully with image", 201);
});

const getStudentDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const stats = await UserService.getStudentDashboardStats(userId);
    sendSuccess(res, { data: stats }, "Student stats fetched successfully");
  },
);

export const UserController = {
  getProfile,
  updateProfile,
  uploadImage,
  signupWithImage,
  getStudentDashboardStats,
};
