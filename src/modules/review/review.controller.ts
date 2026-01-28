import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  
  const review = await ReviewService.createReview(userId, req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

export const ReviewController = {
  createReview,
};
