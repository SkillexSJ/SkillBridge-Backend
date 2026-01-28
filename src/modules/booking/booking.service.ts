import { prisma } from "../../lib/prisma";
import { BookingStatus, Prisma, Booking } from "../../generated/prisma/client";
import { calculatePagination } from "../../utils/pagination";
import {
  CreateBookingInput,
  BookingQueryParams,
  BookingDetails,
} from "./booking.type";

const createBooking = async (
  studentId: string,
  data: CreateBookingInput,
): Promise<Booking> => {
  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      sessionDate: new Date(sessionDate),
      startTime: new Date(`1970-01-01T${startTime}`),
      endTime: new Date(`1970-01-01T${endTime}`),
      totalPrice: Number(totalPrice),
      status: "pending",
    },
  });
  return booking;
};

const getUserBookings = async (
  userId: string,
  role: string,
  params: BookingQueryParams = {},
): Promise<{
  data: any[]; // Using any because of dynamic includes based on role
  meta: { total: number; page: number; limit: number };
}> => {
  const { status } = params;
  const { page, limit, skip } = calculatePagination(params);

  const where: Prisma.BookingWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (role === "tutor") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) {
      return {
        data: [],
        meta: { total: 0, page, limit },
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
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: bookings,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getBookingById = async (
  id: string,
  userId: string,
  role: string,
): Promise<BookingDetails> => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true, image: true } },
      tutorProfile: {
        include: {
          user: { select: { name: true, image: true, email: true } },
        },
      },
    },
  });

  if (!booking) {
    const error: any = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (role === "ADMIN") return booking;

  // Check access
  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutorProfile.userId === userId;

  if (!isStudent && !isTutor) {
    const error: any = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  return booking;
};

const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
): Promise<Booking> => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
