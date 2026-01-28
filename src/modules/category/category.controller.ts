import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendCreated, sendSuccess } from "../../utils/response";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  sendCreated(res, category, "Category created successfully");
});

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  sendSuccess(
    res,
    { data: categories, meta: [] },
    "Categories fetched successfully",
  );
});

export const CategoryController = {
  createCategory,
  getAllCategories,
};
