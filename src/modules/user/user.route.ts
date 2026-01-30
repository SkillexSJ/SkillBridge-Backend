/**
 * NODE PACKAGES
 */
import { Router } from "express";
/**
 * CONTROLLER
 */
import { UserController } from "./user.controller";
/**
 * MIDDLEWARES
 */
import authMiddleware, { UserRole } from "../../middlewares/auth";
/**
 * UTILS
 */
import { upload } from "../../config/cloudinary";

const router: Router = Router();

router.get(
  "/profile",
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  UserController.getProfile,
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  UserController.getProfile,
);

router.get(
  "/stats",
  authMiddleware(UserRole.STUDENT),
  UserController.getStudentDashboardStats,
);

router.patch(
  "/profile",
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  UserController.updateProfile,
);
router.post(
  "/profile/image",
  authMiddleware(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
  upload.single("image"),
  UserController.uploadImage,
);

// signup with image
router.post(
  "/signup-with-image",
  upload.single("image"),
  UserController.signupWithImage,
);

export const UserRoutes = router;
