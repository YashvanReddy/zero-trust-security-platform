import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";
import { calculateSessionRisk } from "../services/risk/risk.service.js";
import { getAccessDecision } from "../services/access/access.policy.js";

export const evaluateRisk = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId || !req.sessionId) {
      res.status(401).json({
        success: false,
        message: "Authentication context missing"
      });
      return;
    }

    const risk = await calculateSessionRisk(
      req.userId,
      req.sessionId
    );

    const decision = getAccessDecision(risk.level);

    req.riskScore = risk.score;
    req.riskLevel = risk.level;
    req.accessDecision = decision;
    req.riskReasons = risk.reasons;

    if (decision === "block") {
      res.status(403).json({
        success: false,
        message: "Access blocked due to high security risk",
        riskScore: risk.score,
        riskLevel: risk.level,
        reasons: risk.reasons
      });
      return;
    }

    if (decision === "restrict") {
      res.status(403).json({
        success: false,
        message: "Access restricted due to elevated risk",
        riskScore: risk.score,
        riskLevel: risk.level,
        reasons: risk.reasons
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Risk evaluation failed"
    });
  }
};