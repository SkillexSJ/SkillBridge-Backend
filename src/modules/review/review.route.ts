import { Router } from "express";
import { ReviewController } from "./review.controller";

const router: Router = Router();

router.post("/", ReviewController.createReview);

export const ReviewRoutes = router;
