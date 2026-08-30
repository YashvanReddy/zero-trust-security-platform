import {
  RiskEvent,
  RiskResult,
  RiskLevel
} from "./risk.types.js";

export const calculateRisk = (
  events: RiskEvent[]
): RiskResult => {
  let score = 0;

  const reasons: string[] = [];

  for (const event of events) {
    score += event.points;

    reasons.push(
      `${event.description} (+${event.points})`
    );
  }

  score = Math.min(score, 100);

  let level: RiskLevel;

  if (score < 30) {
    level = "low";
  } else if (score < 60) {
    level = "medium";
  } else if (score < 80) {
    level = "high";
  } else {
    level = "critical";
  }

  return {
    score,
    level,
    reasons
  };
};