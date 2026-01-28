import { BaseQueryParams } from "../../interfaces";

export interface CreateReviewInput {
  bookingId: string;
  rating: number | string;
  comment?: string;
}

export interface ReviewQueryParams extends BaseQueryParams {
  tutorId?: string;
  studentId?: string;
  sortBy?: "newest" | "oldest" | "rating_asc" | "rating_desc";
}
