import mongoose, { Document, Schema } from "mongoose";

export interface IRiskAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  score: number;
  level: "low" | "medium" | "high" | "critical";
  reasons: string[];
  createdAt: Date;
}

const riskAssessmentSchema = new Schema<IRiskAssessment>(
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

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    level: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true
    },

    reasons: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const RiskAssessment =
  mongoose.model<IRiskAssessment>("RiskAssessment", riskAssessmentSchema);   