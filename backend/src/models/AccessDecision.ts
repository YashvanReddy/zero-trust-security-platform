import mongoose, { Document, Schema } from "mongoose";

export interface IAccessDecision extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  resource: string;
  action: string;
  decision: "allow" | "mfa" | "restrict" | "block";
  riskScore: number;
  reason: string;
  createdAt: Date;
}

const accessDecisionSchema = new Schema<IAccessDecision>(
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

    resource: {
      type: String,
      required: true
    },

    action: {
      type: String,
      required: true
    },

    decision: {
      type: String,
      enum: ["allow", "mfa", "restrict", "block"],
      required: true
    },

    riskScore: {
      type: Number,
      required: true
    },

    reason: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const AccessDecision =
  mongoose.model<IAccessDecision>("AccessDecision", accessDecisionSchema);