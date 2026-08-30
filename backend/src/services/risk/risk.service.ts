import { SecurityEvent } from "../../models/SecurityEvent.js";
import { calculateRisk } from "./risk.engine.js";
import { RISK_RULES } from "./risk.rules.js";
import { RiskEvent } from "./risk.types.js";

export const calculateSessionRisk = async (
  userId: string,
  sessionId: string
) => {
  const events = await SecurityEvent.find({
    userId,
    sessionId
  }).sort({ createdAt: -1 });

  const riskEvents: RiskEvent[] = events.map((event) => ({
    type: event.type,
    points: RISK_RULES[event.type] ?? 0,
    description: event.description
  }));

  return calculateRisk(riskEvents);
};