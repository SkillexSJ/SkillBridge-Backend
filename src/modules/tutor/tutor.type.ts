import { Prisma } from "../../generated/prisma/client";
import { BaseQueryParams } from "../../interfaces";

export interface TutorQueryParams extends BaseQueryParams {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}

// time slot
export interface SlotInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
// for all tutors
export type TutorWithRelations = Prisma.TutorProfileGetPayload<{
  select: {
    id: true;
    bio: true;
    specialty: true;
    experience: true;
    hourlyRate: true;
    location: true;
    totalMentoringMins: true;
    totalSessions: true;
    averageRating: true;
    user: {
      select: {
        name: true;
        image: true;
      };
    };
    category: {
      select: {
        name: true;
      };
    };
    reviews: {
      select: {
        rating: true;
      };
    };
  };
}> & {
  averageRating: number;
  reviewCount: number;
};

// for profile

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
}> & {
  averageRating: number;
  reviewCount: number;
};
