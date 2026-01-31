/**
 * INTERFACES for query params and pagination
 */

export interface BaseQueryParams {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
}
