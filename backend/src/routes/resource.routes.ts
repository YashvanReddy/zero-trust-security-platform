import { Router } from "express";
import {
  authenticate,
  AuthenticatedRequest
} from "../middleware/auth.middleware.js";
import { evaluateRisk } from "../middleware/risk.middleware.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  evaluateRisk,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      resource: "profile",
      message: "Profile resource accessed successfully",
      userId: req.userId,
      riskScore: req.riskScore,
      riskLevel: req.riskLevel,
      accessDecision: req.accessDecision,
      riskReasons: req.riskReasons
    });
  }
);

export default router;  