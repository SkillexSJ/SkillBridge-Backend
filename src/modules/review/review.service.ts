/**
 * LIBS
 */
import { prisma } from "../../lib/prisma";
/**
 * TYPES
 */
import { Prisma, Review } from "../../generated/prisma/client";
import { CreateReviewInput, ReviewQueryParams } from "./review.type";
/**
 * UTILS
 */
import { calculatePagination } from "../../utils/pagination";

const createReview = async (
  studentId: string,
  data: CreateReviewInput,
): Promise<Review> => {
  const { bookingId, rating, comment } = data;

  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.review) throw new Error("Review already exists");

  return await prisma.review.create({
    data: {
      bookingId,
      studentId,
      tutorProfileId: booking.tutorProfileId,
      rating: Number(rating),
      comment: comment || "",
    },
  });
};

const getAllReviews = async (
  params: ReviewQueryParams,
): Promise<{
  data: Review[];
  meta: { total: number; page: number; limit: number };
}> => {
  const { tutorId, studentId, sortBy } = params;
  const { page, limit, skip } = calculatePagination(params);

  const where: Prisma.ReviewWhereInput = {};

  if (tutorId) {
    where.tutorProfileId = tutorId;
  }
  if (studentId) {
    where.studentId = studentId;
  }

  let orderBy: Prisma.ReviewOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  if (sortBy === "rating_asc") orderBy = { rating: "asc" };
  if (sortBy === "rating_desc") orderBy = { rating: "desc" };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getReviewById = async (id: string): Promise<Review | null> => {
  return await prisma.review.findUniqueOrThrow({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      tutorProfile: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
};
