import { Request, Response } from "express";
import { UserService } from "./user.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // Assuming user id is attached to req.user?.id by auth middleware
  // For better-auth, it might be req.headers or handled differently.
  // I will assume a middleware populates req.body.user or similar, 
  // but usually it's req.user. 
  // better-auth 'auth' middleware usually attaches session to req. 
  // Let's assume for now we get userId from the session.
  
  // Note: Standard Express Request doesn't have 'user'. 
  // I'll cast it or usage should be adjusted based on auth middleware.
  // For now, I'll use (req as any).user.id or similar placeholder.
  
  const userId = (req as any).session?.user?.id || (req as any).user?.id; 
  
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const user = await UserService.getProfile(userId);
  sendSuccess(res, { data: user }, "Profile fetched successfully");
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const user = await UserService.updateProfile(userId, req.body);
  sendSuccess(res, { data: user }, "Profile updated successfully");
});

export const UserController = {
  getProfile,
  updateProfile,
};
