import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/response";

const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  
  const booking = await BookingService.createBooking(userId, req.body);
  sendSuccess(res, { data: booking }, "Booking created successfully", 201);
});

const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).session?.user?.id || (req as any).user?.id;
  const role = (req as any).session?.user?.role || (req as any).user?.role; // Need to ensure role is in session/token
  
  if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const result = await BookingService.getUserBookings(userId, role || "student", req.query);
  sendSuccess(res, result, "Bookings fetched successfully");
});

const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
    // Only tutor or admin should do this.
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await BookingService.updateBookingStatus(id as string, status);
    sendSuccess(res, { data: result }, "Booking status updated successfully");
});

export const BookingController = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};
