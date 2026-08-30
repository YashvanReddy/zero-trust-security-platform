import { RiskLevel } from "../risk/risk.types.js";

export type AccessDecision =
  | "allow"
  | "mfa"
  | "restrict"
  | "block";

export const getAccessDecision = (
  level: RiskLevel
): AccessDecision => {
  switch (level) {
    case "low":
      return "allow";

    case "medium":
      return "mfa";

    case "high":
      return "restrict";

    case "critical":
      return "block";
  }
};