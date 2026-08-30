import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Session } from "../models/Session.js";
import { Device } from "../models/Device.js";
import { error } from "node:console";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string;
  deviceId?: string;

  riskScore?: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
  accessDecision?: "allow" | "mfa" | "restrict" | "block";
  riskReasons?: string[];
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      sessionId: string;
      tokenId: string;
    };

    const session = await Session.findById(decoded.sessionId);

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Session not found"
      });
      return;
    }

    if (!session.isActive) {
      res.status(401).json({
        success: false,
        message: "Session is inactive"
      });
      return;
    }

    if (session.expiresAt < new Date()) {
      session.isActive = false;
      await session.save();

      res.status(401).json({
        success: false,
        message: "Session expired"
      });
      return;
    }

    const device = await Device.findById(session.deviceId);

    if (!device) {
      res.status(401).json({
        success: false,
        message: "Device not recognized"
      });
      return;
    }
    const currentIp =
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    if (currentIp !== session.ipAddress) {
      console.log(
        `IP change detected: ${session.ipAddress} -> ${currentIp}`
      );
    }

    session.lastActivity = new Date();
    await session.save();
    req.userId = decoded.userId;
    req.sessionId = decoded.sessionId;
    req.deviceId = device._id.toString();
    console.log(error)
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};