export type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface RiskEvent {
  type: string;
  points: number;
  description: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  reasons: string[];
}