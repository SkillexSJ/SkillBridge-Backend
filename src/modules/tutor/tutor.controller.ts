/**
 * NODE PACKAGES
 */
import { Request, Response } from "express";
/**
 * SERVICES
 */
import { TutorService } from "./tutor.service";
/**
 * MIDDLEWARES
 */
import { asyncHandler } from "../../middlewares/asyncHandler";
/**
 * UTILS
 */
import { sendError, sendSuccess } from "../../utils/response";

const getAllTutors = asyncHandler(async (req: Request, res: Response) => {
  const result = await TutorService.getAllTutors(req.query);
  sendSuccess(res, result, "Tutors fetched successfully");
});

const getTutorById = asyncHandler(async (req: Request, res: Response) => {
  const tutor = await TutorService.getTutorById(req.params.id as string);
  sendSuccess(res, { data: tutor }, "Tutor fetched successfully");
});

const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const updatedProfile = await TutorService.updateTutorProfile(
    userId,
    req.body,
  );
  sendSuccess(res, { data: updatedProfile }, "Profile updated successfully");
});

const createTutorProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tutor = await TutorService.createTutorProfile(userId, req.body);
  sendSuccess(res, { data: tutor }, "Tutor profile created successfully", 201);
});

const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const slots = await TutorService.updateAvailabilityByUserId(
    userId,
    req.body.slots,
  );
  sendSuccess(res, { data: slots }, "Availability updated successfully");
});

const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tutor = await TutorService.getTutorProfileByUserId(userId);

  sendSuccess(res, { data: tutor }, "Tutor profile fetched successfully");
});

const getTutorStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const stats = await TutorService.getTutorStats(userId);
  sendSuccess(res, { data: stats }, "Tutor stats fetched successfully");
});

export const TutorController = {
  getAllTutors,
  getTutorById,
  getMyProfile,
  updateMyProfile,
  createTutorProfile,
  updateAvailability,
  getTutorStats,
};
