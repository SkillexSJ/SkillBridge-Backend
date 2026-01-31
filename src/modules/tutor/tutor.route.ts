/**
 * NODE PACKAGES
 */
import { Router } from "express";
/**
 * CONTROLLER
 */
import { TutorController } from "./tutor.controller";
/**
 * MIDDLEWARES
 */
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.get("/me", authMiddleware(UserRole.TUTOR), TutorController.getMyProfile);
router.patch(
  "/me",
  authMiddleware(UserRole.TUTOR),
  TutorController.updateMyProfile,
);
router.get(
  "/stats",
  authMiddleware(UserRole.TUTOR),
  TutorController.getTutorStats,
);

router.get("/", TutorController.getAllTutors);
router.get("/:id", TutorController.getTutorById);

router.post(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  TutorController.createTutorProfile,
);
router.put(
  "/availability",
  authMiddleware(UserRole.TUTOR),
  TutorController.updateAvailability,
);

export const TutorRoutes = router;
