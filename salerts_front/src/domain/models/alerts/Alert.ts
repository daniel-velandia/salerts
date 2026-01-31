export type AlertType = string;

export interface Alert {
  id: string;
  type: AlertType;
  description: string;
  date: string;
  viewed: boolean;
}
