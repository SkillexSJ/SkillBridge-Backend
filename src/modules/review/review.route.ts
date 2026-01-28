import { Router } from "express";
import { ReviewController } from "./review.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.STUDENT),
  ReviewController.createReview,
);

export const ReviewRoutes = router;
