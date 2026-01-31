import type { Alert } from "./Alert";

export interface AlertSummary {
  unreadCount: number;
  alerts: Alert[];
}
