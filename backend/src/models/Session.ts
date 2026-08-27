import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: mongoose.Types.ObjectId;
  tokenId: string;
  ipAddress: string;
  startedAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    deviceId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true
    },

    tokenId: {
      type: String,
      required: true,
      unique: true
    },

    ipAddress: {
      type: String,
      required: true
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    lastActivity: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);