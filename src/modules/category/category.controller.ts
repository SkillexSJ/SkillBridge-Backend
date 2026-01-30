/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";
/**
 * SERVICES
 */
import { CategoryService } from "./category.service";
/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";
/**
 * UTILS
 */
import { sendCreated, sendSuccess } from "../../utils/response";
/**
 * TYPES
 */
import { Category } from "../../generated/prisma/client";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as Category;
  const category = await CategoryService.createCategory(data);
  sendCreated(res, category, "Category created successfully");
});

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query);
  sendSuccess(res, result, "Categories fetched successfully");
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id as string);

  sendSuccess(res, { data: result }, "Category fetched successfully");
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await CategoryService.deleteCategory(id as string);
  sendSuccess(res, { data: category }, "Category deleted successfully");
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
