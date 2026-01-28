import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../generated/prisma/client";

const createBooking = async (studentId: string, data: any) => {
  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      sessionDate: new Date(sessionDate),
      startTime: new Date(`1970-01-01T${startTime}`),
      endTime: new Date(`1970-01-01T${endTime}`),
      totalPrice: parseFloat(totalPrice),
      status: "pending",
    },
  });
  return booking;
};

const getUserBookings = async (userId: string, role: string) => {
  if (role === "tutor") {
    // Need to find the tutor profile first
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
    });
    if (!tutorProfile) return [];

    return await prisma.booking.findMany({
      where: { tutorProfileId: tutorProfile.id },
      include: {
        student: {
          select: { name: true, image: true, email: true }
        }
      },
      orderBy: { sessionDate: "desc" },
    });
  } else {
    // Student
    return await prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        tutorProfile: {
          include: {
            user: {
                select: { name: true, image: true }
            }
          }
        }
      },
      orderBy: { sessionDate: "desc" },
    });
  }
};

const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};

export const BookingService = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
};
