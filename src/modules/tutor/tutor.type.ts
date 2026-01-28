import { Prisma } from "../../generated/prisma/client";
import { BaseQueryParams } from "../../interfaces";

export interface TutorQueryParams extends BaseQueryParams {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  // sortBy is already in BaseQueryParams but can be specific here if needed
}

export interface SlotInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Define the type for the tutor profile with included relations as returned by getAllTutors
export type TutorWithRelations = Prisma.TutorProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    category: true;
    reviews: {
      select: {
        rating: true;
      };
    };
  };
}>;

// Define the type for the tutor profile with full details as returned by getTutorById
export type TutorDetails = Prisma.TutorProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
        email: true;
      };
    };
    category: true;
    reviews: {
      include: {
        student: {
          select: {
            name: true;
            image: true;
          };
        };
      };
    };
    availabilitySlots: true;
  };
}>;
