import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  
  const review = await ReviewService.createReview(userId, req.body);
  sendSuccess(res, { data: review }, "Review created successfully", 201);
});

export const ReviewController = {
  createReview,
};
