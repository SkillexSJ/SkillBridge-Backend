import { prisma } from "../../lib/prisma";
import { BookingStatus, Prisma } from "../../generated/prisma/client";

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

const getUserBookings = async (userId: string, role: string, params: any = {}) => {
  const { page = 1, limit = 10 } = params;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.BookingWhereInput = {};

  if (role === "tutor") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) {
      return {
        data: [],
        meta: { total: 0, page: pageNum, limit: limitNum },
      };
    }
    where.tutorProfileId = tutorProfile.id;
  } else {
    where.studentId = userId;
  }

  const include: Prisma.BookingInclude =
    role === "tutor"
      ? { student: { select: { name: true, image: true, email: true } } }
      : {
          tutorProfile: {
            include: { user: { select: { name: true, image: true } } },
          },
        };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include,
      orderBy: { sessionDate: "desc" },
      skip,
      take: limitNum,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
    },
  };
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
