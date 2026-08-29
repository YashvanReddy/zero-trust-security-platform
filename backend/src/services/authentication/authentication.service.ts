import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../models/user.js";
import { Device } from "../../models/Device.js";
import { Session } from "../../models/Session.js";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  deviceId: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }]
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};

export const loginUser = async (data: LoginData) => {
  const user = await User.findOne({
    email: data.email
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  let device = await Device.findOne({
    userId: user._id,
    deviceId: data.deviceId
  });

  if (!device) {
    device = await Device.create({
      userId: user._id,
      deviceId: data.deviceId,
      deviceName: data.deviceName,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      isTrusted: false
    });
  } else {
    device.ipAddress = data.ipAddress;
    device.userAgent = data.userAgent;
    device.lastSeen = new Date();

    await device.save();
  }

  const tokenId = crypto.randomUUID();

  const expiresAt = new Date(
    Date.now() + 60 * 60 * 1000
  );

  const session = await Session.create({
    userId: user._id,
    deviceId: device._id,
    tokenId,
    ipAddress: data.ipAddress,
    expiresAt,
    isActive: true
  });

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      tokenId
    },
    jwtSecret,
    {
      expiresIn: "1h"
    }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    session: {
      id: session._id,
      deviceId: device._id,
      expiresAt: session.expiresAt
    }
  };
};