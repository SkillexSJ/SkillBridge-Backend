import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const review = await ReviewService.createReview(userId, req.body);
  sendSuccess(res, { data: review }, "Review created successfully", 201);
});

export const ReviewController = {
  createReview,
};
