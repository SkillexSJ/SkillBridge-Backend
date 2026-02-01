/**
 * LIBS
 */
import { prisma } from "../../lib/prisma";
/**
 * PRISMA TYPES
 */
import {
  Prisma,
  TutorProfile,
  AvailabilitySlot,
} from "../../generated/prisma/client";
/**
 * UTILS
 */
import { calculatePagination } from "../../utils/pagination";

/**
 * TYPES
 */
import {
  TutorQueryParams,
  TutorWithRelations,
  TutorDetails,
  SlotInput,
} from "./tutor.type";

/**
 * INTERFACES
 */

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
  if (sortBy === "experience") orderBy = { experience: "desc" };
  if (sortBy === "rating") orderBy = { averageRating: "desc" };

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
        averageRating: true,
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

  // mapping
  const tutorsWithStats = tutors.map((tutor) => {
    return {
      ...tutor,
      reviewCount: tutor.reviews.length,
    };
  });

  return {
    data: tutorsWithStats,
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

  if (!tutor) {
    const error: any = new Error("Tutor not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...tutor,
    averageRating: Number(tutor.averageRating),
    reviewCount: tutor.reviews.length,
  };
};

const createTutorProfile = async (
  userId: string,
  data: Prisma.TutorProfileUncheckedCreateInput & {
    availability?: SlotInput[]; // extra
  },
): Promise<TutorProfile> => {
  // Check if profile exists
  const existing = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    const error: any = new Error("Tutor profile already exists");
    error.statusCode = 409;
    throw error;
  }

  // Extract availability
  const { availability, ...profileData } = data;

  // transaction
  const profile = await prisma.$transaction(async (tx) => {
    // 1. Create the tutor profile
    const newProfile = await tx.tutorProfile.create({
      data: {
        ...profileData,
        userId,
      },
    });

    // 2. Update user role to tutor
    await tx.user.update({
      where: { id: userId },
      data: { role: "tutor" },
    });

    // 3. Create availability slots if provided
    if (availability && availability.length > 0) {
      await tx.availabilitySlot.createMany({
        data: availability.map((slot) => ({
          tutorProfileId: newProfile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: new Date(`1970-01-01T${slot.startTime}`),
          endTime: new Date(`1970-01-01T${slot.endTime}`),
        })),
      });
    }

    return newProfile;
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

    // slots array for time
    const createdSlots: AvailabilitySlot[] = [];
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
  const profile = await prisma.tutorProfile.findUnique({
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

  if (!profile) {
    const error: any = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

const updateAvailabilityByUserId = async (
  userId: string,
  slots: SlotInput[],
) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    const error: any = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return updateAvailability(profile.id, slots);
};

// For Tutor Dashboard
const getTutorStats = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    const error: any = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }

  // total earnings
  const earnings = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      tutorProfileId: profile.id,
      status: { in: ["confirmed", "completed"] },
    },
  });

  // review stats
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

const updateTutorProfile = async (
  userId: string,
  data: Prisma.TutorProfileUpdateInput,
) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    const error: any = new Error("Tutor profile not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedProfile = await prisma.tutorProfile.update({
    where: { userId },
    data,
  });

  return updatedProfile;
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateTutorProfile,
  updateAvailability,
  getTutorProfileByUserId,
  updateAvailabilityByUserId,
  getTutorStats,
};
