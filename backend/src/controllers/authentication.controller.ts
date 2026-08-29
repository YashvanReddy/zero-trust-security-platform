import { Request, Response } from "express";
import {
  registerUser,
  loginUser
} from "../services/authentication/authentication.service.js";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      user: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed"
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ipAddress =
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const result = await loginUser({
      ...req.body,
      ipAddress
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed"
    });
  }
};