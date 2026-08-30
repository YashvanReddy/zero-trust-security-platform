import { calculateRisk } from "./risk.engine.js";
import { getAccessDecision } from "../access/access.policy.js";

const result = calculateRisk([
  {
    type: "NEW_DEVICE",
    points: 30,
    description: "New device detected"
  },
  {
    type: "MULTIPLE_FAILED_LOGINS",
    points: 25,
    description: "Multiple failed login attempts"
  },
  {
    type: "UNAUTHORIZED_RESOURCE_ACCESS",
    points: 40,
    description: "Unauthorized resource access attempted"
  }
]);
console.log("Risk Result:");
console.log(result);

console.log(
  "Access Decision:",
  getAccessDecision(result.level)
);