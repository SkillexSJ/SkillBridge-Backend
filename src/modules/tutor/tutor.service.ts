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
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.tutorProfile.count({ where }),
  ]);

  return {
    data: tutors,
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
  return tutor;
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

  // Update user role to TUTOR if not already
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
  // Transaction to replace slots
  return await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: { tutorProfileId },
    });

    // slots array: { dayOfWeek: number, startTime: string, endTime: string }
    const createdSlots = [];
    for (const slot of slots) {
      createdSlots.push(
        await tx.availabilitySlot.create({
          data: {
            tutorProfileId,
            dayOfWeek: slot.dayOfWeek,
            startTime: new Date(`1970-01-01T${slot.startTime}`), // Ensure proper Date objects or handle differently
            endTime: new Date(`1970-01-01T${slot.endTime}`),
          },
        }),
      );
    }
    return createdSlots;
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  createTutorProfile,
  updateAvailability,
};
