import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
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

export const AdminController = {
  getAllUsers,
  blockUser,
};
