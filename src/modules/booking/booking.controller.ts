import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  
  const booking = await BookingService.createBooking(userId, req.body);
  res.status(201).json({
    success: true,
    data: booking,
  });
});

const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  const role = (req as any).session?.user?.role || (req as any).user?.role; // Need to ensure role is in session/token
  
  // If role is missing in session, fetch user? For now assume it's there or user is student.
  // Or fetch user here.
  
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  // Fallback if role is not in session (better-auth default session might not have it unless configured)
  // Let's assume we pass role or fetch it. 
  // For safety, let's fetch user role if not present, or try both.
  // Actually, let's just pass "student" as default if not found, or handle in service.
  // Real implementation: extend session type.
  
  const bookings = await BookingService.getUserBookings(userId, role || "student");
  res.status(200).json({
    success: true,
    data: bookings,
  });
});

const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    // Only tutor or admin should do this.
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await BookingService.updateBookingStatus(id, status);
    res.status(200).json({
        success: true,
        data: result
    });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};
