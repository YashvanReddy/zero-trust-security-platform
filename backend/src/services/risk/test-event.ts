import mongoose from "mongoose";
import dotenv from "dotenv";
import { SecurityEvent } from "../../models/SecurityEvent.js";

dotenv.config();

const createTestEvent = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const userId = process.argv[2];
  const sessionId = process.argv[3];

  if (!userId || !sessionId) {
    console.log(
      "Usage: npx tsx src/services/risk/test-event.ts USER_ID SESSION_ID"
    );

    process.exit(1);
  }

  await SecurityEvent.create({
    userId,
    sessionId,
    type: "NEW_DEVICE",
    severity: "high",
    description: "New device detected during active session",
    metadata: {
      test: true
    }
  });

  console.log("Test security event created");

  await mongoose.disconnect();
};

createTestEvent();