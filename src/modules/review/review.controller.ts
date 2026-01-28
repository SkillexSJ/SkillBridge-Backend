import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
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
  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }
  sendSuccess(res, { data: review }, "Review fetched successfully");
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
};
