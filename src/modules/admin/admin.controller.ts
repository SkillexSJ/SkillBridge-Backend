import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.blockUser(id);
    res.status(200).json({
        success: true,
        message: "User status updated",
        data: result
    });
});

export const AdminController = {
  getAllUsers,
  blockUser,
};
