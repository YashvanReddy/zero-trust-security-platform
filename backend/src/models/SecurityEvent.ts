import mongoose, { Document, Schema } from "mongoose";

export interface ISecurityEvent extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const securityEventSchema = new Schema<ISecurityEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true
    },

    type: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const SecurityEvent =
  mongoose.model<ISecurityEvent>("SecurityEvent", securityEventSchema);