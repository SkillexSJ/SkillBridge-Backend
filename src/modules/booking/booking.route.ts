import { Router } from "express";
import { BookingController } from "./booking.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

router.post(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.ADMIN),
  BookingController.createBooking,
);
router.get(
  "/",
  authMiddleware(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.getMyBookings,
);
router.get(
  "/:id",
  authMiddleware(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.getBookingById,
);
router.patch(
  "/:id",
  authMiddleware(UserRole.TUTOR, UserRole.ADMIN, UserRole.STUDENT),
  BookingController.updateBookingStatus,
);

export const BookingRoutes = router;
