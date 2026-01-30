/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";

/**
 * SERVICES
 */
import { AdminService } from "./admin.service";

/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";

/**
 * UTILS
 */
import { sendSuccess } from "../../utils/response";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);
  sendSuccess(res, result, "Users fetched successfully");
});

const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.blockUser(id as string);
  sendSuccess(res, { data: result }, "User status updated");
});

const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendSuccess(res, { data: result }, "Dashboard stats fetched successfully");
});

export const AdminController = {
  getAllUsers,
  blockUser,
  getDashboardStats,
};
