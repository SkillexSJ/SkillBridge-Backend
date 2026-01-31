/**
 * NODE PACKAGES
 */
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

/**
 * CLOUDINARY FOR IMAGE UPLOAD
 */

dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
  throw new Error(
    "Missing Cloudinary configuration. Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
  );
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "skill-bridge-users", // Folder name
    format: async (req: any, file: any) => "webp",
    transformation: [
      {
        width: 500,
        height: 500,
        crop: "fill",
        gravity: "face",
        quality: "auto",
      },
    ],
  } as any,
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
export default cloudinary;
