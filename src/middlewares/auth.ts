import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { sendError, sendForbidden, sendUnauthorized } from "../utils/response";

export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
        isBlocked: boolean;
      };
    }
  }
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (session && session.user) {
        sendUnauthorized(res, "Unauthorized");
      }
      if (!session?.user.emailVerified) {
        sendUnauthorized(res, "Email not verified");
      }

      const user = session!.user as any;

      if (user.isBlocked) {
        return sendUnauthorized(res, "User is blocked");
      }
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isBlocked: !!user.isBlocked,
      };

      //role based
      if (roles.length && !roles.includes(req.user.role)) {
        return sendForbidden(res, "Forbidden");
      }
      next();
    } catch (error) {
      return sendError(
        res,
        "Authentication failed",
        500,
        (error as Error).message,
      );
    }
  };
};

export default authMiddleware;
