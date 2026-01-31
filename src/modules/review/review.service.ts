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

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Review
    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating: Number(rating),
        comment: comment || "",
      },
    });

    // 2. Recalculate Average Rating
    const reviews = await tx.review.findMany({
      where: { tutorProfileId: booking.tutorProfileId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // 3. Update Tutor Profile
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        averageRating: Number(averageRating.toFixed(2)),
      },
    });

    return review;
  });

  return result;
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
  const review = await prisma.review.findUnique({
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

  if (!review) {
    const error: any = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  return review;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
};
