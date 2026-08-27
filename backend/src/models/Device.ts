import mongoose, { Document, Schema } from "mongoose";

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  isTrusted: boolean;
  lastSeen: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    deviceId: {
      type: String,
      required: true
    },

    deviceName: {
      type: String,
      required: true
    },

    ipAddress: {
      type: String,
      required: true
    },

    userAgent: {
      type: String,
      required: true
    },

    isTrusted: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Device = mongoose.model<IDevice>("Device", deviceSchema);