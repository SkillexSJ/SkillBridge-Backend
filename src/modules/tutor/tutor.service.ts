import { prisma } from "../../lib/prisma";
import {
  Prisma,
  TutorProfile,
  AvailabilitySlot,
} from "../../generated/prisma/client";
import { calculatePagination } from "../../utils/pagination";
import {
  TutorQueryParams,
  TutorWithRelations,
  TutorDetails,
  SlotInput,
} from "./tutor.type";
import { Meta } from "../../interfaces";

const getAllTutors = async (
  params: TutorQueryParams,
): Promise<{
  data: TutorWithRelations[];
  meta: Meta;
}> => {
  const { searchTerm, categoryId, minPrice, maxPrice, sortBy } = params;
  const { page, limit, skip } = calculatePagination(params);

  const where: Prisma.TutorProfileWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { bio: { contains: searchTerm, mode: "insensitive" } },
      { user: { name: { contains: searchTerm, mode: "insensitive" } } },
      { specialty: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.hourlyRate = {};
    if (minPrice) where.hourlyRate.gte = parseFloat(minPrice);
    if (maxPrice) where.hourlyRate.lte = parseFloat(maxPrice);
  }

  // Sorting
  let orderBy: Prisma.TutorProfileOrderByWithRelationInput = {
    createdAt: "desc",
  };
  if (sortBy === "price_asc") orderBy = { hourlyRate: "asc" };
  if (sortBy === "price_desc") orderBy = { hourlyRate: "desc" };
  if (sortBy === "rating") orderBy = { createdAt: "desc" }; // TODO: Sort by rating when aggregated

  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where,
      select: {
        id: true,
        bio: true,
        specialty: true,
        experience: true,
        hourlyRate: true,
        location: true,
        totalMentoringMins: true,
        totalSessions: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        availabilitySlots: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.tutorProfile.count({ where }),
  ]);

  // Calculate average rating for each tutor
  const tutorsWithRating = tutors.map((tutor) => {
    const avgRating =
      tutor.reviews.length > 0
        ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
          tutor.reviews.length
        : 0;

    return {
      ...tutor,
      averageRating: Number(avgRating.toFixed(1)),
      reviewCount: tutor.reviews.length,
    };
  });

  return {
    data: tutorsWithRating,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getTutorById = async (id: string): Promise<TutorDetails | null> => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      category: true,
      reviews: {
        include: {
          student: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      availabilitySlots: true,
    },
  });

  if (!tutor) return null;

  const reviews = tutor.reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    ...tutor,
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount: reviews.length,
  };
};

const createTutorProfile = async (
  userId: string,
  data: Prisma.TutorProfileUncheckedCreateInput,
): Promise<TutorProfile> => {
  // Check if profile exists
  const existing = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Tutor profile already exists");
  }

  const profile = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
    },
  });

  // Update user role to tutor
  await prisma.user.update({
    where: { id: userId },
    data: { role: "tutor" },
  });

  return profile;
};

const updateAvailability = async (
  tutorProfileId: string,
  slots: SlotInput[],
): Promise<AvailabilitySlot[]> => {
  // Transaction
  return await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: { tutorProfileId },
    });

    // slots array:
    const createdSlots = [];
    for (const slot of slots) {
      createdSlots.push(
        await tx.availabilitySlot.create({
          data: {
            tutorProfileId,
            dayOfWeek: slot.dayOfWeek,
            startTime: new Date(`1970-01-01T${slot.startTime}`),
            endTime: new Date(`1970-01-01T${slot.endTime}`),
          },
        }),
      );
    }
    return createdSlots;
  });
};

const getTutorProfileByUserId = async (userId: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      availabilitySlots: true,
    },
  });
};

const updateAvailabilityByUserId = async (
  userId: string,
  slots: SlotInput[],
) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Tutor profile not found");
  }

  return updateAvailability(profile.id, slots);
};

// For Tutor Dashboard
const getTutorStats = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Tutor profile not found");
  }

  // Get total earnings
  const earnings = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      tutorProfileId: profile.id,
      status: "completed",
    },
  });

  // Get review stats
  const reviews = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      tutorProfileId: profile.id,
    },
  });

  return {
    totalMentoringMins: profile.totalMentoringMins,
    totalSessions: profile.totalSessions,
    totalEarnings: earnings._sum.totalPrice || 0,
    averageRating: reviews._avg.rating
      ? Number(reviews._avg.rating.toFixed(1))
      : 0,
    totalReviews: reviews._count.rating,
  };
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateAvailability,
  getTutorProfileByUserId,
  updateAvailabilityByUserId,
  getTutorStats,
};
