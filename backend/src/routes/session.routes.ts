import { Router } from "express";
import {
  authenticate,
  AuthenticatedRequest
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/verify",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "Session is valid",
      userId: req.userId,
      sessionId: req.sessionId,
      deviceId: req.deviceId
    });
  }
);

export default router;