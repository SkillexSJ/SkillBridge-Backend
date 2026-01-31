/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";
/**
 * SERVICES
 */
import { ReviewService } from "./review.service";
/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";
/**
 * UTILS
 */
import { sendSuccess } from "../../utils/response";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const review = await ReviewService.createReview(userId, req.body);
  sendSuccess(res, { data: review }, "Review created successfully", 201);
});

const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews(req.query);
  sendSuccess(res, result, "Reviews fetched successfully");
});

const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const review = await ReviewService.getReviewById(req.params.id as string);
  sendSuccess(res, { data: review }, "Review fetched successfully");
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
};
