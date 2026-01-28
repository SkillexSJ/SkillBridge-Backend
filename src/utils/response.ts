import type { Response } from "express";

export const sendCreated = (
  res: Response,
  data: any,
  message: string = "Resource created successfully",
  statusCode: number = 201,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendSuccess = (
  res: Response,
  result: { data: any; meta?: any },
  message: string = "Success",
  statusCode: number = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: result.data,
    meta: result.meta,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string,
) => {
  const response: any = {
    success: false,
    message,
  };

  if (error) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};

export const sendUnauthorized = (
  res: Response,
  message: string = "Unauthorized",
) => {
  sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message: string = "Forbidden") => {
  sendError(res, message, 403);
};
